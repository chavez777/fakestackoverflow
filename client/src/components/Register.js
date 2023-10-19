import React from 'react';
import { useState } from 'react';

export function Register ({ model, qid, navigate }) {
  const [error, setError] = useState('');
  const [data, setData] = useState({ name: '', email: '', password: '', confirm: '' });

  return <div className="page" data-page="addAnswer">
    <h1>Register</h1>
    <form onSubmit={async (e) => {
      e.preventDefault();
      const res = await model.register(data);
      if (res.status === 0) {
        navigate('login');
      } else {
        setError(res.errors.join(' '));
      }
    }
    }>
      <div className="group">
        <div id="error">{error}</div>
      </div>

      <div className="group">
        <label htmlFor="name">Name</label>
        <input name="name" id="name" value={data.name} onInput={e => setData({ ...data, name: e.target.value })}/>
      </div>

      <div className="group">
        <label htmlFor="email">Email</label>
        <input name="email" id="email" value={data.email} onInput={e => setData({ ...data, email: e.target.value })}/>
      </div>

      <div className="group">
        <label htmlFor="password">Password</label>
        <input name="password" type={'password'} id="password" value={data.password}
               onInput={e => setData({ ...data, password: e.target.value })}/>
      </div>

      <div className="group">
        <label htmlFor="confirm">Confirm</label>
        <input name="confirm" type={'password'} id="confirm" value={data.confirm}
               onInput={e => setData({ ...data, confirm: e.target.value })}/>
      </div>

      <button className="primary">Register</button>
    </form>
  </div>;
}