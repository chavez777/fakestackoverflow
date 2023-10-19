import React from 'react';
import { useState } from 'react';

// add answer page
export function EditAnswer (props) {
  const { model, navigate } = props;
  // err msg to show
  const [error, setError] = useState('');
  // answer form data
  const [data, setData] = useState(props.data);

  return <div className="page" data-page="addAnswer">
    <form onSubmit={async (e) => {
      e.preventDefault();
      const res = await model.editAnswer(data);
      if (res.status === 0) {
        // success
        // go to question page
        navigate('profile');
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

      <button className="primary">Edit</button>
      <button className="danger" type={'button'} onClick={async () => {
        const res = await model.deleteAnswer(data._id);
        if (res.status === 0) {
          navigate('profile');
        } else {
          setError(res.errors.join(' '));
        }
      }
      }>Delete
      </button>
    </form>
  </div>;
}