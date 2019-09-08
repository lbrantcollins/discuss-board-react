import React from 'react';

import ShowRemarks from '../ShowRemarks';
import AddRemark from '../AddRemark';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class ShowSnippet extends React.Component {
   // props: snippet_id
   constructor() {
      super();

      this.state = {
         snippet: {},
         language: '',
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

         console.log(snippet);

         // retrieve the name of the language of the snippet
         const response2 = await fetch(API_URL + '/languages/' + snippet.language_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const languageObject = await response2.json();  
         const language = languageObject.language;

         // retrieve any comments on the snippet
         // const response3 = await fetch(API_URL + '/comments/' + snippet.id, {
         //    method: 'GET',
         //    headers: {'Content-Type': 'application/json'},
         //    credentials: 'include',
         // })
         // const comments = await response3.json();

         this.setState({
            snippet: snippet,
            language: language,
         })

      } catch(err) {
         console.log(err);
      }

   }


   render() {

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

            <ShowRemarks 
               elementId={this.props.snippet_id}
               elementType="snippet"
            />

            <AddRemark 
               userId={this.state.snippet.user_id}
               elementId={this.props.snippet_id}
               elementType="snippet"
            />

   		</div>

   	)
   }
}

export default ShowSnippet;
