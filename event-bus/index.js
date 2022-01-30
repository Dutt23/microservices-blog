const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const services = [
  { port: 4000, name: 'posts'},
  { port: 4001, name: 'comment'},
  { port: 4002, name: 'query'},
  { port: 4003, name: 'moderation'}
]

const events = [];
app.post('/events', (req, res) =>{
  const event  = req.body;
  console.log(`EVENT + ${JSON.stringify(event)}`)
  const promiseList = [];
  events.push(event);
  for(const service of services){

    try {
      const result = axios.post(`http://localhost:${service.port}/events`, event);
      promiseList.push(result);
    }
    catch(e){
      console.log(`Could not emit event to ${service.name}`);
      console.log(`Failed with error ${e}`);
    }
  }
  console.log(`Sent events out to ${promiseList.length} listeners with body ${JSON.stringify(event)}`);

  res.send({ status: 'OK'})

})

app.get('/events', (req, res)=>{
  res.send(events);
})

app.listen(4005, () =>{
  console.log('Event bus started on port 4005')
})