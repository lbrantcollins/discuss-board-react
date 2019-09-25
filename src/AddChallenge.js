import React from 'react';

import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

import SelectKeywords from './SelectKeywords';
import SelectLanguages from './SelectLanguages';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class AddChallenge extends React.Component {
   // props: user, returnToChallengeList (function)
   constructor() {
      super();

      this.state = {
         challenge_id: '',
      	title: '',
      	description: '',
         newChallengeCreated: false,
      }

   }
   
   // pre-processing may not be needed for this component
   // componentDidMount = async () => {
   // }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   addChallenge = async () => {
 
      try {

         // create a new challenge in database
         // using data from "AddChallenge" input form
         const response = await fetch(API_URL + '/challenges', {
            method: 'POST',
            body: JSON.stringify({
               teacher_id: this.props.user.id,
               title: this.state.title,
               description: this.state.description,
            }),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })

         if (response.success) {
            this.setState({
               newChallengeCreated: true,
            })
         }

         // add the new challenge to state
         // get the challenge (including it's new id)
         // const newChallenge = await response.json();

         // make a copy of the current state
         // const newList = [...this.state.challenges];

         // add the new challenge to the local list
         // newList.push(newChallenge)

         // set state to the local list (includes new challenge)
         // this.setState({
         //    challenges: newList,
         //    addChallenge: false
         // })

         // return the new challenge in case call needs the return
         // return newChallenge;

         // a little cheating:
         // this.componentDidMount();


      } catch (err) {
         console.log(err)
      }
   }


  //  handleSubmit = async (e) => {
  //     e.preventDefault();

  //     // send new challenge data to database
  //     const newChallenge = await this.addChallenge({
  //        teacher_id: this.props.user.id,
  //        title: this.state.title,
  //        description: this.state.description
  //     })

  //     this.setState({
  //        challenge_id: newChallenge.id,
  //        newChallengeCreated: true
  //     })

  //     // how to access session[:message] here?
  //     // and then reset it to null so does not continue to display?
  //     // and can CSS style good "message" vs. "bad" message:
  //     // className="message {session[:message][:status]}"

  //     // return the new challenge in case we need a return
  //     return newChallenge;

  // }
   
   render() {

      return (

         <div>

            <div>
               <h2>Add a challenge:</h2>

               <Form onSubmit={this.addChallenge}>
                  <label>Title:</label>
                  <br/>
                  <Form.Input 
                     type="text" 
                     name="title" 
                     placeholder="Challenge Title" 
                     onChange={this.handleChange}
                  />
                  <br/>
                  <label>Description:</label>
                  <br/>
                  <Form.TextArea 
                     rows="8"
                     name="description" 
                     placeholder="Challenge Description"
                     onChange={this.handleChange}
                  />
                  <br/>
                  <Button>Submit Challenge</Button>
               </Form>
            </div>

            {this.props.returnToChallengeList}

            {/* Allow keyword selection after challenge created */}
            {this.state.newChallengeCreated 
               ? 
                  <div>
                     <h4>Select keywords and languages for the challenge</h4>
                     <Card.Group>
                        <SelectKeywords challenge_id={this.state.challenge_id} />

                        <SelectLanguages challenge_id={this.state.challenge_id} />

                     </Card.Group> 
                  </div>
               :
                  null
            }              

         </div>
           
      );

   }

}



export default AddChallenge;
