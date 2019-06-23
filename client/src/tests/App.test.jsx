/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { Drizzle } from 'drizzle';
import App from '../App';
import SVGToken from '../contracts/SVGToken.json';

// let drizzle know what contracts we want and how to access our test blockchain
const options = {
  contracts: [SVGToken],
  web3: {
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:9545',
    },
  },
};

// setup drizzle
const drizzle = new Drizzle(options);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App drizzle={drizzle} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
