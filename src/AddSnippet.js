import React from 'react';

import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class AddSnippet extends React.Component {
   constructor() {
   	// props: challenge, toggleAddSnippet (function)
      super();

      this.state = {
      	language_id: '',
      	snippet: '',
      	languages: [],
      	languageSelection: [],
      }

   }

   
   componentDidMount = async () => {

   	try {

   		// retrieve list of all available language choices
         const response1 = await fetch(API_URL + '/languages', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const allLanguages = await response1.json();        
        
         // retrieve ids of languages associated with props.challenge_id
         const response2 = await fetch(API_URL + "/challengelanguages/" + this.props.challenge.id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const parsedResponse = await response2.json();

         const languageIds = parsedResponse.map( (language) => language.language_id);

         // reduce the list of languages to only those associated with this challenge
	      const languages = allLanguages.filter( language => languageIds.includes(language.id))
	      // sort the languages in alphabetical order for a nicer display
	      languages.sort((a, b) => (a.language > b.language) ? 1 : -1)

	      // create a boolean array (all false) until user
         // indicates which language they will use for the code snippet
         const languageSelection = Array(languages.length).fill(false);

	      this.setState({
	      	languages: languages,
	      	languageSelection: languageSelection,
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

   toggleLanguageSelection = (i) => {

  		// mark the selected "checkbox" as true, all others false
  		// (since can only choose ONE language for a code snippet)
  		const selection = this.state.languageSelection
   	const languageSelection = selection.map( (language, j) => j === i);

   	// update state and the chosen language will be the only one with a checkbox
   	this.setState({
   		languageSelection: languageSelection
   	})
   }

   addSnippet = async (e) => {
   	e.preventDefault();

   	// determine the id of the language the student chose for the snippet
   	const languageIndex = this.state.languageSelection.findIndex(language => language === true);
   	const languageId = this.state.languages[languageIndex].id;

   	// add the snippet to the database
   	await fetch(API_URL + '/snippets', {
   		method: 'POST',
   		body: JSON.stringify({
	   		challenge_id: this.props.challenge.id,
	   		language_id: languageId,
	   		student_id: this.props.challenge.student_id,
	   		snippet: this.state.snippet,
	   		substantial: false,
   		}),
   		headers: {'Content-Type': 'application/json'},
         credentials: 'include',
   	})

      this.props.toggleAddSnippet();
 
   }


   render() {

   	const languageList = this.state.languages.map( (language, i) => {
         return (
         	<div key={language.id}>
         		<input 
         			type="checkbox" 
         			onChange={this.toggleLanguageSelection.bind(null, i)} 
         			checked={this.state.languageSelection[i]}
      			/>
         		{language.language}
         	</div>
			);
      })

      console.log("languageList in AddSnippet");
      console.log(languageList);

   	return (
            		
   		<div>

				<div>                   
               <Form onSubmit={this.addSnippet}>

            	<h4>What language are you submitting for this challenge?</h4>

               {languageList}

               <h4>Copy/paste your code snippet here:</h4>

               	<br/>
	               <Form.TextArea 
	                  rows="8"
	                  name="snippet" 
	                  value={this.state.snippet}
	                  placeholder="Remember to indent using tabs!"
	                  onChange={this.handleChange}
	               />
	               <br/> 

                  <Button>Submit</Button>
               </Form>
            </div>
   		</div>

   	)

   }

}

export default AddSnippet;
