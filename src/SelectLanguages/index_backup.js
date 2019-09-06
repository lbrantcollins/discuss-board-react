import React { Component } from 'react';
import './index.css'

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class KeywordSelect extends Component {
   constructor() {
      super();

      this.state = {
      	keywords: [],
      	keywordSelections: [],
      }

   }
   
   componentDidMount = async () => {

      // retrieve list of all available keyword choices
      try {

         const response = await fetch(API_URL + '/keywords', {
            method: 'GET',
            credentials: 'include',
            headers: {
               'content-type': 'application/json'
            }
         })
         const parsedResponse = await response.json();
        
         const keywordSelections = new Array(parsedResponse.length).fill(false);
         keywordSelections[2] = true;
         keywordSelections[5] = true;
         this.setState({
            keywords: parsedResponse,
            keywordSelections: keywordSelections
         })

      } catch (err) {
         res.send(err)
      }

      // retrieve list of all available language choices
      try {

         const response = await fetch(API_URL + '/languages', {
            method: 'GET',
            credentials: 'include',
            headers: {
               'content-type': 'application/json'
            }
         })
         const parsedResponse = await response.json();

         const languageSelections = new Array(parsedResponse.length).fill(false);
         this.setState({
            languages: parsedResponse,
            languageSelections: languageSelections
         })

      } catch (err) {
         next(err)
      }
   }

   writeKeywordSelections = () => {
   	
   }

   toggleKeywordSelection = async (i) => {
   	const selectionsCopy = [...this.state.keywordSelections];
   	selectionsCopy[i] = !this.state.keywordSelections[i];
   	await this.setState({
   		keywordSelections: selectionsCopy
   	})
   	console.log(this.state.keywordSelections);
   }


   toggleLanguageSelection = (i) => {

   	const selectionsCopy = [...this.state.languageSelections];
   	selectionsCopy[i] = !this.state.languageSelections[i];
   	this.setState({
   		languageSelections: selectionsCopy
   	})
   }

         	
   render() {


      const keywordList = this.state.keywords.map( (keyword, i) => {
         return (
         	<div key={keyword.id}>
         		<input 
         			type="checkbox" 
         			onChange={this.toggleKeywordSelection.bind(null, i)} 
         			checked={this.state.keywordSelections[i]}
      			/>
         		{keyword.keyword}
         	</div>
			);
      })

      const languageList = this.state.languages.map( (language, i) => {
         return (
         	<div key={language.id} className="language-selection">
         		<button onClick={this.toggleLanguageSelection.bind(null, i)}>
         			{this.state.languageSelections[i] ? "Delete" : "  Add  "}
         			</button>
      			{language.language}
   			</div>
			);
      })


      return (

         <div>

         <h3>This is "AddChallenge"</h3>

         	Available keywords:
            	{keywordList}
      		<form className="keyword-selections" onSubmit={this.writeKeywordSelections}>
            	<button>Submit Keywords</button>
            </form>
           

            Available languages:
            <div className="language-selections">
               {languageList}
            </div>

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



export default AddChallenge;
