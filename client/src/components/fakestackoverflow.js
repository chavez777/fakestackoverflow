import React from 'react';
import Model from '../models/model.js';
import { Layout } from './Layout';

const model = new Model();

// main entry
export default class FakeStackOverflow extends React.Component {
  render () {
    return <Layout model={model}/>;
  }
}
