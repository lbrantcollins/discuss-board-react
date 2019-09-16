import React from 'react';

import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

import SelectKeywords from './SelectKeywords';
import SelectLanguages from './SelectLanguages';

class AddChallenge extends React.Component {
   // props: teacher_id (user_id), addChallenge (function)
   constructor() {
      super();

      this.state = {
         id: '',
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

   handleSubmit = async (e) => {
      e.preventDefault();

      // send new challenge data to database
      const newChallenge = await this.props.addChallenge({
         teacher_id: this.props.teacher_id,
         title: this.state.title,
         description: this.state.description
      })

      this.setState({
         id: newChallenge.id,
         newChallengeCreated: true
      })

      // how to access session[:message] here?
      // and then reset it to null so does not continue to display?
      // and can CSS style good "message" vs. "bad" message:
      // className="message {session[:message][:status]}"

      // return the new challenge in case we need a return
      return newChallenge;

      // this.props.history.push('/media/' + newMedia.data.id)

  }
   
   render() {

      console.log(this.state);
      console.log("this.state");

      return (

         <div>

            <h2>Add a challenge:</h2>

            <Form onSubmit={this.handleSubmit}>
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

            {/* Allow keyword selection after challenge created */}
            {this.state.newChallengeCreated ? <SelectKeywords challenge_id={this.state.id} /> : null}
            

         </div>
           
      );

   }

}



export default AddChallenge;
