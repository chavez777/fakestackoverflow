import React, { useState } from 'react';
import { getDateString, getTimeString } from '../utils';

// comment list
export function Comments ({ model, post }) {
  // get list data
  const list = model.getComments(post.comments || []);
  const [page, setPage] = useState(1);
  const [ts, setTs] = useState(Date.now());
  const pageSize = 3;
  // err msg to show
  const [error, setError] = useState('');
  // comment form data
  const [data, setData] = useState({ text: '' });

  if (!model.data.user) {
    return null;
  }

  return (
    <React.Fragment key={ts}>
      <tr className={'comment-box'}>
        <td colSpan={3}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const res = await model.addComment(post, data);
            if (res.status === 0) {
              setTs(Date.now());
              setData({ text: '' });
            } else {
              setError(res.errors.join(' '));
            }
          }
          }>
            <div className="group">
              <div id="error">{error}</div>
            </div>

            <div className="group">
              <label>Add Comment</label>
              <input name="text" value={data.text} onInput={e => setData({ ...data, text: e.target.value })}/>
              <button>Post Comment</button>
            </div>

          </form>
        </td>
      </tr>
      {
        list.length === 0 ?
          null
          : (
            <>
              <tr className={'comment-box'}>
                <td className={'align-left'}>{page > 1 ?
                  <button type={'button'} onClick={() => setPage(page - 1)}>Prev
                    page</button> : null}</td>
                <td className={'align-center'}>Comment Page {page}</td>
                <td className={'align-right'}>{list.length > page * pageSize ?
                  <button type={'button'}
                          onClick={() => setPage(page + 1)}>Next
                    page</button> : null}</td>
              </tr>
              {
                list.slice((page - 1) * pageSize, pageSize + (page - 1) * pageSize).map((v, i) => {
                  return (
                    <tr className={'comment-box'} key={v._id}>
                      <td colSpan={2}>{v.text}</td>
                      <td className="align-right">
                        <div>Commented By <span className="p-askedBy">{v.created_by.name}</span></div>
                        <div>On <span className="p-askedOn">{getDateString(new Date(v.created_date))}</span></div>
                        <div>At <span className="p-askedAt">{getTimeString(new Date(v.created_date))}</span></div>
                      </td>
                    </tr>
                  );
                })
              }
            </>
          )
      }
    </React.Fragment>

  );
}