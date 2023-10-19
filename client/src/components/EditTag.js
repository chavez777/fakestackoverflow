import React from 'react';
import { useState } from 'react';

// login page
export function EditTag (props) {
  const { model, navigate } = props;
  // err msg to show
  const [error, setError] = useState('');
  // login form data
  const [data, setData] = useState(props.data);

  return <div className="page" data-page="addAnswer">
    <h1>Edit Tag</h1>
    <form onSubmit={async (e) => {
      e.preventDefault();
      const res = await model.editTag(data);
      if (res.status === 0) {
        navigate('profile');
      } else {
        setError(res.errors.join(' '));
      }
    }
    }>
      <div className="group">
        <div id="error">{error}</div>
      </div>

      <div className="group">
        <label>Name</label>
        <input name="name" value={data.name} onInput={e => setData({ ...data, name: e.target.value })}/>
      </div>


      <button className="primary">Edit</button>
      <button className="danger" type={'button'} onClick={async () => {
        const res = await model.deleteTag(data._id);
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