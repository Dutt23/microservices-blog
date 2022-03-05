const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const services = [
  { port: 4000, name: 'posts', ip: 'post-clusterip-srv'},
  { port: 4001, name: 'comment', ip: 'comments-srv'},
  { port: 4002, name: 'query', ip: 'query-srv'},
  { port: 4003, name: 'moderation', ip: 'moderation-srv'}
]

const events = [];
app.post('/events', async (req, res) =>{
  const event  = req.body;
  console.log(`EVENT + ${JSON.stringify(event)}`)
  const promiseList = [];
  events.push(event);
  for(const service of services){
    const host = service.ip ??  'localhost'
    const result = axios.post(`http://${host}:${service.port}/events`, event);
    promiseList.push(result);
  }

  try {
    await Promise.all(promiseList)
  }
  catch(e){
    console.log(`Failed with error ${e}`);
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