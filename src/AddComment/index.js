import React from 'react';


class AddComment extends React.Component {
   // props: userId, elementtId (id of challenge, question, snippet, comment)
   //        modelName("challenge", "question", "snippet", "comment")
   constructor() {
      super();

      this.state = {
      	content: '',
         label: '',
      }

   }
   
   // pre-processing for this component
   componentDidMount = async () => {

      // provide a label to the "add comment" title 
      // where the form is displayed with the relevant component
      let label;
 
      switch (this.props.modelName) {

         // Set a label to title the comment box

         case 'challenge':
            this.label = "Ask a Question";
            break;

         case 'snippet':
            this.label = "Make a Comment";
            break;

         case 'question':
            this.label = "Give a Response";
            break;

         case 'comment':
             this.label = "Make an Observation";
            break;
      }

      this.setState({
         label: this.label,
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

      switch (this.props.modelName) {

         // the content is a student question about a challenge
         case 'challenge':
            this.data = {
               challenge_id: this.props.elementId,
               student_id: this.props.userId,
               question: this.state.content,
               substantial: false
            }
            break;

         // the content is a student comment about a snippet
         case 'snippet':
            this.data = {
               snippet_id: this.props.elementId,
               student_id: this.props.userId,
               comment: this.state.content,
               substantial: false
            }
            break;

         // the content is a teacher response to a student question about a challenge
         case 'question':
            this.data = {
               question_id: this.props.elementId,
               teacher_id: this.props.userId,
               response: this.state.content,
            }
            break;

         // the content is a teacher response to a student comment about a snippet
         case 'comment':
            this.data = {
               comment_id: this.props.elementId,
               teacher_id: this.props.userId,
               observation: this.state.content,
            }
            break;
      }

      // add the remark to the relevant component
      const remark = await this.props.addComment(this.props.modelName, this.data)

      // blank out the form for adding another remark on the relevant component
      this.setState({
         content: '',
      })

      // return the remark in case we need a return
      return this.remark;

      // redirect back to the relevant component
      // this.props.history.push('/media/' + newMedia.data.id). ?????
   }

   
   render() {

      return (

         <div>

            <h3>This is "AddComment"</h3>

            <form onSubmit={this.handleSubmit}>
               <label>{this.state.label}:</label>
               <br/>
               <input 
                  type="text" 
                  name="content" 
                  placeholder="Enter your remark" 
                  onChange={this.handleChange}
               />
               <button>Submit</button>
            </form>

         </div>
           
      );

   }

}

export default AddComment;
