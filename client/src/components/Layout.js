import React from 'react';
import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { Questions } from './Questions';
import { Question } from './Question';
import { AddAnswer } from './AddAnswer';
import { AddQuestion } from './AddQuestion';
import { Tags } from './Tags';
import { Register } from './Register';
import { Login } from './Login';
import { Profile } from './Profile';
import { EditTag } from './EditTag';
import { EditAnswer } from './EditAnswer';
import { EditQuestion } from './EditQuestion';

const pagesRequireLogin = [
  'addAnswer',
  'addQuestion'
];

// all pages common layout
export function Layout ({ model }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    model.refreshData().then(() => setLoading(false));
  }, [model]);

  // which page to render
  const [page, setPage] = useState('questions');
  // query string of search input
  const [query, setQuery] = useState('');
  // the question's id of viewing
  const [questionId, setQuestionId] = useState(null);
  // the search input element ref
  const search = useRef(null);
  const [data, setData] = useState(null);

  // navigate to another page, with page name and options
  const navigate = useCallback((page, options) => {
    if (pagesRequireLogin.includes(page) && !model.data.user) {
      setPage('login');
      return;
    }
    setPage(page);
    if (!options) {
      return;
    }
    setData(options.data || null);
    // set search query
    if (typeof options.query === 'string') {
      setQuery(options.query);
      search.current.value = options.query;
    }
    // set question id
    if (options.questionId) {
      setQuestionId(options.questionId);
    }
  }, []);

  // the main content area
  const content = useMemo(() => {
    if (loading) {
      return <p>Loading...</p>;
    }

    switch (page) {
      case 'questions':
        return <Questions query={query} model={model} navigate={navigate}/>;
      case 'question':
        return <Question model={model} qid={questionId} navigate={navigate}/>;
      case 'addAnswer':
        return <AddAnswer model={model} qid={questionId} navigate={navigate}/>;
      case 'addQuestion':
        return <AddQuestion model={model} navigate={navigate}/>;
      case 'tags':
        return <Tags model={model} navigate={navigate}/>;
      case 'login':
        return <Login model={model} navigate={navigate}/>;
      case 'register':
        return <Register model={model} navigate={navigate}/>;
      case 'profile':
        return <Profile model={model} navigate={navigate}/>;
      case 'editTag':
        return <EditTag model={model} navigate={navigate} data={data}/>;
      case 'editAnswer':
        return <EditAnswer model={model} navigate={navigate} data={data}/>;
      case 'editQuestion':
        return <EditQuestion model={model} navigate={navigate} data={data}/>;
      default:
        return null;
    }
  }, [page, questionId, query, model, navigate, loading]);

  return (
    <div>
      <div id="banner" className="banner">
        <nav>
          <div className="link" onClick={() => {
            navigate('questions', { query: '' });
          }}>Questions
          </div>
          <div className="link" onClick={() => setPage('tags')}>Tags</div>
          {
            model.data.user ? (
              <>
                <div className="link" onClick={() => setPage('profile')}>Welcome, {model.data.user.name}</div>
                <div className="link" onClick={async () => {
                  setLoading(true);
                  await model.logout();
                  setPage('questions');
                  setLoading(false);
                }}>Logout
                </div>
              </>
            ) : (
              <>
                <div className="link" onClick={() => setPage('login')}>Login</div>
                <div className="link" onClick={() => setPage('register')}>Register</div>
              </>
            )
          }
          <div className="logo">Fake Stack Overflow</div>
          <input ref={search} type="text" id="search" placeholder="Search..."
                 onKeyDown={e => {
                   if (e.key === 'Enter') {
                     setQuery(e.target.value);
                     setPage('questions');
                   }
                 }}/>
        </nav>
      </div>

      <div id="main" className="main">
        {content}
      </div>
    </div>
  );
}