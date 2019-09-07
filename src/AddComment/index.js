import React from 'react';


class AddComment extends React.Component {
   // props: tableId, modelName                                       
                                                   ////////////// what are the props?
   constructor(props) {
      super(props);

      this.state = {
      	content: '',
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

   // add the content as a remark on the relevant component
   handleSubmit = async (e) => {
      e.preventDefault();

      // provide a label to the "add comment" title 
      // where the form is displayed with the relevant component
      let label;

      switch (this.props.modelName) {

         // the content is a student question about a challenge
         case 'challenge':
            data = {
               challenge_id: this.props.parentId,
               student_id: this.props.id,
               question: this.state.content,
               substantial: false
            }
            label = "Question";
            break;

         // the content is a student comment about a snippet
         case 'snippet':
            data = {
               snippet_id: this.props.parentId,
               student_id: this.props.id,
               comment: this.state.content,
               substantial: false
            }
            label = "Comment";
            break;

         // the content is a teacher response to a student question about a challenge
         case 'question':
            data = {
               question_id: this.props.parentId,
               teacher_id: this.props.id,
               response: this.state.content,
            }
            label = "Reponse";
            break;

         // the content is a teacher response to a student comment about a snippet
         case 'comment':
            data = {
               comment_id: this.props.parentId,
               teacher_id: this.props.id,
               observation: this.state.content,
            }
            label = "Observation";
            break;


      }

      // add the remark to the relevant component
      const remark = await this.props.addComment(this.props.modelName, data)

      // blank out the form for adding another remark on the relevant component
      this.setState({
         content: ''
      })

   }

      // return the remark in case we need a return
      return remark;

      // redirect back to the relevant component
      // this.props.history.push('/media/' + newMedia.data.id). ?????

  }
   
   render() {

      return (

         <div>

            <h2>This is "AddComment"</h2>

            <form onSubmit={this.handleSubmit}>
               <label>Add a {label}:</label>
               <br/>
               <input 
                  type="text" 
                  name="content" 
                  placeholder="Enter your remark" 
                  onChange={this.handleChange}
               />
               <button>Submit {label}</button>
            </form>

         </div>
           
      );

   }

}

export default AddComment;
