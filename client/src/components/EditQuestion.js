import React from 'react';
import { useState } from 'react';

// add question page
export function EditQuestion (props) {
  const { model, navigate } = props;
  // err msg to show
  const [error, setError] = useState('');
  // form data
  const [data, setData] = useState({
    ...props.data,
    tags: props.data.tags.map(v => model.getTagDetail(v).name).join(' ')
  });

  return <div className="page" data-page="addQuestion">
    <form onSubmit={async (e) => {
      e.preventDefault();
      const res = await model.editQuestion(data);
      if (res.status === 0) {
        // success
        // go to questions page
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

      <button className="primary">Edit Question</button>
      <button className="danger" type={'button'} onClick={async () => {
        const res = await model.deleteQuestion(data._id);
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