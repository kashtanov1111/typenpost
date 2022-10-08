import React from 'react';
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals';
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider,
} from '@apollo/client'
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.css';
import { Authorization } from './components/auth/Authorization';


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
      <Authorization />
    </ApolloProvider>
  </BrowserRouter>
);

reportWebVitals();
