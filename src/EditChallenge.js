import React from 'react';

import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

import './index.css'

import SelectKeywords from './SelectKeywords';
import SelectLanguages from './SelectLanguages';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class EditChallenge extends React.Component {
   // props: challenge_id, editChallenge (function)
   constructor(props) {
      super(props);

      this.state = {
         teacher_id: null,
      	title: '',
      	description: '',
      }

   }
   
   componentDidMount = async () => {

      try {

         // retrieve the challenge to be edited
         const response = await fetch(API_URL + '/challenges/' + this.props.challenge_id, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json'
            },
            credentials: 'include',
         })
         const challenge = await response.json();
        
         this.setState({
            teacher_id: challenge.teacher_id,
            title: challenge.title,
            description: challenge.description
         })

      } catch (err) {
         console.log(err);
      }
   }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   handleSubmit = async (e) => {
      e.preventDefault();

      // send edited challenge data to database and lift up state
      const challenge = await this.props.editChallenge(this.props.challenge_id, 
         {
            teacher_id: this.state.teacher_id,
            title: this.state.title,
            description: this.state.description
         }
      )

      this.setState({
         teacher_id: challenge.teacher_id,
         title: challenge.title,
         description: challenge.description
      })

      //////////////////////////////
      // redirect somewhere?
      // this.props.history.push('/media/' + newMedia.data.id)
      //////////////////////////////

  }
   
   render() {

      console.log("this.state");
      console.log(this.state);

      return (

         <div>

            <Form onSubmit={this.handleSubmit}>
               <label>Title:</label>
               <br/>
               <Form.Input 
                  type="text" 
                  name="title" 
                  placeholder={this.state.title}
                  // value={this.state.title} 
                  onChange={this.handleChange}
               />
               <br/>
               <label>Description:</label>
               <br/>
               <Form.TextArea 
                  name="description" 
                  placeholder={this.state.description}
                  value={this.state.description}
                  onChange={this.handleChange}
               ></Form.TextArea>
               <br/>
               <Button>Submit Changes</Button>
            </Form>

            <SelectKeywords challenge_id={this.props.challenge_id} />

            <SelectLanguages challenge_id={this.props.challenge_id} />

            

         </div>
           
      );

   }

}



export default EditChallenge;
