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
        
         // retrieve ids of keywords associate w props.challenge_id
         const response2 = await fetch(API_URL + '/challengekeywords/challengeId', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json'
            },
            credentials: 'include',
         })
         const keywordIds = await response2.json();

         console.log("------------ keywordIds in SelectKeywords componentDidMount");
         console.log(keywordIds);

         // create a boolean array to indicate which keywords
         // are already associated with this challenge_id
         // (use this array to populate checkboxes in a form)
         const currentKeywordSelections = keywords.map( (keyword) => {
            return keywordIds.includes(keyword.id);
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

   updateKeywordSelections = () => {

      // make a copy of the current state of selected keywords
      const currentSelections = [...this.state.currentKeywordSelections];
      // make a copy of the new state of selected keywords
      const newSelections = [...this.state.newKeywordSelections];

      // add newly selected keywords to database
      // send POST an array of objects
      const keywordsToAdd = [];
      // delete newly un-selected keywords from database
      // send DELETE an array of record ids from challengeKeywords table
      const keywordsToDelete = [];

      for (let i = 0; i < newSelections.length; i++) {
         if (newSelections[i] !== currentSelections[i]) {
            if (newSelections[i]) {
               keywordsToAdd.push({
                  challenge_id: this.props.challenge_id,
                  keyword_id: i
               })
            } else {
               // keywordsToDelete.push()
            }
         }
      }

      // create

      // destroy   	
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
