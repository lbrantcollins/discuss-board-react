import React, { Component } from 'react';
import './index.css'

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class SelectKeywords extends Component {
   constructor() {
      // props: challenge_id
      super();

      this.state = {
      	keywords: [],
         currentKeywordSelections: [],
      	newKeywordSelections: [],
      }

   }

   // retrieve list of all available keyword choices
   // and all keywords selected for the current challenge
   componentDidMount = async () => {

      try {

         // retrieve list of all available keyword choices
         const response1 = await fetch(API_URL + '/keywords', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json'
            },
            credentials: 'include',
         })
         const keywords = await response1.json();
        
         // retrieve ids of keywords associated with props.challenge_id
         const response2 = await fetch(API_URL + "/challengekeywords/" + this.props.challenge_id, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json'
            },
            credentials: 'include',
         })
         const parsedResponse2 = await response2.json();

         const challengeKeywordIds = parsedResponse2.map( (keyword) => {
            return keyword.keyword_id;
         })

         // create a boolean array to indicate which keywords
         // are already associated with this challenge_id
         // (use this array to populate checkboxes in a form)
         const currentKeywordSelections = keywords.map( (keyword) => {
            return challengeKeywordIds.includes(keyword.id);
         })

         this.setState({
            keywords: keywords,
            currentKeywordSelections: currentKeywordSelections,
            newKeywordSelections: currentKeywordSelections
         })

      } catch (err) {
         console.log(err);
      }
   }

   updateKeywordSelections = async (e) => {
      e.preventDefault();

      // make a copy of the current state of selected keywords
      const currentSelections = [...this.state.currentKeywordSelections];
      // make a copy of the new state of selected keywords
      const newSelections = [...this.state.newKeywordSelections];

      // update state to reflect the changes in the browser
      this.setState({
         currentKeywordSelections: this.state.newKeywordSelections
      })

      // update the DB to reflect the changes in the data

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
            headers: {
               'Content-Type': 'application/json'
            },
            credentials: 'include',
         })
      const challengekeywords = await response.json();

      console.log("--- challengekeywords ---");
      console.log(challengekeywords);

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

      console.log("--- keywordsToDelete ---");
      console.log(keywordsToDelete);

      // Create challenge-keyword through-table entries for NEW selected keywords
      await fetch(API_URL + '/challengekeywords/', {
         method: 'POST',
         body: JSON.stringify(keywordsToAdd),
         headers: {
            'Content-Type': 'application/json'
         },
         credentials: 'include',
      })


      // Delete challenge-keyword through-table entries for DE-selected keywords 
      await fetch(API_URL + '/challengekeywords', {
         method: 'DELETE',
         body: JSON.stringify(keywordsToDelete),
         headers: {
            'Content-Type': 'application/json'
         },
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
  	

   render() {


      const keywordList = this.state.keywords.map( (keyword, i) => {
         return (
         	<div key={keyword.id}>
         		<input 
         			type="checkbox" 
         			onChange={this.toggleKeywordSelection.bind(null, i)} 
         			checked={this.state.newKeywordSelections[i]}
      			/>
         		{keyword.keyword}
         	</div>
			);
      })

      return (

         <div>

         <h3>This is "SelectKeywords"</h3>

         	Available keywords:
            	{keywordList}
      		<form className="keyword-selections" onSubmit={this.updateKeywordSelections}>
            	<button>Submit Keywords</button>
            </form>

         </div>
      );

   }
// <div key={keyword.id} className="keyword-selection">
//          		<button onClick={this.toggleKeywordSelection.bind(null, i)}>
//          			{this.state.keywordSelections[i] ? "Delete" : "  Add  "}
//       			</button>
//       			{keyword.keyword}
//    			</div> 
}



export default SelectKeywords;
