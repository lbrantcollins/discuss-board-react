import React from 'react';

// import './App.css';
// require('./index.css'); 

import KeywordList from './KeywordList';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class App extends React.Component {
   constructor() {
      super();

      this.state = {
         username: '',
         password: '',
         loggedIn: false
      }
   }
   
   componentDidMount = async () => {

      console.log("we may want to do something when the app first starts");

   }

   

   render() {

      return (
         <div className="App">

            <h2>This is App.js</h2>
            
            <KeywordList />

         </div>
      );

   }
}


export default App;
