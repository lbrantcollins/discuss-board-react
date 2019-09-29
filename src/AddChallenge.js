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
         message: '',
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
         if (this.state.title && this.state.description) {


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
               this.setState({
                  challenge_id: challenge.challenge.id,
                  newChallengeCreated: true,
                  message: '',
               })
            }

         } else {
            this.setState({
               message: "You must include a title and a description."
            })
         }

      } catch (err) {
         console.log(err)
      }

 

   }

   handleSubmitChallenge = async () => {

      try {  

         const response = await fetch(API_URL + '/challenges/' + this.state.challenge_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const challenge = await response.json();


         if (challenge.keywords.length === 0) {
            this.setState({
               message: "You must select and submit at least one keyword.",
            })
         } else if (challenge.languages.length === 0) {
            this.setState({
               message: "You must select and submit at least one language.",
            })
         } else {

            this.props.returnToChallengeList();
         }
         
      } catch(err) {
         console.log(err);
      }
   }

   render() {

      return (

         <div>
       
            {/* Allow keyword selection only after challenge created */}
            {!this.state.newChallengeCreated 
               ? 

                  <div>
                     <h2>Add a challenge:</h2>

                     <br/>
                     <p className="message bad">{this.state.message}</p>
                     <br/>

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

                     <br/>
                     <br/>
                     <Button className="secondary"
                        content="Submit Completed Challenge"
                        onClick={this.handleSubmitChallenge}
                     />
                     <br/>

                     <Card>
                        <Card.Content>
                           <Card.Header> {this.state.title} </Card.Header>
                           <Card.Description> {this.state.description} </Card.Description>           
                        </Card.Content>
                     </Card>

                     <h2>Select keywords and languages for the challenge</h2>

                     <br/>
                     <p className="message bad">{this.state.message}</p>
                     <br/>

                     <Card.Group>
                        <SelectKeywords challenge_id={this.state.challenge_id} />

                        <SelectLanguages challenge_id={this.state.challenge_id} />

                     </Card.Group> 

                     

                  </div>
            }              

         </div>
           
      );

   }

}



export default AddChallenge;
