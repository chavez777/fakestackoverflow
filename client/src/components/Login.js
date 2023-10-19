import React from 'react';
import { useState } from 'react';

// login page
export function Login ({ model, qid, navigate }) {
  // err msg to show
  const [error, setError] = useState('');
  // login form data
  const [data, setData] = useState({ email: '', password: '' });

  return <div className="page" data-page="addAnswer">
    <h1>Login</h1>
    <form onSubmit={async (e) => {
      e.preventDefault();
      const res = await model.login(data);
      if (res.status === 0) {
        navigate('questions');
      } else {
        setError(res.errors.join(' '));
      }
    }
    }>
      <div className="group">
        <div id="error">{error}</div>
      </div>

      <div className="group">
        <label htmlFor="email">Email</label>
        <input name="email" id="email" value={data.email} onInput={e => setData({ ...data, email: e.target.value })}/>
      </div>

      <div className="group">
        <label htmlFor="password">Password</label>
        <input name="password" id="password" type={'password'} value={data.password}
               onInput={e => setData({ ...data, password: e.target.value })}/>
      </div>

      <button className="primary">Login</button>
    </form>
  </div>;
}