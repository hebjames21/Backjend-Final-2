import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Login from './login';
import Register from './register';
import LoggedIn from "./LoggedIn.jsx";

function App() {
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [edit, setEdit] = useState({ title: "" });
  const [render, setRender] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [newToDo, setNewToDo] = useState({ title: "", created: Date.now() });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (isAuthenticated) {
      axios.get("http://localhost:3000/api/todos", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => {
          console.log("Fetched todos:", res.data.todos);
          setData(res.data.todos);
        })
        .catch(err => console.log("Error fetching todos:", err));
    }
  }, [flag, render, isAuthenticated]);

  const handleNewToDo = (e) => {
    setNewToDo({ ...newToDo, title: e.target.value });
  };

  const handleSubmit = () => {
    axios.post("http://localhost:3000/api/todos", newToDo, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setNewToDo({ title: "", created: Date.now() });
        setFlag(!flag);
      })
      .catch(err => console.log("Error creating todo:", err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/api/todos/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setData(data.filter(item => item._id !== id));
      })
      .catch(err => console.log("Error deleting todo:", err));
  };

  const handleEdit = (id) => {
    setEditItemId(id);
    setRender(!render);
  };

  const handleEditSubmit = (id) => {
    axios.put(`http://localhost:3000/api/todos/${id}`, edit, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setData(data.map(item => item._id === id ? res.data.todo : item));
        setRender(!render);
      })
      .catch(err => console.log("Error updating todo:", err));
  };

  const handleEditChange = (e) => {
    setEdit({ title: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <>
      {!isAuthenticated ? (
        <>
          <Login setAuth={setIsAuthenticated} />
          <Register setAuth={setIsAuthenticated} />
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>

          <p>Hannah's Final That Took Her A Month To Complete</p>
          
          <div style={{ marginBottom: "20px" }}>
            <input
              value={newToDo.title || ""}
              onChange={handleNewToDo}
              placeholder="Enter a new todo"
            />
            <button onClick={handleSubmit}>New Todo</button>
          </div>
          
          {data && data.sort((a, b) => b.created - a.created).map(item => (
            <div key={item._id} style={{ marginBottom: "20px" }}>
              <div id={item._id} style={{ border: '2px solid black' }}>
                {render && editItemId === item._id ? (
                  <div>
                    <input
                      defaultValue={item.title || ""}
                      onChange={handleEditChange}
                    />
                    <button onClick={() => handleEditSubmit(item._id)}>Submit</button>
                  </div>
                ) : (
              
                  <p>{item.title}</p>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button onClick={() => handleDelete(item._id)}>delete</button>
                  <button onClick={() => handleEdit(item._id)}>edit</button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default App;
