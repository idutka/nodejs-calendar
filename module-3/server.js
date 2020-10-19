const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const {
  getEventsByLocation,
  getEventById,
  addNewEvent,
  createCSVStream,
  updateEvent,
  deleteEventById,
} = require('./utils');

app.use(bodyParser.json());

app.get('/events', async (req, res) => {
  const { location } = req.query;
  const events = await getEventsByLocation(location);
  res.json(events);
});

app.get('/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const event = await getEventById(eventId);

  if (!event) {
    return res.sendStatus(404);
  }

  res.json(event);
});

app.post('/events', async (req, res) => {
  const {title, location, date, hour} = req.body;

  const id = Math.random().toString().substr(2, 6);
  const newEvent = {id, title, location, date, hour};
  await addNewEvent(newEvent);
  res.json(newEvent);
});

app.put('/events/:eventId', async (req, res) => {
  const id = req.params.eventId;
  const {title, location, date, hour} = req.body;
  const newEvent = {id, title, location, date, hour};
  await updateEvent(id, newEvent);
  res.json(newEvent);
});

app.delete('/events/:eventId', async (req, res) => {
  const eventId = req.params.eventId;
  await deleteEventById(eventId);
  res.sendStatus(200);
});

app.get('/events-batch', async (req, res) => {
  const stream = await createCSVStream();
  stream.pipe(res.type('json'));
});

app.listen(PORT, () => {
  console.log(`server start at port ${PORT}`);
});
