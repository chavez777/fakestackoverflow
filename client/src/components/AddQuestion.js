import React from 'react';
import { useState } from 'react';

// add question page
export function AddQuestion ({ model, navigate }) {
  // err msg to show
  const [error, setError] = useState('');
  // form data
  const [data, setData] = useState({ title: '', text: '', tags: '', username: '' });

  return <div className="page" data-page="addQuestion">
    <form onSubmit={async (e) => {
      e.preventDefault();
      const res = await model.addQuestion(data);
      if (res.status === 0) {
        // success
        // go to questions page
        navigate('questions');
      } else {
        // failed, show error
        setError(res.errors.join(' '));
      }
    }
    }>
      <div className="group">
        <div id="error">{error}</div>
      </div>

      <div className="group">
        <label htmlFor="title">Question Title</label>
        <div>This should not be more than 100 characters.</div>
        <input name="title" id="title" value={data.title} onInput={e => setData({ ...data, title: e.target.value })}/>
      </div>

      <div className="group">
        <label htmlFor="text">Question Text</label>
        <div>Add details.</div>
        <textarea name="text" id="text" rows="10" value={data.text}
                  onInput={e => setData({ ...data, text: e.target.value })}/>
      </div>

      <div className="group">
        <label htmlFor="tags">Tags</label>
        <div>Add keywords seperated by whitespaces.</div>
        <input name="tags" id="tags" value={data.tags} onInput={e => setData({ ...data, tags: e.target.value })}/>
      </div>

      <button className="primary">Post Question</button>
    </form>
  </div>;
}