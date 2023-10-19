import React, { useState } from 'react';
import { getDateString, getTimeString } from '../utils';

// questions list page
export function Profile ({ model, navigate }) {
  // get list data
  const list = model.myQuestions();
  const answers = model.myAnswers();
  const tags = model.myTags();
  const [page, setPage] = useState(1);
  const pageSize = 5;

  return <div className="page profile-page">

    <main>
      <h1>My Profile</h1>
      <p>
        Joined fake stackoverflow at {getDateString(new Date(model.data.user.created_date || Date.now()))}
      </p>
      <p>My reputations: {model.data.user.score || 0}</p>
      <br/>
      <table className="questions-table">
        <thead>
        <tr>
          <td className="align-center" width="15%"><span id="qn">{list.length}</span> Questions</td>
          <td className="align-center" id="qt" width="70%">My Questions</td>
          <td className="align-right" width="15%">
            {
              !!model.data.user && <button type="button" data-link="addQuestion" className="primary"
                                           onClick={() => navigate('addQuestion')}>Ask
                A Question
              </button>
            }
          </td>
        </tr>
        </thead>
        <tbody>
        {
          list.length === 0 ?
            <tr>
              <td colSpan={3} className={'align-center'}>No question yet. Try to create one!</td>
            </tr>
            : (
              <>
                <tr>
                  <td className={'align-left'}>{page > 1 ?
                    <button type={'button'} onClick={() => setPage(page - 1)}>Prev
                      page</button> : null}</td>
                  <td className={'align-center'}>Page {page}</td>
                  <td className={'align-right'}>{list.length > page * pageSize ?
                    <button type={'button'}
                            onClick={() => setPage(page + 1)}>Next
                      page</button> : null}</td>
                </tr>
                {
                  list.slice((page - 1) * pageSize, pageSize + (page - 1) * pageSize).map((v, i) => {
                    return (
                      <tr className={i === list.length - 1 ? 'last' : ''} key={v._id}>
                        <td className="align-center">
                          <div className="p-views">{v.views} Views</div>
                          <div className="p-answers">{v.answers.length} Answers</div>
                        </td>
                        <td>
                          <div className="p-title"
                               onClick={() => navigate('editQuestion', { data: v })}>{v.title}</div>
                          {v.tags.map((t, i) => {
                            const tag = model.getTagDetail(t);
                            if (i > 0 && i % 4 === 0) {
                              // break line on each 4 tags
                              return <React.Fragment key={i}><br/><span
                                className="tag">{tag.name}</span></React.Fragment>;
                            } else {
                              return <span key={i} className="tag">{tag.name}</span>;
                            }
                          })}
                        </td>
                        <td className="align-right">
                          <div>Asked By <span className="p-askedBy">{v.asked_by.name}</span></div>
                          <div>On <span className="p-askedOn">{getDateString(new Date(v.asked_date_time))}</span></div>
                          <div>At <span className="p-askedAt">{getTimeString(new Date(v.asked_date_time))}</span></div>
                        </td>
                      </tr>
                    );
                  })
                }
              </>
            )
        }
        </tbody>
      </table>
    </main>

    <aside>
      <h2>Answers created</h2>

      {
        answers.length === 0 && <p>No answers yet.</p>
      }
      <ul>
        {
          answers.map(v => {
            return (
              <li key={v._id}>
                <a href={'#'}
                   onClick={() => navigate('editAnswer', { data: v })}>{v.text}</a>
              </li>
            );
          })
        }
      </ul>
      <h2>Tags created</h2>
      {
        tags.length === 0 && <p>No tags yet.</p>
      }
      {
        tags.map(v => {
          return (
            <div className="tag-box" key={v._id} style={{ marginRight: 10, marginBottom: 10 }}>
              <div className="tag-name"
                   onClick={() => navigate('editTag', { data: v })}>{v.name}</div>
            </div>
          );
        })
      }
    </aside>
  </div>;
}
