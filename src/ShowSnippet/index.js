import React from 'react';

import AddRemark from '../AddRemark';
import ShowRemark from '../ShowRemark';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class ShowSnippet extends React.Component {
   // props: userId, loggedIn, isTeacher, snippet_id
   //        editRemark (a function)
   constructor() {
      super();

      this.state = {
         snippet: {},
         language: '',
         comments:[],
      }

   }

   componentDidMount = async () => {

      try {
         // retrieve the existing snippet from the database
         const response = await fetch(API_URL + '/snippets/' + this.props.snippet_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const snippet = await response.json(); 

         // retrieve the name of the language of the snippet
         const response2 = await fetch(API_URL + '/languages/' + snippet.language_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const languageObject = await response2.json();  
         const language = languageObject.language;

         // retrieve any comments on the snippet
         const response3 = await fetch(API_URL + '/comments/snippet/' + snippet.id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const comments = await response3.json();

         console.log(comments);

         this.setState({
            snippet: snippet,
            language: language,
            comments: comments,
         })

      } catch(err) {
         console.log(err);
      }

   }

   
   render() {

      // instead of "ShowRemark" below, will show the list of comments
      // each of which is a "ShowRemark" generated here by a map method on all remarks

      const commentList = this.state.comments.map( (comment) => {

         return (
            <ShowRemark 
               key={comment.id}
               userId={this.props.userId}
               loggedIn={this.props.loggedIn}
               isTeacher={this.props.isTeacher}
               remarkId={comment.id}
               parentId={this.state.snippet.id}
               elementType="snippet"
               remarkUserId={comment.student_id}
               remark={comment.comment}
               substantial={comment.substantial}
               editRemark={this.props.editRemark}
            /> 
         )
         
      })

    	return (
            		
   		<div>

   			<h3>This is "ShowSnippet"</h3>

            Language: {this.state.language}
            <br/>

            Code Snippet:
            <br/>

            <pre><code>
               {this.state.snippet.snippet}
            </code></pre>
            <br/>


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
