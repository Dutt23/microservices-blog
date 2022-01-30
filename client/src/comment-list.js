export default({ comments = []}) =>{

  const decideCommentContent = (commentObj) =>{
    const { status, comment } = commentObj;
    if(status === 'PENDING'){
      return 'Awaiting comment moderation';
    }

    return status === 'BLOCKED' ? 'Comment has been blocked' : comment; 
  }
  const renderedComments = comments.map(comment =>{
    return <li key={comment.id}>{decideCommentContent(comment)}</li>
  })
  return <div>
{renderedComments}
  </div>
}