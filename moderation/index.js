const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const EVENT_HANDLER = {
  'CommentCreated': _commentCreatedHandler
}

const MODERATED_WORDS = {
  'ORANGE': true
}

app.post('/events', (req, res) =>{
  const { type, data } = req.body;
  const handler = EVENT_HANDLER[type];
  if(handler){
    handler(data);
  }
  res.send({status: 'OK'})
});


function _commentCreatedHandler(data){
  const { comment, status } = data;
  if(status !== 'PENDING'){
    return ;
  }

  const newStatus = _moderateComment(comment) ? 'APPROVED' : 'BLOCKED';
  axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentModerated',
      data :{...data,
      status: newStatus,
      }
  })
}

function _moderateComment(comment){
  const words = comment.split(' ');
  for(const word of words){
    if(MODERATED_WORDS[word.toUpperCase()]){
      return false
    }
  }
  return true;
}

app.listen(4003, () =>{
  console.log('Moderation service listening on port 4003');
  axios.get('http://event-bus-srv:4005/events').then(res =>{
    const events = res.data;
    for(const event of events){
      const { type, data } = event;
      const handler = EVENT_HANDLER[type];
      if(handler){
        handler(data)
      }
    }
  })
})

