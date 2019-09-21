import React from 'react';

import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';


import './index.css'

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class SelectLanguages extends React.Component {
   constructor() {
      // props: challenge_id
      super();

      this.state = {
      	languages: [],
         languagesToBeDeleted: [],
         currentLanguageSelections: [],
      	newLanguageSelections: [],
         newLanguage: '',
         languageEditListToggle: false,
      }

   }

   // retrieve list of all available language choices (not challenge-specific)
   // and all languages selected for the current challenge
   componentDidMount = async () => {

      try {

         // retrieve list of all available language choices
         const response1 = await fetch(API_URL + '/languages', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const languages = await response1.json();

         // sort the languages in alphabetical order for a nicer display
         languages.sort((a, b) => (a.language > b.language) ? 1 : -1)
        
         // retrieve ids of languages associated with props.challenge_id
         const response2 = await fetch(API_URL + "/challengelanguages/" + this.props.challenge_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const parsedResponse2 = await response2.json();

         const challengeLanguageIds = parsedResponse2.map( (language) => {
            return language.language_id;
         })

         // create a boolean array to indicate which languages
         // are already associated with this challenge_id
         // (use this array to populate checkboxes in a Form)
         const currentLanguageSelections = languages.map( (language) => {
            return challengeLanguageIds.includes(language.id);
         })

         // create a boolean array (all false) until user
         // indicates which words to be deleted while editing languages
         const languagesToBeDeleted = Array(currentLanguageSelections.length).fill(false);

         this.setState({
            languages: languages,
            languagesToBeDeleted: languagesToBeDeleted,
            currentLanguageSelections: currentLanguageSelections,
            newLanguageSelections: currentLanguageSelections,
            languageEditListToggle: false,
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

   toggleLanguageEditList = (e) => {
      e.preventDefault();

      this.setState({
         languageEditListToggle: !this.state.languageEditListToggle
      })
   }

   deleteLanguages = async (e) => {
      e.preventDefault();

      // delete selected languages from table of available languages
      // AND delete from challenge-language through-table

      // send DELETE an array of record ids from languages table
      const languagesToDelete = [];

      for (let i = 0; i < this.state.languagesToBeDeleted.length; i++) {
         // if a checkbox is marked, send the language id for deletion
         if (this.state.languagesToBeDeleted[i]) {            
            languagesToDelete.push(this.state.languages[i].id);
         }
      }

      // Delete selected languages from the languages table
      // ...and, by extension, delete from the challenge-language through table 
      await fetch(API_URL + '/languages', {
         method: 'DELETE',
         body: JSON.stringify(languagesToDelete),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      }) 

      ////////////////////////////////
      // NEED TO REDIRECT SOMEWHERE (RATHER THAN RUN THIS FUNCTION)
      // grab the full list of languages, sort, and display
      await this.componentDidMount();
      ////////////////////////////////

   }

   addLanguage = async (e) => {
      e.preventDefault();

      if (this.state.newLanguage) {
         // add the new language to the list of available languages
         const response = await fetch(API_URL + '/languages', {
            method: 'POST',
            body: JSON.stringify( {language: this.state.newLanguage} ),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })        
      }


      // reset newLanguage to blank (to blank out the input Form)
      this.setState({
         newLanguage: ''
      })

      ////////////////////////////////
      // NEED TO REDIRECT SOMEWHERE (RATHER THAN RUN THIS FUNCTION)
      // grab the full list of languages, sort, and display
      await this.componentDidMount();
      ////////////////////////////////
   }

   updateLanguageSelections = async (e) => {
      e.preventDefault();

      // make a copy of the current state of selected languages
      const currentSelections = [...this.state.currentLanguageSelections];
      // make a copy of the new state of selected languages
      const newSelections = [...this.state.newLanguageSelections];

      // UPDATE STATE to reflect the changes in the browser
      this.setState({
         currentLanguageSelections: this.state.newLanguageSelections
      })

      // UPDATE DB to reflect the changes in the data

      // add newly selected languages to database
      // send POST an array of objects
      const languagesToAdd = [];

      // delete newly un-selected languages from database
      // send DELETE an array of record ids from challengeLanguages table
      const languagesToDelete = [];

      // In order to delete the through-table entries, we need to retrieve all
      // challenge-language through-table entry ids associated with props.challenge_id
      const response = await fetch(API_URL + "/challengelanguages/" + this.props.challenge_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
      const challengelanguages = await response.json();

      // organize the languages for addition into an array of objects (challenge & language ids)
      // and organize the languages for deletion into an array of through-table ids
      for (let i = 0; i < newSelections.length; i++) {
         // if a checkbox has changed
         if (newSelections[i] !== currentSelections[i]) {
            // if checkbox was selected while editing the challenge
            if (newSelections[i]) {
               languagesToAdd.push({
                  challenge_id: this.props.challenge_id,
                  language_id: this.state.languages[i].id
               })
            // else was de-selected while editing the challenge
            } else {
               // find the through-table id associated with language i (by matching the language ids)
               const index = challengelanguages.findIndex(kw => kw.language_id === this.state.languages[i].id)
               languagesToDelete.push(challengelanguages[index].id); 
            }
         }
      }

      // Create challenge-language through-table entries for NEW selected languages
      await fetch(API_URL + '/challengelanguages/', {
         method: 'POST',
         body: JSON.stringify(languagesToAdd),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })

      // Delete challenge-language through-table entries for DE-selected languages 
      await fetch(API_URL + '/challengelanguages', {
         method: 'DELETE',
         body: JSON.stringify(languagesToDelete),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })	
   }


   toggleLanguageSelection = async (i) => {
   	const newLanguageSelections = [...this.state.newLanguageSelections];
   	newLanguageSelections[i] = !this.state.newLanguageSelections[i];
   	await this.setState({
   		newLanguageSelections: newLanguageSelections
   	})
   }

   toggleLanguageToBeDeleted = async (i) => {
      const languagesToBeDeleted = [...this.state.languagesToBeDeleted];
      languagesToBeDeleted[i] = !this.state.languagesToBeDeleted[i];
      await this.setState({
         languagesToBeDeleted: languagesToBeDeleted
      })
   }
  	

   render() {

      const languageList = this.state.languages.map( (language, i) => {
         return (
         	<div key={language.id}>
         		<input 
         			type="checkbox" 
         			onChange={this.toggleLanguageSelection.bind(null, i)} 
         			checked={this.state.newLanguageSelections[i]}
      			/>
               &nbsp;
         		{language.language}
         	</div>
			);
      })

      const blankBoxLanguageList = this.state.languages.map( (language, i) => {
         return (
            <div key={language.id}>
               <input 
                  type="checkbox" 
                  onChange={this.toggleLanguageToBeDeleted.bind(null, i)} 
                  checked={this.state.languagesToBeDeleted[i]}
               />
               &nbsp;
               {language.language}
            </div>
         );
      })


      return (

         <div>

            {this.state.languageEditListToggle 
               ? 
                  <div>

                     <Card>
                        <Card.Content>

                           <Card.Header>Edit Language List</Card.Header>
                        
                           <Card.Description>
                              {blankBoxLanguageList}
                           </Card.Description>
                           <br/>

                           <Card.Meta>
                              <Form className="checkbox-selections" onSubmit={this.deleteLanguages}>
                                 <Button>Delete All Checked Languages</Button>
                              </Form>
                     
                              <p>CAUTION: Deleting a language deletes it from all existing challenges.</p>
                           </Card.Meta>
                           <br/>

                           <Card.Meta>
                              <Form className="add-a-new-checkbox-item" onSubmit={this.addLanguage}>
                                 <Form.Input 
                                    type="text"
                                    name="newLanguage"
                                    value={this.state.newLanguage}
                                    placeholder="Enter a new language"
                                    onChange={this.handleChange}
                                 />
                                 <Button>Submit New Language</Button>
                              </Form>
                           </Card.Meta>

                        </Card.Content>
                     </Card>

                  </div>   
               :
                  <div>
                     
                     <Card>
                        <Card.Content>

                           <Card.Header>Select Languages for the Challenge</Card.Header>
                        
                           <Card.Description>
                              {languageList}
                           </Card.Description>
                           <br/>

                           <Card.Meta>
                        		<Form className="checkbox-selections" onSubmit={this.updateLanguageSelections}>
                              	<Button>Submit Languages</Button>
                              </Form>
                           </Card.Meta>
                           <br/>
                           <Card.Meta>
                              <Form onSubmit={this.toggleLanguageEditList}>
                                 <Button>Edit List of Available Languages</Button>
                              </Form>
                           </Card.Meta>

                        </Card.Content>
                     </Card>
                  </div>
            }  

         </div>
      );

   }
}



export default SelectLanguages;
