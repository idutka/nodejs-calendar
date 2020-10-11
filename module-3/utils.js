const fs = require('fs').promises;
const path = require('path');
const parse = require('csv-parse');
const parseSync = require('csv-parse/lib/sync');

const filePath = path.join('.', 'events.csv');

const transformEventsToCsv = (events) => {
  const lineSeparator = "\n";
  const headers = "id,title,location,date,hour";
  const data = events.map(({id = '', title = '', location = '', date = '', hour = ''}) => `${id},${title},${location},${date},${hour}`);
  return `${headers}${lineSeparator}${data.join(lineSeparator)}`;
}

const parseCsv = (csv) => {
  const [header, ...events] = csv.toString().split('\n');
  const keys = header.split(',');
  return events.map(item => {
    const values = item.split(',');
    return keys.reduce((acc, key, index) => ({
      ...acc,
      [key]: values[index]
    }), {});
  });
}

const saveEvents = async events => {
  await fs.writeFile(filePath, transformEventsToCsv(events));
}

const getEvents = async () => {
  const data = await fs.readFile(filePath);
  return new Promise((resolve, reject) => {
    parse(data.toString(), {
      columns: true,
      skip_empty_lines: true
    }, (err, output) => {
      if (err) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  })
}

const parseCSV = csv => parseSync(csv, {
  columns: true,
  skip_empty_lines: true
})

module.exports.filePath = filePath;
module.exports.getEvents = getEvents;
module.exports.saveEvents = saveEvents;
module.exports.parseCSV = parseCSV;
