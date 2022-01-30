const express = require('express');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(cors())

const posts = {};
const postComments = {};

const EVENT_TYPES ={
  'PostCreated': _handlePostCreatedEvent,
  'CommentCreated': _handleCommentCreatedEvent,
  'CommentUpdated': _handleCommentUpdateEvent
}

app.post('/events', (req, res) =>{
  const { type, data } = req.body;
  const handler = EVENT_TYPES[type];
  if(handler){
    handler(data)
  }
  res.send({});
})

app.get('/posts', (req, res) =>{
  const response = Object.values(posts).reduce((acc, post) => {
    const postDetails = {
      id: post.id,
      title: post.title,
      comments : postComments[post.id]
    }
    acc[post.id] = postDetails;
    return acc;
  }, {})
  res.send(response);
});

function _handlePostCreatedEvent (data) {
  const postId = data.id;
  if(posts[postId]){
    throw new Error("Already created");
  }
  posts[postId] = data;
}

function _handleCommentCreatedEvent (data) {
  const postId = data.postId;
  if(!posts[postId]){
    throw new Error("Post Id in valid");
  }
  if(!postComments[postId]){
    postComments[postId] = [];
  }
  postComments[postId].push(data);
}

function _handleCommentUpdateEvent (data) {
  const {  postId, id }= data;
  const postComment = postComments[postId];
  for(let i = 0; i< postComment.length ;i ++){
    const comment = postComment[i];
    if(comment.id === id){
      postComment[i] = data;
    }
  }

}

app.listen(4002, () =>{
  console.log("Query service listening on port 4003");
  axios.get('http://localhost:4005/events').then(res =>{
    const events = res.data;
    for(const event of events){
      const { type, data } = event;
      const handler = EVENT_TYPES[type];
      if(handler){
        handler(data)
      }
    }
  }) 
})