import React from 'react';

import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

import './index.css'

import SelectKeywords from './SelectKeywords';
import SelectLanguages from './SelectLanguages';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class EditChallenge extends React.Component {
   // props: challenge, returnToShowChallenge (function)
   constructor(props) {
      super(props);

      this.state = {
      	title: '',
      	description: '',
      }

   }
   
   // May need to do something prior to page load
   // componentDidMount = async () => {
   // }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

// editChallenge = async (id, data) => {
 
   //    try {

   //       // update the title, description for a challenge
   //       // using data from EditChallenge component input form
   //       // (keywords/languages are updated from EditChallenge component)
   //       const response = await fetch(API_URL + '/challenges/' + id, {
   //          method: 'PUT',
   //          body: JSON.stringify(data),
   //          headers: {'Content-Type': 'application/json'},
   //          credentials: 'include',
   //       })

   //       // return the new challenge in case call needs the return
   //       const editedChallenge = await response.json();

   //       this.setState({
   //          editChallenge: false,
   //          challengeToBeEdited: ''
   //       })

   //       // a little cheating:
   //       this.componentDidMount();

   //       return editedChallenge;

   //    } catch (err) {
   //       console.log(err)
   //    }
   // }

   handleSubmit = async (e) => {
      e.preventDefault();

      const response = await fetch(API_URL + '/challenges/' + this.props.challenge.id, {
         method: 'PUT',
         body: JSON.stringify({
            title: this.state.title,
            description: this.state.description,
         }),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })

      this.props.returnToShowChallenge();

  }
   
   render() {

      // set up an edit toggle for each of the three elements below:
      // title/description, keywords, and languages

      // display each as is (when it's edit toggle is false), but with a button for toggling
      // once changes are submitted for that element, return to the display as is (toggle=false)

      // put the toggle variables in state so that we get a re-render when elements change

      // Need overall "changes complete" button (and that should send us back to showChallenge)

      return (

         <div>

            <Card>
               <Card.Content>
                  <Form>
                     <label>Title:</label>
                     <br/>
                     <Form.Input 
                        type="text" 
                        name="title" 
                        placeholder={this.props.challenge.title}
                        value={this.state.title} 
                        onChange={this.handleChange}
                     />
                     <br/>
                     <label>Description:</label>
                     <br/>
                     <Form.TextArea 
                        name="description" 
                        placeholder={this.props.challenge.description}
                        value={this.state.description}
                        onChange={this.handleChange}
                     ></Form.TextArea>
                     <br/>
                  </Form>
               </Card.Content>
            </Card>


            <Card.Group>
               <SelectKeywords challenge_id={this.props.challenge.id} />

               <SelectLanguages challenge_id={this.props.challenge.id} /> 
            </Card.Group> 

            <br/>
               
            <Button 
               content="Submit Updated Challenge"
               className="secondary" 
               onClick={this.handleSubmit}
            />

         </div>
           
      );

   }

}



export default EditChallenge;
