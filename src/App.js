import React from 'react';
import { Menu, Icon, Button } from 'semantic-ui-react';

// import './App.css';
// require('./index.css'); 

import ChallengeList from './ChallengeList';
import AddChallenge from './AddChallenge';
import EditChallenge from './EditChallenge';

// just temporary to test component functionality
import AddRemark from './AddRemark';
import AddSnippet from './AddSnippet';
import EditSnippet from './EditSnippet';
import ShowSnippet from './ShowSnippet';
import ShowRemark from './ShowRemark';
import Register from './Register';
import Login from './Login';
import Header from './Header';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class App extends React.Component {
   constructor() {
      super();

      this.state = {
         id: null,
         username: '',
         password: '',
         is_teacher: false,
         loggedIn: false,
         goToLogin: true,
         message: '',
         challenges: [],
         addChallenge: false,
         editChallenge: false,
         challengeToBeEdited: '',
         challengeSnippets: false,
         challengeToBeShown: '',
         activeItem: 'show-challenges'

      }
   }
   
   componentDidMount = async () => {

      // retrieve all existing challenges
      const response = await fetch(API_URL + '/challenges', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const challenges = await response.json();

         this.setState({
            challenges: challenges
         })

   }

   toggleLoginRegister = () => {

      this.setState({
         goToLogin: !this.state.goToLogin
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
               id: user.id,
               username: user.username,
               is_teacher: user.is_teacher,
               loggedIn: true,
               message: user.message,
            })
         } else {

            this.setState({
               message: user.message
            })
         }
         
      // return just in case call needs a return
         return user;

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
               id: user.id,
               username: user.username,
               is_teacher: user.is_teacher,
               loggedIn: true,
               message: user.message,
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

         } else {
            this.setState({
               message: user.message
            })
         }
 
         // return just in case call needs a return
         return user;

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

   showEditChallenge = (challengeToBeEdited) => {
      this.setState({
         challengeToBeEdited: challengeToBeEdited,
         editChallenge: true
      })
      
   }

   editChallenge = async (id, data) => {
 
      try {

         // update the title, description for a challenge
         // using data from EditChallenge component input form
         // (keywords/languages are updated from EditChallenge component)
         const response = await fetch(API_URL + '/challenges/' + id, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })

         // return the new challenge in case call needs the return
         const editedChallenge = await response.json();

         this.setState({
            editChallenge: false,
            challengeToBeEdited: ''
         })

         // a little cheating:
         this.componentDidMount();

         return editedChallenge;

      } catch (err) {
         console.log(err)
      }
   }

   addRemark = async (remarkRoute, data) => {
      
      try {

         const response = await fetch(API_URL + '/' + remarkRoute, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })    

         // return the new remark in case call needs the return
         const newRemark = await response.json();

         return newRemark;

      } catch (err) {
         console.log(err)
      }        
      
   }

   editRemark = async (elementType, parentId, remarkId, remarkUserId, remark, substantial) => {

      // variables to hold response from the database PUT
      let putResponse;
      let returnRemark;

      switch (elementType) {

         // Set a label to title the remark box

         case 'challenge':
            
            // update database
            try {

               putResponse = await fetch(API_URL + '/questions/' + remarkId, {
                  method: 'PUT',
                  body: JSON.stringify({
                     challenge_id: parentId,
                     student_id: remarkUserId,
                     question: remark,
                     substantial: substantial,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               }) 
               returnRemark = await putResponse.json();

            } catch(err) {
               console.log(err);
            }

            break;

         case 'snippet':
            
            // update database
            try {

               putResponse = await fetch(API_URL + '/comments/' + remarkId, {
                  method: 'PUT',
                  body: JSON.stringify({
                     snippet_id: parentId,
                     student_id: remarkUserId,
                     comment: remark,
                     substantial: substantial,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               }) 
               returnRemark = await putResponse.json();

            } catch(err) {
               console.log(err);
            }

            break;

         case 'question':
                       
            // update database
            try {

               putResponse = await fetch(API_URL + '/responses/' + remarkId, {
                  method: 'PUT',
                  body: JSON.stringify({
                     comment_id: parentId,
                     teacher_id: remarkUserId,
                     response: remark,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               }) 
               returnRemark = await putResponse.json();

            } catch(err) {
               console.log(err);
            }

            break;

         case 'comment':
            
            // update database
            try {

               putResponse = await fetch(API_URL + '/observations/' + remarkId, {
                  method: 'PUT',
                  body: JSON.stringify({
                     comment_id: parentId,
                     teacher_id: remarkUserId,
                     observation: remark,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               }) 
               returnRemark = await putResponse.json();

            } catch(err) {
               console.log(err);
            }

            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment")
      }

      // just in case the call needs a return
      return returnRemark;



   }

   showSnippets = async (challenge_id) => {

      const response = await fetch(API_URL + '/challenges', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const challenges = await response.json();

         this.setState({
            challenges: challenges
         })

      this.setState({
         challengeSnippets: true,
         challengeToBeShown: challenge_id,
      })
      
   }


            
            // <AddChallenge 
               // teacher_id={2} 
               // addChallenge={this.addChallenge}
            // />

            // <EditChallenge
               // challenge_id={2}
               // editChallenge={this.editChallenge}
            // />

            // <AddRemark
            //    userId={2}
            //    elementId={1}
            //    elementType={"question"}
            // />

            // <AddSnippet
               // challenge_id={2} 
               // student_id={1}
            // />

            // <EditSnippet
               // snippet_id={1} 
            // />

            // <ShowRemark
                           // userId={2}
                           // loggedIn={this.state.loggedIn}
                           // is_teacher={false}
                           // elementId={3}
                           // elementType={"challenge"}
                        // />






                           // <AddChallenge 
                        // teacher_id={1} 
                        // addChallenge={this.addChallenge}
                     // />  

                     // <ShowSnippet
                        // userId={this.state.id}
                        // loggedIn={this.state.loggedIn}
                        // is_teacher={this.state.is_teacher}
                        // snippet_id={1} 
                        // editRemark={this.editRemark}
                     // />

   handleItemClick = (e, { name }) => {

      console.log(name);

      this.setState({ activeItem: name })

   }

   render() {

      console.log("message:", this.state.message);
      console.log("is_teacher", this.state.is_teacher);

      return (
         <div>

         <Menu className='nav'>

               <Menu.Item
                  className='Link'
                  name='show-challenges'
                  active={this.state.activeItem === 'show-challenges'}
                  onClick={this.handleItemClick}>
                  Challenges
               </Menu.Item>

               
                     {this.state.is_teacher ?
                     <Menu.Item
                        className='Link'
                        name='edit-challenge2'
                        active={this.state.activeItem === 'edit-challenge2'}
                        onClick={this.handleItemClick}>
                        Edit Challenge
                     </Menu.Item>
                     : null}
                     {false ?
                     <Menu.Item
                        className='Link'
                        name='edit-challenge5'
                        active={this.state.activeItem === 'edit-challenge5'}
                        onClick={this.handleItemClick}>
                        Edit Another
                     </Menu.Item>
                     : null}
                     {this.state.is_teacher ?

                     <Menu.Item
                        className='Link'
                        name='add-challenge'
                        active={this.state.activeItem === 'add-challenge'}
                        onClick={this.handleItemClick}>
                        Add Challenge
                     </Menu.Item>
                     : null}
                     <Menu.Item
                        className='Link'
                        name='show-snippet'
                        active={this.state.activeItem === 'show-snippet'}
                        onClick={this.handleItemClick}>
                        Show Snippet
                     </Menu.Item>
                     <Menu.Item
                        className='Link'
                        name='add-snippet'
                        active={this.state.activeItem === 'add-snippet'}
                        onClick={this.handleItemClick}>
                        Add Snippet
                     </Menu.Item>
                     {false ?
                     <Menu.Item
                        className='Link'
                        name='show-snippet-new'
                        active={this.state.activeItem === 'show-snippet-new'}
                        onClick={this.handleItemClick}>
                        Show New Snippet
                     </Menu.Item>
                     : null}
                                    
                                    
            </Menu>



            {this.state.loggedIn
               ?
                  <div>

                  {this.state.activeItem === 'show-challenges'
                     ?
                        <ChallengeList 
                           userId={this.state.id}
                           is_teacher={this.state.is_teacher}
                           challenges={this.state.challenges}
                           showAddChallenge={this.showAddChallenge}
                           showEditChallenge={this.showEditChallenge}
                           showSnippets={this.showSnippets}
                        />
                     : null
                  }

                  {this.state.activeItem === 'edit-challenge2'
                     ?
                        <EditChallenge
                           challenge_id={2}
                           editChallenge={this.editChallenge}
                        />
                     : null
                  }

                  {this.state.activeItem === 'edit-challenge5'
                     ?
                        <EditChallenge
                           challenge_id={5}
                           editChallenge={this.editChallenge}
                        />
                     : null
                  }

                                      
                  {this.state.activeItem === 'add-challenge'
                     ?
                        <AddChallenge 
                           teacher_id={this.state.id} 
                           addChallenge={this.addChallenge}
                        />
                     : null
                  }
                     
                  {this.state.activeItem === 'show-snippet'
                     ?
                        <ShowSnippet
                           userId={this.state.id}
                           loggedIn={this.state.loggedIn}
                           is_teacher={this.state.is_teacher}
                           snippet_id={2} 
                           editRemark={this.editRemark}
                        />
                     : null
                  }

                  {this.state.activeItem === 'add-snippet'
                     ?
                        <AddSnippet
                           userId={this.state.id}
                           loggedIn={this.state.loggedIn}
                           is_teacher={this.state.is_teacher}
                           editRemark={this.editRemark}
                           challenge_id={2} 
                           student_id={this.state.id}
                        />
                     : null
                  }

                  {this.state.activeItem === 'show-snippet-new'
                     ?
                        <ShowSnippet
                           userId={this.state.id}
                           loggedIn={this.state.loggedIn}
                           is_teacher={this.state.is_teacher}
                           snippet_id={9} 
                           editRemark={this.editRemark}
                        />
                     : null
                  }
                                   

                  </div>
               :
                  <div>
                     {this.state.goToLogin 
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
