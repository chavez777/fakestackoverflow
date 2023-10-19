import React from 'react';
import { useEffect } from 'react';
import { getDateString, getTimeString } from '../utils';
import { Comments } from './Comments';
import { Vote } from './Vote';

// single question page
export function Question ({ qid, model, navigate }) {
  // inc question's view count on mounted
  useEffect(() => {
    model.incQuestionView(qid);
  }, [model, qid]);

  // question's data
  const question = model.getQuestionDetail(qid);
  const answers = question.answers.map(v => model.getAnswerDetail(v));

  // sort answer by date desc
  answers.reverse();
  answers.sort((a, b) => {
    return new Date(b.ans_date_time).getTime() - new Date(a.ans_date_time).getTime();
  });

  return <div className="page" data-page="question">
    <table>
      <thead>
      <tr>
        <td width="15%"><b id="qa">{question.answers.length}</b> Answers</td>
        <td className="align-center detail-title" width="70%"><b id="qt">{question.title}</b></td>
        <td className="align-right" width="15%">

          {
            !!model.data.user && <button type="button" data-link="addQuestion" className="primary"
                                         onClick={() => navigate('addQuestion')}>Ask
              A Question
            </button>
          }
        </td>
      </tr>
      <tr>
        <td>
          <b id="qv">{question.views + 1}</b> Views
          <br/>
          <br/>
          <Vote post={question} model={model}/>

        </td>
        <td className="align-center" id="qtext">{question.text}</td>
        <td className="align-right">
          <div>Asked By <span className="p-askedBy">{question.asked_by.name}</span></div>
          <div>On <span className="p-askedOn">{getDateString(new Date(question.asked_date_time))}</span></div>
          <div>At <span className="p-askedAt">{getDateString(new Date(question.asked_date_time))}</span></div>
        </td>
      </tr>
      </thead>
      <tbody className="answers">
      <Comments model={model} post={question}/>
      <tr>
        <td colSpan={3}><h2>Answers</h2></td>
      </tr>
      {answers.map((v, i) => {
        return <React.Fragment key={v._id}>
          <tr>
            <td>
              <Vote post={v} model={model}/>
            </td>
            <td>{v.text}</td>
            <td className="align-right">
              <div>Ans By <span className="p-askedBy">{v.ans_by.name}</span></div>
              <div>On <span className="p-askedOn">{getDateString(new Date(v.ans_date_time))}</span></div>
              <div>At <span className="p-askedAt">{getTimeString(new Date(v.ans_date_time))}</span></div>
            </td>
          </tr>
          <Comments model={model} post={v}/>
        </React.Fragment>;
      })}
      {
        !!model.data.user && <tr>
          <td colSpan={3} className={'align-center'}>
            <button className="primary" type="button" onClick={() => navigate('addAnswer')}>Answer Question</button>

          </td>
        </tr>
      }
      </tbody>
    </table>
  </div>;
}