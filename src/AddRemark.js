import React from 'react';

import { Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';
// import { Link } from 'react-router-dom';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class AddRemark extends React.Component {
   // props: user, remark (lots of info, including the teacher remark)
   //        elementType ("challenge", "question", "snippet", "comment")
   constructor() {
      super();

      this.state = {
      	remark: '',
         label: '',
         placeholder: '',

      }

   }

   // pre-processing for this component
   componentDidMount = () => {

      // provide a label to the add-remark title 
      // and provide placeholder text
      // (customized for the specific component)
      let label;
      let placeholder;
       
      switch (this.props.elementType) {

         // Set a label to title the add-remark text box
         // set a placeholder for the add-remark text box

         case 'challenge':
            label = "Ask a Question:";
            placeholder = "...about the challenge your instructor posed.";
            break;

         case 'snippet':
            label = "Leave a Comment:";
            placeholder = "...about your fellow student's suggested code snippet.";
            break;

         case 'question':
            label = "Respond to the student:";
            placeholder = "Answer your student's question about the challenge posed.";
            break;

         case 'comment':
             label = "Respond to the student:";
             placeholder = "Respond to your student's comment on the code snippet.";
            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment")
      }

      this.setState({
         label: label,
         placeholder: placeholder,
      })
   
   }

   initializeFormPlaceholder = () => {

      // set a placeholder for the add-remark text box
      // (customized for the specific component)
      let placeholder;
       
      switch (this.props.elementType) {

         case 'challenge':
            placeholder = "...about the challenge your instructor posed.";
            break;

         case 'snippet':
            placeholder = "...about your fellow student's suggested code snippet.";
            break;

         case 'question':
            placeholder = "...to your student's question about the challenge posed.";
            break;

         case 'comment':
             placeholder = "...about your student's comment on the code snippet.";
            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment")
      }

      this.setState({
         placeholder: placeholder,
      })

      
   }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   // add the remark as a remark on the relevant component
   handleSubmit = async (e) => {
      e.preventDefault();

      // return data: the remark and accompanying fields
      let data;
      // route for posting the remark to the database
      let remarkRoute;

      switch (this.props.elementType) {

         // the remark is a student question about a challenge
         // this.props.remark.id = challenge id
         case 'challenge':
            data = {
               challenge_id: this.props.remark.id,
               student_id: this.props.user.id,
               question: this.state.remark,
               substantial: false
            }
            remarkRoute = "questions"
            break;

         // the remark is a student comment about a snippet
         // this.props.remark.id = snippet id
         case 'snippet':
            data = {
               snippet_id: this.props.remark.id,
               student_id: this.props.user.id,
               comment: this.state.remark,
               substantial: false
            }
            remarkRoute = "comments"
            break;

         // the remark is a teacher response to a student question about a challenge
         // the response is associated with the teacher id of the first responding teacher
         // but, all teachers can later edit the response
         case 'question':
            data = {
               question_id: this.props.remark.parent_id,
               teacher_id: this.props.remark.teacher_id,
               response: this.state.remark,
            }
            remarkRoute = "responses"
            break;

         // the remark is a teacher observation on a student comment about a snippet
         // the observation is associated with the teacher id of the first responding teacher
         // but, all teachers can later edit the observation
         case 'comment':
            data = {
               comment_id: this.props.remark.parent_id,
               teacher_id: this.props.remark.teacher_id,
               observation: this.state.remark,
            }
            remarkRoute = "observations"
            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment");
      }

      // add the remark to the database for the relevant component
      await fetch(API_URL + '/' + remarkRoute, {
         method: 'POST',
         body: JSON.stringify(data),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })

      // blank out the form for adding another remark on the relevant component
      this.initializeFormPlaceholder();
      this.setState({
         remark: '',
      })

      // redirect back to the relevant component
      // this.props.history.push('/media/' + newMedia.data.id). ?????
   }

   // <form onSubmit={this.handleSubmit}>
                  // <br/>
                  // <textarea
                     // rows="8" 
                     // type="text" 
                     // name="content" 
                     // placeholder={this.state.placeholder} 
                     // onChange={this.handleChange}
                  // ></textarea>
                  // <br/>
                  // <button>Submit</button>
               // </form>

   render() {
      

      return (

         <Card>
            <Card.Header>Howdy!  {this.state.label}</Card.Header>
            <Card.Content>
               <Form>
                  <Form.TextArea 
                     name="content"
                     placeholder={this.state.placeholder}
                     onChange={this.handleChange}
                  />
                     <Button 
                        content='Submit'
                        onSubmit={this.handleSubmit}
                     />
               </Form>
               
            </Card.Content>
         </Card>
           
      );

   }

}

export default AddRemark;
