const fs = require('fs');
const stream = require('stream');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const {filePath, getEvents, saveEvents, parseCSV} = require('./utils');

app.use(bodyParser.json());

app.get('/events', async (req, res, next) => {
  const events = await getEvents();
  const location = req.query.location;

  if (location) {
    return res.json(events.filter(event => event.location.toLowerCase() === location.toLowerCase()));
  }

  res.json(events);
});

app.get('/events/:eventId', async (req, res) => {
  const events = await getEvents();
  const eventId = req.params.eventId;
  const event = events.find(event => event.id.toString() === eventId.toString());

  if (!event) {
    return res.sendStatus(404);
  }

  res.json(event);
});

app.post('/events', async (req, res, next) => {
  let events = await getEvents();
  const {id, title, location, date, hour} = req.body;

  const isEventExist = events.some(event => event.id.toString() === id.toString());
  if (!id || isEventExist) {
    return res.sendStatus(400);
  }

  const newEvent = {id, title, location, date, hour};
  events.push(newEvent);
  await saveEvents(events);
  res.json(newEvent);
});

app.put('/events/:eventId', async (req, res) => {
  let events = await getEvents();
  const eventId = req.params.eventId;
  const event = events.find(event => event.id.toString() === eventId.toString());
  if (!event) {
    return res.sendStatus(404);
  }

  const {title, location, date, hour} = req.body;

  event.title = title;
  event.location = location;
  event.date = date;
  event.hour = hour;
  await saveEvents(events);
  res.json(event);
});

app.delete('/events/:eventId', async (req, res) => {
  let events = await getEvents();
  const eventId = req.params.eventId;
  const event = events.filter(event => event.id.toString() === eventId.toString());
  if (!event) {
    return res.sendStatus(404);
  }

  events = events.filter(event => event.id.toString() !== eventId);
  await saveEvents(events);
  res.sendStatus(200);
});

app.get('/events-batch', async (req, res) => {
  const reader = fs.createReadStream(filePath);
  const streamParseEvent = new stream.Transform({
    transform(chunk, encoding, callback) {
      callback(null, JSON.stringify(parseCSV(chunk.toString())));
    }
  });
  reader.pipe(streamParseEvent).pipe(res.type('json'));
});

app.listen(PORT, () => {
  console.log(`server start at port ${PORT}`);
});
