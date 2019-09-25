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

         const challenge = await response.json();

         if (challenge.success) {
            console.log("-----> new challenge created <-----");
            this.setState({
               challenge_id: challenge.challenge.id,
               newChallengeCreated: true,
            })
         }

      } catch (err) {
         console.log(err)
      }

   }

   handleSubmitChallenge = () => {
      this.props.returnToChallengeList();
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
       
            {/* Allow keyword selection only after challenge created */}
            {!this.state.newChallengeCreated 
               ? 

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
                        <Button>Save Challenge</Button>
                     </Form>
                  </div>

               :

                  <div>

                     <Card>
                        <Card.Content>
                           <Card.Header> {this.state.title} </Card.Header>
                           <Card.Description> {this.state.description} </Card.Description>           
                        </Card.Content>
                     </Card>

                     <h4>Select keywords and languages for the challenge</h4>

                     <Card.Group>
                        <SelectKeywords challenge_id={this.state.challenge_id} />

                        <SelectLanguages challenge_id={this.state.challenge_id} />

                     </Card.Group> 

                     <br/>
                     <br/>
                     <Button
                        content="Submit Completed Challenge"
                        onClick={this.handleSubmitChallenge}
                     />

                  </div>
            }              

         </div>
           
      );

   }

}



export default AddChallenge;
