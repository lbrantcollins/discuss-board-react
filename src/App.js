import React from 'react';
import { Menu, Icon, Button } from 'semantic-ui-react';

// import './App.css';
// require('./index.css'); 

import ChallengeList from './ChallengeList';
// import AddChallenge from './AddChallenge';
// import EditChallenge from './EditChallenge';

// // just temporary to test component functionality
// import AddRemark from './AddRemark';
// import AddSnippet from './AddSnippet';
// import EditSnippet from './EditSnippet';
// import ShowSnippet from './ShowSnippet';
// import ShowRemark from './ShowRemark';
import Register from './Register';
import Login from './Login';
// import Header from './Header';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class App extends React.Component {
   constructor() {
      super();

      this.state = {
         useLoginPage: true,
         loggedIn: false,
         user: {}
      }
   }
   
   toggleLoginRegister = () => {

      this.setState({
         useLoginPage: !this.state.useLoginPage
      })
   }

   login = async (data) => {

      try {

         // create a new user in the database
         const response = await fetch(API_URL + '/users/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const user = await response.json();

         if (user.success) {

         // set state so that user is considered "loggedIn"
            this.setState({
               loggedIn: true,
               user: user
            })
         } else {
            this.toggleLoginRegister();
         }

      } catch (err) {
         console.log(err)
      }

   }


   register = async (data) => {

      try {

         // create a new user in the database
         const response = await fetch(API_URL + '/users/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const user = await response.json();

         if (user.success) {

            // set state so that user is considered "loggedIn"
            this.setState({
               loggedIn: true,
               user: user
            })

            // add new user to either the student or teachers table
            if (user.is_teacher) {
               await fetch(API_URL + '/teachers', {
                  method: 'POST',
                  body: JSON.stringify({
                     user_id: user.id,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               })
            } else {
               await fetch(API_URL + '/students', {
                  method: 'POST',
                  body: JSON.stringify({
                     user_id: user.id,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               })

            }

         } 

      } catch (err) {
         console.log(err)
      }
   }

   logout = async (data) => {

      try {

         // create a new user in the database
         const response = await fetch(API_URL + '/users/logout', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         
         // set state so that user is considered "logged out"
         this.setState({
            loggedIn: false,
         })
   
      } catch (err) {
         console.log(err)
      }

   }

   showAddChallenge = () => {
      this.setState({
         addChallenge: true
      })
      
   }

   addChallenge = async (data) => {
 
      try {

         // create a new challenge in database
         // using data from "AddChallenge" input form
         const response = await fetch(API_URL + '/challenges', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
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
            challenges: newList,
            addChallenge: false
         })

         // return the new challenge in case call needs the return
         return newChallenge;

         // a little cheating:
         this.componentDidMount();

      } catch (err) {
         console.log(err)
      }
   }

   
   render() {

      return (
         
         <div>

            {this.state.loggedIn
               ?
                  <div>

                  <Button 
                     content="Log Out"
                     onClick={this.logout}
                  />
                  <br/>
                  <br/>

                  <ChallengeList user={this.state.user}/>

                  </div>
               :
                  <div>

                     {this.state.useLoginPage 
                        ? 
                           <Login 
                              toggleLoginRegister={this.toggleLoginRegister}
                              login={this.login} 
                           />
                        :
                           <Register 
                              toggleLoginRegister={this.toggleLoginRegister}
                              register={this.register}
                           />
                     }

                  </div>
            }

         </div>
      );

   }
}


export default App;


