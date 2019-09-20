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
         buttonText: '',
         placeholder: '',

      }

   }

   // pre-processing for this component
   componentDidMount = () => {

      // provide a label to the add-remark title 
      // and provide button and placeholder text
      // (customized for the specific component)
      let label;
      let buttonText;
      let placeholder;
       
      switch (this.props.elementType) {

         // Set a label to title the add-remark text box
         // set a placeholder for the add-remark text box

         case 'challenge':
            label = "Ask a Question:";
            buttonText = "Add a Question";
            placeholder = "...about the challenge your instructor posed.";
            break;

         case 'snippet':
            label = "Leave a Comment:";
            buttonText = "Add a Comment";
            placeholder = "...about your fellow student's suggested code snippet.";
            break;

         case 'question':
            label = "Respond to student:";
            buttonText = "Add a Response";
            placeholder = "Answer your student's question about the challenge posed.";
            break;

         case 'comment':
             label = "Respond to student:";
             buttonText = "Add a Response";
             placeholder = "Respond to your student's comment on the code snippet.";
            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment")
      }

      this.setState({
         label: label,
         buttonText: buttonText,
         placeholder: placeholder,
      })
   
   }

   ///////////////////////////////////////////////////////////////////
   // THIS FUNCTION IS LIKELY NOT NEEDED
   ///////////////////////////////////////////////////////////////////
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

      console.log("********************");
      console.log("remark in handleSubmit in AddRemark");
      console.log(this.props.remark);
      console.log("this.state.remark");
      console.log(this.state.remark);


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
         // this.props.remark.remark_id = question id
         case 'question':
            data = {
               question_id: this.props.remark.remark_id,
               teacher_id: this.props.user.id,
               response: this.state.remark,
            }
            remarkRoute = "responses"
            break;

         // the remark is a teacher observation on a student comment about a snippet
         // the observation is associated with the teacher id of the first responding teacher
         // but, all teachers can later edit the observation
         // this.props.remark.remark_id = comment id
         case 'comment':
            data = {
               comment_id: this.props.remark.remark_id,
               teacher_id: this.props.user.id,
               observation: this.state.remark,
            }
            remarkRoute = "observations"
            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment");
      }

      console.log("**********************************");
      console.log("route in AddRemark");
      console.log(remarkRoute);
      console.log("data in AddRemark");
      console.log(data);

      // add the remark to the database for the relevant component
      await fetch(API_URL + '/' + remarkRoute, {
         method: 'POST',
         body: JSON.stringify(data),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })

      // blank out the form for adding another remark on the relevant component
      // this.initializeFormPlaceholder();
      this.setState({
         placeholder: this.state.remark,
      })

      // redirect back to the relevant component
      // this.props.history.push('/media/' + newMedia.data.id). ?????
      this.props.addRemark();
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
            <Card.Content>

               <Card.Header>{this.state.label}</Card.Header>

               <Form>
                  <Form.TextArea 
                     name="remark"
                     placeholder={this.state.placeholder}
                     onChange={this.handleChange}
                  />
                     <Button 
                        content={this.state.buttonText}
                        onClick={this.handleSubmit}
                     />
               </Form>
               
            </Card.Content>
         </Card>
           
      );

   }

}

export default AddRemark;
