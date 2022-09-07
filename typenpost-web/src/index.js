import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider} from '@apollo/client'
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.css';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql/',
  // uri: 'https://www.typenpost.com/graphql/',
  credentials: 'include',
  cache: new InMemoryCache(),
})
  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
