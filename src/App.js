import React from 'react';

// import './App.css';
// require('./index.css'); 

import AddChallenge from './AddChallenge';
import EditChallenge from './EditChallenge';

// just temporary to test component functionality
import AddRemark from './AddRemark';
import AddSnippet from './AddSnippet';
import EditSnippet from './EditSnippet';
import ShowSnippet from './ShowSnippet';
import ShowRemark from './ShowRemark';


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

      // we may want to do something when the app first starts"

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
            challenges: newList
         })

         // return the new challenge in case call needs the return
         return newChallenge;

      } catch (err) {
         console.log(err)
      }
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

      console.log("-----> inside editRemark function <-----");

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

            console.log("----------->  in the snippet case writing to DB <---------");
            
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
               // loggedIn={true}
               // isTeacher={false}
               // elementId={3}
               // elementType={"challenge"}
            // />
            

   render() {

      return (
         <div className="App">

            <h2>This is "App"</h2>

               <ShowSnippet
                  userId={1}
                  loggedIn={true}
                  isTeacher={false}
                  snippet_id={1} 
                  editRemark={this.editRemark}
               />

         </div>
      );

   }
}



export default App;
