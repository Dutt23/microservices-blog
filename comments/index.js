const express = require('express');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const comments = {};

const EVENT_HANDLER = {
  'CommentModerated': _commentModeratedHandler
}

app.get('/comments/:id/posts', (req, res) =>{
  res.send(comments[req.params.id] || []);
});

app.post('/comments/:id/posts', (req, res) =>{
  const id = randomBytes(4).toString('hex');
  const postId = req.params.id;
  const { content } = req.body;
  
  const postComments = comments[postId] || [];
  postComments.push({ id, comment: content});
  comments[postId] = postComments;

  axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data :{
      postId,
      id,
      comment: content,
      status: 'PENDING'
    }
  })

  res.status(201).send(postComments);
});

app.post('/events', (req, res) =>{
  console.log("Got event");
  console.log(`Data : ${JSON.stringify(req.body)}`)
  const { type } = req.body;
  const handler = EVENT_HANDLER[type];
  if(handler){
    handler(req.body.data);
  }
  res.send({});
})

function _commentModeratedHandler(data){
  const { id, postId, status } = data
  const postComments = comments[postId];
  const comment = postComments.find(postComment => postComment.id === id);
  comment.status = status;
  console.log(postComments);
  axios.post('http://localhost:4005/events', {
    type: 'CommentUpdated',
    data,
  })
}

app.listen(4001, ()=>{
  console.log("App started on port 4001")
})