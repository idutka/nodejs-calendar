const fs = require('fs');
const path = require('path');
const stream = require('stream');
const csvParser = require('csv-parse');
const lockfile = require('proper-lockfile');

const filePath = path.join('.', 'events.csv');

const lockCsv = () => lockfile.lock(filePath, {
  retries: {
    retries: 500,
    factor: 3,
    minTimeout: 10,
    maxTimeout: 60 * 1000,
    randomize: true
  }
});

const csvParserConfig = {
  delimiter: ',',
  from_line: 1,
  columns: true,
  skip_empty_lines: true
}

const headers = "id,title,location,date,hour";
const getCsvItem = ({id = '', title = '', location = '', date = '', hour = ''}) => `${id},${title},${location},${date},${hour}`
const transformEventsToCsv = (events) => {
  const lineSeparator = "\n";
  const data = events.map(getCsvItem);
  return `${headers}${lineSeparator}${data.join(lineSeparator)}${lineSeparator}`;
}

const addNewEvent = async event => {
  const unlock = await lockCsv();
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath, {flags: 'a'});
    stream.on('error', (err) => {
      reject(err);
      unlock();
    })
    stream.on('finish', () => {
      resolve(event);
      unlock();
    })
    stream.write(getCsvItem(event) + '\n');
    stream.end();
  });
}

const getEvents = async () => {
  return new Promise((resolve) => {
    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      csvParser(data.toString(), csvParserConfig, (err, output) => {
        if (err) throw err;
        resolve(output);
      });
    });
  })
}

const saveEvents = async events => {
  return new Promise((resolve) => {
    fs.writeFile(filePath, transformEventsToCsv(events), (err) => {
      if (err) throw err;
      resolve();
    });
  })
}

const getEventsByLocation = async (location) => {
  return new Promise(((resolve, reject) => {
    const stream = fs.createReadStream(filePath)
    const events = [];
    stream
      .on('error', (err) => {
        reject(err)
      })

      .pipe(csvParser(csvParserConfig))
      .on('data', (row) => {
        if (!location || (location.toLowerCase() === row.location.toLowerCase())) {
          events.push(row);
        }
      })

      .on('end', () => {
        resolve(events)
      })
  }))
}
const getEventById = async (eventId) => {
  if (!eventId) {
    return null;
  }

  return new Promise(((resolve, reject) => {
    const stream = fs.createReadStream(filePath)
    stream
      .on('error', (err) => {
        reject(err)
      })

      .pipe(csvParser(csvParserConfig))
      .on('data', (row) => {
        if (eventId.toString() === row.id.toString()) {
          stream.close();
          resolve(row)
        }
      })

      .on('end', () => {
        resolve(null)
      })
  }))
}

const updateEvent = async (id, data) => {
  const unlock = await lockCsv();
  try {
    let events = await getEvents();
    const event = events.find(event => event.id.toString() === id.toString());
    if (!event) {
      throw new Error('Not Found')
    }
    const {title, location, date, hour} = data;
    event.title = title;
    event.location = location;
    event.date = date;
    event.hour = hour;
    await saveEvents(events);
  } finally {
    await unlock();
  }
}

const deleteEventById = async (id) => {
  const unlock = await lockCsv();
  try {
    let events = await getEvents();
    events = events.filter(event => event.id.toString() !== id.toString());
    await saveEvents(events);
  } finally {
    await unlock();
  }
}

const createCSVStream = async () => {
  const events = await getEvents();
  return stream.Readable.from(JSON.stringify(events));
}

module.exports.filePath = filePath;
module.exports.getEventsByLocation = getEventsByLocation;
module.exports.getEventById = getEventById;
module.exports.addNewEvent = addNewEvent;
module.exports.updateEvent = updateEvent;
module.exports.deleteEventById = deleteEventById;
module.exports.createCSVStream = createCSVStream;
