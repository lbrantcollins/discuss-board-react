import React from 'react';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9292'; 

class AddRemark extends React.Component {
   // props: userId, elementtId (id of challenge, question, snippet, comment)
   //        elementType ("challenge", "question", "snippet", "comment")
   constructor() {
      super();

      this.state = {
      	content: '',
         label: '',
         placeholder: '',
      }

   }
   
   // pre-processing for this component
   componentDidMount = async () => {

      // provide a label to the "add (remark)" title 
      // and provide placeholder text
      // for when the form is displayed for the relevant component
      let label;
      let placeholder;
       
      switch (this.props.elementType) {

         // Set a label to title the remark box

         case 'challenge':
            label = "Ask a Question";
            placeholder = "...about the challenge your instructor posed.";
            break;

         case 'snippet':
            label = "Leave a Comment";
            placeholder = "...about your fellow student's suggested code snippet.";
            break;

         case 'question':
            label = "Give a Response";
            placeholder = "...to your student's question about the challenge posed.";
            break;

         case 'comment':
             label = "Make an Observation";
             placeholder = "...about your student's comment on the code snippet.";
            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment")
      }

      this.setState({
         label: label,
         placeholder: placeholder,
      })

      
   }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   // add the content as a remark on the relevant component
   handleSubmit = async (e) => {
      e.preventDefault();

      // return data: the remark content and accompanying fields
      let data;
      // route for posting the remark to the database
      let remarkRoute;

      switch (this.props.elementType) {

         // the content is a student question about a challenge
         case 'challenge':
            data = {
               challenge_id: this.props.elementId,
               student_id: this.props.userId,
               question: this.state.content,
               substantial: false
            }
            remarkRoute = "questions"
            break;

         // the content is a student comment about a snippet
         case 'snippet':
            data = {
               snippet_id: this.props.elementId,
               student_id: this.props.userId,
               comment: this.state.content,
               substantial: false
            }
            remarkRoute = "comments"
            break;

         // the content is a teacher response to a student question about a challenge
         case 'question':
            data = {
               question_id: this.props.elementId,
               teacher_id: this.props.userId,
               response: this.state.content,
            }
            remarkRoute = "responses"
            break;

         // the content is a teacher response to a student comment about a snippet
         case 'comment':
            data = {
               comment_id: this.props.elementId,
               teacher_id: this.props.userId,
               observation: this.state.content,
            }
            remarkRoute = "observations"
            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment");
      }

      // add the remark to the database for the relevant component
      const remark = await fetch(API_URL + '/' + remarkRoute, {
         method: 'POST',
         body: JSON.stringify(data),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })

      // blank out the form for adding another remark on the relevant component
      this.setState({
         content: '',
      })

      // return the remark in case we need a return from the function call
      return remark;

      // redirect back to the relevant component
      // this.props.history.push('/media/' + newMedia.data.id). ?????
   }

   render() {

      return (

         <div>

            <h3>This is "AddRemark"</h3>

            <form onSubmit={this.handleSubmit}>
               <label>{this.state.label}:</label>
               <br/>
               <textarea
                  rows="8" 
                  type="text" 
                  name="content" 
                  placeholder={this.state.placeholder} 
                  onChange={this.handleChange}
               ></textarea>
               <button>Submit</button>
            </form>

         </div>
           
      );

   }

}

export default AddRemark;
