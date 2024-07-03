import React from "react";
 
const Blog = ({ blog, expanded, toggleExpand, like, deleteBlog, loggedUser }) => (
  <li className="blog">
    {blog.title} {blog.author}
    {expanded && (
      <><div id="moreInfo">
        <p>URL: {blog.url}</p>
        <div>likes: {blog.likes} <button id="likeButton" onClick={() => like(blog.id)}>like</button></div>
        <div>{loggedUser.username}</div>
        {blog.user.username === loggedUser.username &&(
          <button id="delButton" onClick = {() => deleteBlog(blog.id)}>remove</button>
        )}
      </div>
      </>
    )}
    <button id="show" onClick={toggleExpand}>
      {expanded ? 'Show Less' : 'Show More'}
    </button>
  </li>
);

export default Blog

