import React from 'react';

// import './App.css';
// require('./index.css'); 

import AddChallenge from './AddChallenge';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class App extends React.Component {
   constructor() {
      super();

      this.state = {
         username: '',
         password: '',
         loggedIn: false,
         isTeacher: false,
         challenges: [],
      }
   }
   
   componentDidMount = async () => {

      console.log("we may want to do something when the app first starts");

   }

   addChallenge = async (data) => {
 
      try {

         // create a new challenge in database
         // using data from "AddChallenge" input form
         const response = await fetch(API_URL + '/challenges', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
               'Content-Type': 'application/json'
            },
            credentials: 'include',
         })

         // add the new challenge to state
         // get the challenge (including it's new id)
         const newChallenge = await response.json();
         // make a copy of the current state
         const newList = [...this.state.challenges];
         // add the new challenge to the local list
         newList.push(newChallenge)
         // set state to the local list (includes new challenge)
         this.setState({
            challenges: newList
         })

         // return the new challenge in case call needs the return
         return newChallenge;

      } catch (err) {
         console.log(err)
      }
   }
            

   render() {

      return (
         <div className="App">

            <h3>This is "App"</h3>
            
            

            <AddChallenge 
               teacher_id={2} 
               addChallenge={this.addChallenge}
            />


         </div>
      );

   }
}



export default App;
