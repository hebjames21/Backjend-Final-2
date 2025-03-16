import { useState } from 'react';
import axios from 'axios';

function Register({ setAuth }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    axios.post('http://localhost:3000/api/auth/register', { username, email, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        setAuth(true);
      })
      .catch(err => console.log('Error registering:', err));
  };

  return (
    <div>
      <h2>Register</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;