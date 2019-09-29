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
      	title: this.props.challenge.title,
      	description: this.props.challenge.description,
         editTitle: false,
         editDescription: false,
         message: '',
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

   handleSubmit = async (e) => {
      e.preventDefault();

      try {

         const response = await fetch(API_URL + '/challenges/' + this.props.challenge.id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const challenge = await response.json();

         if (challenge.keywords.length === 0) {
            this.setState({
               message: "You must select at least one keyword.",
            })
         } else if (challenge.languages.length === 0) {
            this.setState({
               message: "You must select at least one language.",
            })
         } else {

            this.props.returnToShowChallenge();

         }

      } catch(err) {
         console.log(err);
      }



   }

   handleSubmitTitle = async (e) => {
      e.preventDefault();

      if (this.state.title.length === 0) {
         this.setState({
            message: "You must enter a challenge title."
         })

      } else {

         try{

            const response = await fetch(API_URL + '/challenges/' + this.props.challenge.id, {
               method: 'PUT',
               body: JSON.stringify({
                  title: this.state.title,
                  description: this.props.challenge.description,
               }),
               headers: {'Content-Type': 'application/json'},
               credentials: 'include',
            })

            this.setState({
               ...this.state,
               editTitle: false,
               message: '',
               title: this.state.title,
            })

         } catch(err) {
            console.log(err);
         }

      }

   }

   handleSubmitDescription = async (e) => {
      e.preventDefault();

      if (this.state.title.length === 0) {
         this.setState({
            message: "You must enter a challenge description."
         })

      } else {

         try {

            const response = await fetch(API_URL + '/challenges/' + this.props.challenge.id, {
               method: 'PUT',
               body: JSON.stringify({
                  title: this.props.challenge.title,
                  description: this.state.description,
               }),
               headers: {'Content-Type': 'application/json'},
               credentials: 'include',
            })

            this.setState({
               ...this.state,
               editDescription: false,
               message: '',
               description: this.state.description,
            })

         } catch(err) {
            console.log(err);
         }
      }
   }

   toggleEditTitle = () => {
      this.setState({
         ...this.state,
         editTitle: true,
      })
   }

   toggleEditDescription = () => {
      this.setState({
         ...this.state,
         editDescription: true,
      })
   }
   
   render() {

      return (

         <div>

            <Button className="secondary"
               content="Submit Updated Challenge"
               onClick={this.handleSubmit}
            />

            <br/>
            <br/>
            <p className="message bad">{this.state.message}</p>
            <br/>

            <Card.Group>
               <Card>
                  <Card.Content>

                     <Card.Header>Title:</Card.Header>

                     <Card.Description>

                        {this.state.editTitle
                           ?
                              <Form>
                                 <Form.Input 
                                    type="text" 
                                    name="title" 
                                    placeholder={this.state.title}
                                    value={this.state.title} 
                                    onChange={this.handleChange}
                                 />
                                 <Button
                                    content="Submit Changes"
                                    onClick={this.handleSubmitTitle}
                                 />
                              </Form>
                           :
                              <div>
                                 {this.state.title}
                                 <br/>
                                 <Button
                                    content="Edit"
                                    onClick={this.toggleEditTitle}
                                 />
                              </div>
                        }
                     </Card.Description>

                  </Card.Content>
               </Card>

               <Card>
                  <Card.Content>
                     
                     <Card.Header>Description:</Card.Header>

                     <Card.Description>

                        {this.state.editDescription
                           ?
                              <Form>
                                 <Form.TextArea 
                                    name="description" 
                                    placeholder={this.state.description}
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                 />
                                 <Button
                                    content="Submit Changes"
                                    onClick={this.handleSubmitDescription}
                                 />
                                 <br/>
                              </Form>
                           :
                              <div>
                                 {this.state.description}
                                 <br/>
                                 <Button
                                    content="Edit"
                                    onClick={this.toggleEditDescription}
                                 />
                              </div>
                        }

                     </Card.Description>

                  </Card.Content>
               </Card>
            </Card.Group>

            <br/>


            <Card.Group>
               <SelectKeywords challenge_id={this.props.challenge.id} />

               <SelectLanguages challenge_id={this.props.challenge.id} /> 
            </Card.Group>         
            
         </div>
           
      );

   }

}



export default EditChallenge;
