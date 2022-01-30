import React from 'react'
import PostCreate from './post-create'
import PostList from './post-list'

export default () =>{
  return <div className='container'> 
    <h1>Create Post</h1>
    <PostCreate />
    <hr/>
    <h1>Post list</h1>
    <PostList />
       </div>
}