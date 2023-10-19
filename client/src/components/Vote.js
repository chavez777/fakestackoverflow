import React, { useState } from 'react';

export function Vote ({ model, readonly, post }) {
  const [ts, setTs] = useState(Date.now());

  return (
    <React.Fragment key={ts}>
      {
        readonly || !model.data.user ? <>
          <span className={'vote'}>Up Vote <b>{post.votes.filter(v => v.value > 0).length}</b></span>
          <span className={'vote'}>Down Vote <b>{post.votes.filter(v => v.value < 0).length}</b></span>
        </> : <>
          <button className={'vote'} disabled={!model.data.user}
                  onClick={async () => {
                    await model.vote(post, 5);
                    setTs(Date.now());
                  }}>
            Up Vote <b>{post.votes.filter(v => v.value > 0).length}</b>
          </button>
          <button className={'vote'} disabled={!model.data.user} onClick={async () => {
            await model.vote(post, -10);
            setTs(Date.now());
          }}>Down
            Vote <b>{post.votes.filter(v => v.value < 0).length}</b></button>
        </>
      }
    </React.Fragment>

  );
}