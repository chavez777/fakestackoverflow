import React from 'react';
import { useState } from 'react';

// add answer page
export function AddAnswer ({ model, qid, navigate }) {
  // err msg to show
  const [error, setError] = useState('');
  // answer form data
  const [data, setData] = useState({ text: '', username: '' });

  return <div className="page" data-page="addAnswer">
    <form onSubmit={async (e) => {
      e.preventDefault();
      const res = await model.addAnswer(data, qid);
      if (res.status === 0) {
        // success
        // go to question page
        navigate('question');
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
        <label htmlFor="text">Answer Text</label>
        <textarea name="text" id="text" rows="10" value={data.text}
                  onInput={e => setData({ ...data, text: e.target.value })}/>
      </div>

      <button className="primary">Post Answer</button>
    </form>
  </div>;
}