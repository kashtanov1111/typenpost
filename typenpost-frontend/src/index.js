import React from 'react';
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals';
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider,
} from '@apollo/client'
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import { App } from './components/App';
import { relayStylePagination } from '@apollo/client/utilities';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql/',
  // uri: 'https://www.typenpost.com/graphql/',
  credentials: 'include', // remove in production
  
  cache: new InMemoryCache({
    typePolicies: {
      UserProfileNode: {
          fields: {
            followers: relayStylePagination(),
            following: relayStylePagination(),
          }
      },
    },
  }),
  
})
  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App client={client}/>
    </ApolloProvider>
  </BrowserRouter>
);

reportWebVitals();
