import React from 'react';

// tags page
export function Tags ({ model, navigate }) {
  // get tags data
  const tags = model.data.tags;

  // chunk tags, 3 tags a line
  const chunk = [];
  tags.forEach((v, i) => {
    if (i % 3 === 0) {
      chunk.push([]);
    }
    chunk[chunk.length - 1].push(v);
  });

  return <div className="page" data-page="tags">
    <table>
      <thead>
      <tr>
        <td width="33.3%" className="align-center"><span id="tn">{tags.length}</span> Tags</td>
        <td id="tt" width="33.3%" className="align-center">All Tags</td>
        <td width="33.3%" className="align-right">
          {
            !!model.data.user && <button type="button" data-link="addQuestion" className="primary">Ask A Question</button>
          }

        </td>
      </tr>
      </thead>
      <tbody>
      {
        tags.length === 0 ? <tr><td colSpan={3} className={'align-center'}>No tags yet.</td></tr> :
          chunk.map((tags, i) => <tr key={i}>
              {tags.map((v) => {
                // get questions of the tag
                const questionsOfTag = model.queryQuestions(`[${v.name}]`);
                return (
                  <td className="align-center" key={v._id}>
                    <div className="tag-box">
                      <div className="tag-name"
                           onClick={() => navigate('questions', { query: `[${v.name}]` })}>{v.name}</div>
                      <div
                        className="tag-num">{questionsOfTag.length} {questionsOfTag.length === 1 ? 'question' : 'questions'}</div>
                    </div>
                  </td>
                );
              })}
            </tr>
          )
      }
      </tbody>
    </table>
  </div>;
}