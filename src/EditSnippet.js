import React from 'react';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class EditSnippet extends React.Component {
   constructor() {
   	// props: snippet_id
      super();

      this.state = {
         language: '',
         id: '',
         challenge_id: '',
         language_id: '',
         student_id: '',
      	snippet: '',
         substantial: '',
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
         const language = await response2.json();        

	      this.setState({
	      	language: language.language,
            id: snippet.id,
            challenge_id: snippet.challenge_id,
            language_id: snippet.language_id,
            student_id: snippet.student_id,
            snippet: snippet.snippet,
            substantial: snippet.substantial,
	      })
         	
      } catch (err) {
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
   	const response = await fetch(API_URL + '/snippets/' + this.state.id, {
   		method: 'PUT',
   		body: JSON.stringify({
	   		challenge_id: this.state.challenge_id,
	   		language_id: this.state.language_id,
	   		student_id: this.state.student_id,
	   		snippet: this.state.snippet,
	   		substantial: this.state.substantial,
   		}),
   		headers: {'Content-Type': 'application/json'},
         credentials: 'include',
   	})

      // return the new snippet in case the call needs a return
      const newSnippet = await response.json();

      return newSnippet;
  
   }


   render() {

   	return (
            		
   		<div>

   			<h3>This is "EditSnippet"</h3>

				<div>                   
               <form onSubmit={this.editSnippet}>

            	<h4>Language: {this.state.language}</h4>

               <h4>Edit your code snippet here:</h4>

               	<br/>
	               <textarea 
	                  rows="8"
	                  name="snippet" 
	                  value={this.state.snippet}
	                  placeholder={this.state.snippet}
	                  onChange={this.handleChange}
	               ></textarea>
	               <br/> 

                  <button>Submit</button>
               </form>
            </div>
   		</div>

   	)

   }

}

export default EditSnippet;
