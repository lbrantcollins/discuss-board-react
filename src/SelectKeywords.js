import React from 'react';

import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

import './index.css'

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class SelectKeywords extends React.Component {
   constructor() {
      // props: challenge_id
      super();

      this.state = {
      	keywords: [],
         keywordsToBeDeleted: [],
         currentKeywordSelections: [],
      	newKeywordSelections: [],
         newKeyword: '',
         keywordEditListToggle: false,
      }

   }

   // retrieve list of all available keyword choices
   // and all keywords selected for the current challenge
   componentDidMount = async () => {

      try {

         // retrieve list of all available keyword choices
         const response1 = await fetch(API_URL + '/keywords', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const keywords = await response1.json();

         // sort the keywords in alphabetical order for a nicer display
         keywords.sort((a, b) => (a.keyword > b.keyword) ? 1 : -1)
        
         // retrieve ids of keywords associated with props.challenge_id
         const response2 = await fetch(API_URL + "/challengekeywords/" + this.props.challenge_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const parsedResponse2 = await response2.json();

         const challengeKeywordIds = parsedResponse2.map( (keyword) => {
            return keyword.keyword_id;
         })

         // create a boolean array to indicate which keywords
         // are already associated with this challenge_id
         // (use this array to populate checkboxes in a Form)
         const currentKeywordSelections = keywords.map( (keyword) => {
            return challengeKeywordIds.includes(keyword.id);
         })

         // create a boolean array (all false) until user
         // indicates which words to be deleted while editing keywords
         const keywordsToBeDeleted = Array(currentKeywordSelections.length).fill(false);

         this.setState({
            keywords: keywords,
            keywordsToBeDeleted: keywordsToBeDeleted,
            currentKeywordSelections: currentKeywordSelections,
            newKeywordSelections: currentKeywordSelections,
            keywordEditListToggle: false,
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

   toggleKeywordEditList = (e) => {
      e.preventDefault();

      this.setState({
         keywordEditListToggle: !this.state.keywordEditListToggle
      })
   }

   deleteKeywords = async (e) => {
      e.preventDefault();

      // delete selected keywords from table of available keywords
      // AND delete from challenge-keyword through-table

      // send DELETE an array of record ids from keywords table
      const keywordsToDelete = [];

      for (let i = 0; i < this.state.keywordsToBeDeleted.length; i++) {
         // if a checkbox is marked, send the keyword id for deletion
         if (this.state.keywordsToBeDeleted[i]) {            
            keywordsToDelete.push(this.state.keywords[i].id);
         }
      }

      // Delete selected keywords from the keywords table
      // ...and, by extension, delete from the challenge-keyword through table 
      await fetch(API_URL + '/keywords', {
         method: 'DELETE',
         body: JSON.stringify(keywordsToDelete),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      }) 

      ////////////////////////////////
      // NEED TO REDIRECT SOMEWHERE (RATHER THAN RUN THIS FUNCTION)
      // grab the full list of keywords, sort, and display
      await this.componentDidMount();
      ////////////////////////////////

   }

   addKeyword = async (e) => {
      e.preventDefault();

      if (this.state.newKeyword) {
         // add the new keyword to the list of available keywords
         const response = await fetch(API_URL + '/keywords', {
            method: 'POST',
            body: JSON.stringify( {keyword: this.state.newKeyword} ),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })        
      }

      // reset newKeyword to blank (to blank out the input Form)
      this.setState({
         newKeyword: ''
      })

      ////////////////////////////////
      // NEED TO REDIRECT SOMEWHERE (RATHER THAN RUN THIS FUNCTION)
      // grab the full list of keywords, sort, and display
      await this.componentDidMount();
      ////////////////////////////////
   }

   updateKeywordSelections = async (e) => {
      e.preventDefault();

      // make a copy of the current state of selected keywords
      const currentSelections = [...this.state.currentKeywordSelections];
      // make a copy of the new state of selected keywords
      const newSelections = [...this.state.newKeywordSelections];

      // UPDATE STATE to reflect the changes in the browser
      this.setState({
         currentKeywordSelections: this.state.newKeywordSelections
      })

      // UPDATE DB to reflect the changes in the data

      // add newly selected keywords to database
      // send POST an array of objects
      const keywordsToAdd = [];

      // delete newly un-selected keywords from database
      // send DELETE an array of record ids from challengeKeywords table
      const keywordsToDelete = [];

      // In order to delete the through-table entries, we need to retrieve all
      // challenge-keyword through-table entry ids associated with props.challenge_id
      const response = await fetch(API_URL + "/challengekeywords/" + this.props.challenge_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
      const challengekeywords = await response.json();

      // organize the keywords for addition into an array of objects (challenge & keyword ids)
      // and organize the keywords for deletion into an array of through-table ids
      for (let i = 0; i < newSelections.length; i++) {
         // if a checkbox has changed
         if (newSelections[i] !== currentSelections[i]) {
            // if checkbox was selected while editing the challenge
            if (newSelections[i]) {
               keywordsToAdd.push({
                  challenge_id: this.props.challenge_id,
                  keyword_id: this.state.keywords[i].id
               })
            // else was de-selected while editing the challenge
            } else {
               // find the through-table id associated with keyword i (by matching the keyword ids)
               const index = challengekeywords.findIndex(kw => kw.keyword_id === this.state.keywords[i].id)
               keywordsToDelete.push(challengekeywords[index].id); 
            }
         }
      }

      // Create challenge-keyword through-table entries for NEW selected keywords
      await fetch(API_URL + '/challengekeywords/', {
         method: 'POST',
         body: JSON.stringify(keywordsToAdd),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })

      // Delete challenge-keyword through-table entries for DE-selected keywords 
      await fetch(API_URL + '/challengekeywords', {
         method: 'DELETE',
         body: JSON.stringify(keywordsToDelete),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })	
   }


   toggleKeywordSelection = async (i) => {
   	const newKeywordSelections = [...this.state.newKeywordSelections];
   	newKeywordSelections[i] = !this.state.newKeywordSelections[i];
   	await this.setState({
   		newKeywordSelections: newKeywordSelections
   	})
   }

   toggleKeywordToBeDeleted = async (i) => {
      const keywordsToBeDeleted = [...this.state.keywordsToBeDeleted];
      keywordsToBeDeleted[i] = !this.state.keywordsToBeDeleted[i];
      await this.setState({
         keywordsToBeDeleted: keywordsToBeDeleted
      })
   }
  	

   render() {

      const keywordList = this.state.keywords.map( (keyword, i) => {
         return (
         	<div key={keyword.id}>
         		<input 
         			type="checkbox" 
         			onChange={this.toggleKeywordSelection.bind(null, i)} 
         			checked={this.state.newKeywordSelections[i]}
      			/>
               &nbsp;
         		{keyword.keyword}
         	</div>
			);
      })

      const blankBoxKeywordList = this.state.keywords.map( (keyword, i) => {
         return (
            <div key={keyword.id}>
               <input 
                  type="checkbox" 
                  onChange={this.toggleKeywordToBeDeleted.bind(null, i)} 
                  checked={this.state.keywordsToBeDeleted[i]}
               />
               &nbsp;
               {keyword.keyword}
            </div>
         );
      })


      return (

         <div>

            {this.state.keywordEditListToggle 
               ? 
                  <div>

                     <Card>
                        <Card.Content>

                           <Card.Header>Edit Keyword List</Card.Header>
                        
                           <Card.Description>
                              {blankBoxKeywordList}
                           </Card.Description>
                           <br/>

                           <Card.Meta>
                              <Form className="checkbox-selections" onSubmit={this.deleteKeywords}>
                                 <Button>Delete All Checked Keywords</Button>
                              </Form>
                     
                              <p>CAUTION: Deleting a keyword deletes it from all existing challenges.</p>
                           </Card.Meta>
                           <br/>

                           <Card.Meta>
                              <Form className="add-a-new-checkbox-item" onSubmit={this.addKeyword}>
                                 <Form.Input 
                                    type="text"
                                    name="newKeyword"
                                    value={this.state.newKeyword}
                                    placeholder="Enter a new keyword"
                                    onChange={this.handleChange}
                                 />
                                 <Button>Submit New Keyword</Button>
                              </Form>
                           </Card.Meta>

                        </Card.Content>
                     </Card>

                  </div>   
               :
                  <div>

                     <Card>
                        <Card.Content>

                           <Card.Header>Select Keywords for the Challenge</Card.Header>
                        
                           <Card.Description>
                              {keywordList}
                           </Card.Description>
                           <br/>

                           <Card.Meta>
                              <Form 
                                 className="checkbox-selections" 
                                 onSubmit={this.updateKeywordSelections}>
                                 <Button>Submit Keywords</Button>
                              </Form>
                           </Card.Meta>
                           <br/>
                           <Card.Meta>
                              <Form onSubmit={this.toggleKeywordEditList}>
                                 <Button>Edit List of Available Keywords</Button>
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



export default SelectKeywords;
