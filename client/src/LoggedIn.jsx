import React, { useState } from 'react';
import axios from 'axios';

const LoggedIn = () => {
  const [title, setTitle] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
   
    console.log("Sending todo with title:", title);
    
    const todoData = {
      title: title
    };
    

    axios.post('/api/todos', todoData)
      .then(response => {
        console.log('Todo created successfully:', response.data);
        setTitle(''); 
      })
      .catch(error => {
        console.error('Error creating todo:', error.response?.data || error.message);
      });
  };

  return (
    <div>
      <h2>Create New Todo</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Create Todo</button>
      </form>
    </div>
  );
};

export default LoggedIn;