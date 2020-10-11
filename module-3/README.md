## Module 3

###### run server:
```shell script
node server.js
```

* Generate csv file with events data (id, title, location, date, hour, etc)\
 `events.csv`, 

* Create GET /events?location=lviv endpoint which returns events from csv file in json format. It should support possible filtering events by location (passed as query parameter).
###### request:
```shell script
curl --request GET 'http://localhost:3000/events' --header 'Content-Type: application/json'
```
###### response:
```shell script
[
    {
        "id": "1",
        "title": "Event 1",
        "location": "Lviv",
        "date": "2020-10-21",
        "hour": "22:00"
    },
    {
        "id": "2",
        "title": "Event 2",
        "location": "Kiev",
        "date": "2020-11-11",
        "hour": "19:15"
    }
]
```
###### request:
```shell script
curl --request GET 'http://localhost:3000/events?location=lviv' --header 'Content-Type: application/json'
```
###### response:
```shell script
[
    {
        "id": "1",
        "title": "Event 1",
        "location": "Lviv",
        "date": "2020-10-21",
        "hour": "22:00"
    }
]
```

* Create GET /events/:eventId endpoint for getting some specific event by id.
###### request:
```shell script
curl --request GET 'http://localhost:3000/events/2' --header 'Content-Type: application/json'
```
###### response:
```shell script
{
    "id": "2",
    "title": "Event 2",
    "location": "Kiev",
    "date": "2020-11-11",
    "hour": "19:15"
}
```

* Create POST /events endpoint for saving new event to the csv file.
###### request:
```shell script
curl --request POST 'http://localhost:3000/events' \
--header 'Content-Type: application/json' \
--data-raw '{"id": 3, "title": "Event 3", "location": "IF", "date": "2021-01-01", "hour": "12:00"}'
```
###### response:
```shell script
{
    "id": 3,
    "title": "Event 3",
    "location": "IF",
    "date": "2021-01-01",
    "hour": "12:00"
}
```

* Create PUT /events/:eventId endpoint for replacing specific event data in csv file.
###### request:
```shell script
curl --request PUT 'http://localhost:3000/events/3' \
--header 'Content-Type: application/json' \
--data-raw '{"id": 3, "title": "Event 3 (Updated)", "location": "IF", "date": "2021-01-01", "hour": "14:00"}'
```
###### response:
```shell script
{
    "id": "3",
    "title": "Event 3 (Updated)",
    "location": "IF",
    "date": "2021-01-01",
    "hour": "14:00"
}
```

* Create GET /events-batch endpoint which returns all events in json format via streaming directly from csv file.
###### request:
```shell script
curl --request GET 'http://localhost:3000/events-batch' --header 'Content-Type: application/json'
```
###### response:
```shell script
[
    {
        "id": "1",
        "title": "Event 1",
        "location": "Lviv",
        "date": "2020-10-21",
        "hour": "22:00"
    },
    {
        "id": "2",
        "title": "Event 2",
        "location": "Kiev",
        "date": "2020-11-11",
        "hour": "19:15"
    },
    {
        "id": "3",
        "title": "Event 3 (Updated)",
        "location": "IF",
        "date": "2021-01-01",
        "hour": "14:00"
    }
]
```
