const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};

app.get('/posts', (req, res) =>{
  res.send(posts);
})

app.post('/posts/create', (req, res) =>{
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  posts[id] = {
    title,
    id
  };

  axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data :posts[id]
  })
  res.status(201).send(posts[id]);
})

app.post('/events', (req, res) =>{
  console.log("Got event");
  console.log(`Data : ${JSON.stringify(req.body)}`)
  res.send({});
})

app.listen(4000, () =>{
  console.log('V2');
  console.log("Listening to port 4000")
})