import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import reportWebVitals from './reportWebVitals';
import { Web3ReactProvider } from '@web3-react/core';
import Web3ReactManager from './utils/Web3ReactManager';
import { getLibrary } from './utils'

ReactDOM.render(
  <Provider store={configureStore()}>
    <React.StrictMode>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ReactManager>
          <App />
        </Web3ReactManager>
      </Web3ReactProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
