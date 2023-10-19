import React, { useState } from 'react';
import { getDateString, getTimeString } from '../utils';
import { Vote } from './Vote';

// questions list page
export function Questions ({ model, query, navigate }) {
  // get list data
  const list = model.queryQuestions(query);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  return <div className="page" data-page="questions">
    <table className="questions-table">
      <thead>
      <tr>
        <td className="align-center" width="15%"><span id="qn">{list.length}</span> Questions</td>
        <td className="align-center" id="qt" width="70%">All Questions</td>
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
                        <Vote readonly post={v} model={model}/>
                      </td>
                      <td>
                        <div className="p-title"
                             onClick={() => navigate('question', { questionId: v._id })}>{v.title}</div>
                        {v.tags.map((t, i) => {
                          const tag = model.getTagDetail(t);
                          if (i > 0 && i % 4 === 0) {
                            // break line on each 4 tags
                            return <React.Fragment key={i}><br/><span className="tag">{tag.name}</span></React.Fragment>;
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
  </div>;
}