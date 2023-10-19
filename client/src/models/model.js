import axios from 'axios';

axios.defaults.withCredentials = true;

const HOST = 'http://localhost:8000';

export default class Model {
  constructor () {
    this.data = {
      questions: [],
      tags: [],
      answers: [],
      comments: [],
      user: null,
      error: null
    };
  }

  async refreshData () {
    try {
      await Promise.all([
        axios.get(HOST + '/posts/questions').then(res => this.data.questions = res.data),
        axios.get(HOST + '/posts/tags').then(res => this.data.tags = res.data),
        axios.get(HOST + '/posts/answers').then(res => this.data.answers = res.data),
        axios.get(HOST + '/posts/comments').then(res => this.data.comments = res.data),
        axios.get(HOST + '/auth/current').then(res => this.data.user = res.data),
      ]);
      this.data.error = null;
    } catch (err) {
      this.data.error = 'Network error, pleas try again later.';
    }
  }

  // add relevant methods here.

  /**
   * add a new question to data
   */
  async addQuestion (data) {
    const errors = [];
    let tags = [];
    // validate title
    if (!data.title) {
      errors.push('Title cannot be empty!');
    } else if (data.title.length > 100) {
      errors.push('Title cannot be more than 100 characters!');
    }
    // validate text
    if (!data.text) {
      errors.push('Text cannot be empty!');
    }
    // validate tags
    if (!data.tags) {
      errors.push('Tags cannot be empty!');
    } else {
      tags = data.tags.split(/\s/).map(v => v.trim()).filter(v => v !== '');
    }

    if (errors.length) {
      // validate fail
      return {
        status: 1,
        errors: errors
      };
    }

    const newQuestion = {
      title: data.title,
      text: data.text,
      asked_by: this.data.user._id,
      asked_date_time: new Date(),
      answers: [],
      tags: [],
    };
    // handle tags
    for (const tag of tags) {
      const exist = this.data.tags.find(v => v.name === tag);
      if (exist) {
        newQuestion.tags.push(exist._id);
      } else {
        const newTag = await axios.post(HOST + '/posts/tag', { name: tag, created_by: this.data.user._id });
        this.data.tags.push({ ...newTag.data, created_by: this.data.user });
        newQuestion.tags.push(newTag.data._id);
      }
    }
    // add new question
    const q = await axios.post(HOST + '/posts/question', newQuestion);
    this.data.questions.push({ ...q.data, asked_by: this.data.user });

    // add success
    return {
      status: 0,
      data: q
    };
  }

  async editQuestion (data) {
    const errors = [];
    let tags = [];
    // validate title
    if (!data.title) {
      errors.push('Title cannot be empty!');
    } else if (data.title.length > 100) {
      errors.push('Title cannot be more than 100 characters!');
    }
    // validate text
    if (!data.text) {
      errors.push('Text cannot be empty!');
    }
    // validate tags
    if (!data.tags) {
      errors.push('Tags cannot be empty!');
    } else {
      tags = data.tags.split(/\s/).map(v => v.trim()).filter(v => v !== '');
    }

    if (errors.length) {
      // validate fail
      return {
        status: 1,
        errors: errors
      };
    }

    const newQuestion = {
      _id: data._id,
      title: data.title,
      text: data.text,
      tags: [],
    };
    // handle tags
    for (const tag of tags) {
      const exist = this.data.tags.find(v => v.name === tag);
      if (exist) {
        newQuestion.tags.push(exist._id);
      } else {
        const newTag = await axios.post(HOST + '/posts/tag', { name: tag, created_by: this.data.user._id });
        this.data.tags.push({ ...newTag.data, created_by: this.data.user });
        newQuestion.tags.push(newTag.data._id);
      }
    }
    await axios.put(HOST + '/posts/question', newQuestion);
    await this.refreshData();

    return {
      status: 0
    };
  }

  /**
   * add new answer to question
   */
  async addAnswer (data, id) {
    const errors = [];
    // validate text
    if (!data.text) {
      errors.push('Text cannot be empty!');
    }

    if (errors.length) {
      // validate fail
      return {
        status: 1,
        errors: errors
      };
    }

    const newAnswer = {
      text: data.text,
      ans_by: this.data.user._id,
      ans_date_time: new Date(),
    };
    // add new answer
    const a = await axios.post(HOST + '/posts/answer', newAnswer);
    this.data.answers.push({ ...a.data, ans_by: this.data.user });
    const q = this.data.questions.find(v => v._id === id);
    q.answers.push(a.data._id);
    await axios.put(HOST + '/posts/question', q);
    // add success
    return {
      status: 0,
      data: a
    };
  }

  /**
   * inc question's view by 1
   */
  async incQuestionView (id) {
    const q = this.data.questions.find(v => v._id === id);
    q.views += 1;
    await axios.put(HOST + '/posts/question', q);
  }

  /**
   * get question detail by id
   */
  getQuestionDetail (id) {
    return this.data.questions.find(v => v._id === id);
  }

  /**
   * get tag detail by id
   */
  getTagDetail (id) {
    return this.data.tags.find(v => v._id === id);
  }

  /**
   * get answer detail by id
   */
  getAnswerDetail (id) {
    return this.data.answers.find(v => v._id === id);
  }

  /**
   * query questions by cond
   */
  queryQuestions (cond) {
    // make a shallow copy to avoid muting the original array
    let questions = [...this.data.questions];
    // sort by date desc
    questions.reverse();
    questions.sort((a, b) => {
      return new Date(b.asked_date_time).getTime() - new Date(a.asked_date_time).getTime();
    });
    // get conds array
    const conds = cond.trim().toLowerCase().split(/\s/);
    // filter questions
    questions = questions.filter(q => {
      let matched = false;
      for (const c of conds) {
        // console.log(c);
        if (c.startsWith('[') && c.endsWith(']')) {
          // is tag
          for (const t of q.tags.map(v => this.getTagDetail(v))) {
            if (`[${t.name.toLowerCase()}]` === c) {
              // match tag
              matched = true;
              break;
            }
          }
        } else {
          // is keyword
          if (q.title.toLowerCase().includes(c) || q.text.toLowerCase().includes(c)) {
            matched = true;
          }
        }
        if (matched) {
          // one match is enough
          break;
        }
      }
      return matched;
    });
    // return result
    return questions;
  }

  myQuestions () {
    const res = this.data.questions.filter(v => v.asked_by._id === this.data.user._id);
    res.sort((a, b) => {
      return new Date(b.asked_date_time).getTime() - new Date(a.asked_date_time).getTime();
    });
    return res;
  }

  myAnswers () {
    return this.data.answers.filter(v => v.ans_by._id === this.data.user._id);
  }

  myTags () {
    return this.data.tags.filter(v => v.created_by ? v.created_by._id === this.data.user._id : false);
  }

  async editTag (data) {
    const errors = [];
    if (!data.name) {
      errors.push('Name cannot be empty!');
    }

    if (errors.length) {
      // validate fail
      return {
        status: 1,
        errors: errors
      };
    }

    await axios.put(HOST + '/posts/tag', data);
    await this.refreshData();

    return {
      status: 0
    };
  }

  async deleteTag (id) {
    if (window.confirm('Are you sure to delete this tag?')) {
      await axios.delete(HOST + '/posts/tag/' + id);
      await this.refreshData();

      return {
        status: 0
      };
    }
    return {
      status: 1
    };
  }

  async deleteAnswer (id) {
    if (window.confirm('Are you sure to delete this answer?')) {
      await axios.delete(HOST + '/posts/answer/' + id);
      await this.refreshData();

      return {
        status: 0
      };
    }
    return {
      status: 1
    };
  }

  async deleteQuestion (id) {
    if (window.confirm('Are you sure to delete this question?')) {
      await axios.delete(HOST + '/posts/question/' + id);
      await this.refreshData();

      return {
        status: 0
      };
    }
    return {
      status: 1
    };
  }

  async editAnswer (data) {
    const errors = [];
    if (!data.text) {
      errors.push('text cannot be empty!');
    }

    if (errors.length) {
      // validate fail
      return {
        status: 1,
        errors: errors
      };
    }

    await axios.put(HOST + '/posts/answer', data);
    await this.refreshData();

    // add success
    return {
      status: 0
    };
  }

  async register (data) {
    let errors = [];
    if (!data.name) {
      errors.push('Name cannot be empty!');
    }
    if (!data.email) {
      errors.push('Email cannot be empty!');
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.push('Email is not valid!');
    }
    if (!data.password) {
      errors.push('Password cannot be empty!');
    } else if (data.password !== data.confirm) {
      errors.push('Passwords do not match!');
    }
    if (errors.length) {
      // validate fail
      return {
        status: 1,
        errors: errors
      };
    }
    try {
      await axios.post(HOST + '/auth/register', data);
      return {
        status: 0,
      };
    } catch (err) {
      return {
        status: 1,
        errors: ['Email is already taken!']
      };
    }
  }

  async login (data) {
    let errors = [];
    if (!data.email) {
      errors.push('Email cannot be empty!');
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.push('Email is not valid!');
    }
    if (!data.password) {
      errors.push('Password cannot be empty!');
    }
    if (errors.length) {
      // validate fail
      return {
        status: 1,
        errors: errors
      };
    }
    try {
      await axios.post(HOST + '/auth/login', data);
      await this.refreshData();
      return {
        status: 0,
      };
    } catch (err) {
      if (err.response && err.response.status === 401) {
        return {
          status: 1,
          errors: ['Email or password invalid!']
        };
      } else {
        return {
          status: 1,
          errors: ['Network error. Please try again later.']
        };
      }

    }
  }

  async logout () {
    await axios.get(HOST + '/auth/logout');
    await this.refreshData();
  }

  getComments (ids) {
    let res = ids.map(id => this.data.comments.find(v => v._id === id));
    res.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    return res;
  }

  async addComment (post, data) {
    let errors = [];
    if (!data.text) {
      errors.push('Text cannot be empty!');
    } else if (data.text.length > 140) {
      errors.push('Text should be less than 140 characters!');
    }
    if ((this.data.user.score || 0) < 100) {
      errors.push('You can not post a comment now, because your reputation is less than 100.');
    }
    if (errors.length) {
      // validate fail
      return {
        status: 1,
        errors: errors
      };
    }
    try {
      data.created_by = this.data.user._id;
      let res = await axios.post(HOST + '/posts/comment', data);
      this.data.comments.push(res.data);
      if (!Array.isArray(post.comments)) {
        post.comments = [];
      }
      post.comments.push(res.data._id);
      await axios.put(HOST + `/posts/${post.ans_by ? 'answer' : 'question'}`, post);

      return {
        status: 0,
      };
    } catch (err) {
      return {
        status: 1,
        errors: ['Add comment failed, please try again later!']
      };
    }
  }

  async vote (post, value) {
    const vote = post.votes.find(v => v.user === this.data.user._id);
    if (vote && value === vote.value) {
      window.alert('You have already voted for this question/answer');
      return;
    }
    let incScore = 0;
    if (vote) {
      incScore -= vote.value;
      vote.value = value;
    } else {
      post.votes.push({ value, user: this.data.user._id });
    }
    incScore += value;
    await axios.put(HOST + `/posts/${post.ans_by ? 'answer' : 'question'}`, post);
    await axios.put(HOST + '/auth/user', { _id: post.ans_by ? post.ans_by._id : post.asked_by._id, score: incScore });
    await this.refreshData();
  }
}
