import React from 'react';

import AddRemark from '../AddRemark';
import ShowRemark from '../ShowRemark';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class ShowSnippet extends React.Component {
   // props: userId, loggedIn, is_teacher, snippet_id
   //        editSnippet (a function), editRemark (a function)
   constructor() {
      super();

      this.state = {
         snippetRecord: {},
         snippet: '',
         language: '',
         comments:[],
      }

   }

   componentDidMount = async () => {

      console.log("snippet_id", this.props.snippet_id);

      try {
         // retrieve the existing snippet from the database
         const response = await fetch(API_URL + '/snippets/' + this.props.snippet_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const snippet = await response.json(); 

         console.log(snippet);
         console.log(snippet.language);

         // retrieve the name of the language of the snippet
         const response2 = await fetch(API_URL + '/languages/' + snippet.language_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const languageObject = await response2.json();  
         const language = languageObject.language;

         console.log(language);

         // retrieve any comments on the snippet
         const response3 = await fetch(API_URL + '/comments/snippet/' + snippet.id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const comments = await response3.json();

         console.log(comments);

         this.setState({
            snippetRecord: snippet,
            snippet: snippet.snippet,
            language: language,
            comments: comments,
         })

      } catch(err) {
         console.log(err);
      }

   }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   editSnippet = async (e) => {
      e.preventDefault();

      // add the snippet to the database
      const response = await fetch(API_URL + '/snippets/' + this.props.snippet_id, {
         method: 'PUT',
         body: JSON.stringify({
            challenge_id: this.state.snippetRecord.challenge_id,
            language_id: this.state.snippetRecord.language_id,
            student_id: this.state.snippetRecord.student_id,
            snippet: this.state.snippet,
            substantial: this.state.snippetRecord.substantial,
         }),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })

      // return the new snippet in case the call needs a return
      const snippet = await response.json();

      // just in case the call needs a return
      return snippet;
  
   }

   
   render() {

      // instead of "ShowRemark" below, will show the list of comments
      // each of which is a "ShowRemark" generated here by a map method on all remarks

      const commentList = this.state.comments.map( (comment) => {

         return (

            <div key={comment.id}>

               <h2>This is a pair of remarks</h2>

               <ShowRemark className="student-remark"
                  userId={this.props.userId}
                  loggedIn={this.props.loggedIn}
                  is_teacher={this.props.is_teacher}
                  remarkId={comment.id}
                  parentId={this.props.snippet_id}
                  elementType="snippet"
                  remarkUserId={comment.student_id}
                  remark={comment.comment}
                  substantial={comment.substantial}
                  editRemark={this.props.editRemark}
               />

               {comment.observation 
                  ?
                     <div>
                        <p>This is ShowRemark for a teacher observation</p>

                        <ShowRemark className="teacher-remark"
                           userId={this.props.userId}
                           loggedIn={this.props.loggedIn}
                           is_teacher={this.props.is_teacher}
                           remarkId={comment.observation.id}
                           parentId={comment.id}
                           elementType="comment"
                           remarkUserId={comment.observation.teacher_id}
                           remark={comment.observation.observation}
                           substantial={null}  
                           editRemark={this.props.editRemark}
                        />
                     </div>
                  : null
               }

            </div> 
         )
         
      })

    	return (
            		
   		<div>

   			<h3>This is "ShowSnippet"</h3>

            Language: {this.state.language}
            <br/>

            Code Snippet:
            <br/>
            

            {this.props.loggedIn && (this.state.snippetRecord.student_id === this.props.userId)
               ?
                  <form onSubmit={this.editSnippet}>
           
                     <h4>You can edit your code snippet here:</h4>

                     <br/>
                     <textarea 
                        rows="8"
                        name="snippet" 
                        value={this.state.snippet}
                        placeholder={this.state.snippet}
                        onChange={this.handleChange}
                     ></textarea>
                     <br/> 

                     <button>Submit Changes</button>
                  </form>
               : 
                  <pre><code>
                     {this.state.snippet}
                  </code></pre>

            }


            <div>
               {commentList}
            </div>

            <AddRemark 
               userId={this.props.userId}
               elementId={this.props.snippet_id}
               elementType="snippet"
            />

   		</div>

   	)
   }
}

export default ShowSnippet;
