import logo from './logo.svg';
import './App.css';
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider} from '@apollo/client'
import { PostInfo, CreatePost } from './Post';
import React from 'react';

const client = new ApolloClient({
  // uri: 'http://localhost:8000/graphql/',
  uri: 'https://www.typenpost.com/graphql/',
  cache: new InMemoryCache(),
})

function App() {
  return (
    <React.Fragment>
    <h1>Helloooo</h1>
    <ApolloProvider client={client}>
      <div style={{
        backgroundColor: '#00000008',
        display: 'flex',
        justifyContent:'center',
        alignItems:'center',
        height: '100vh',
        flexDirection: 'column',
      }}>
        <h2>My first Apollo app <span role='img' aria-label='rocket'>🚀</span></h2>
        <CreatePost />
        <PostInfo />
      </div>
    </ApolloProvider>
    </React.Fragment>
  )
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
