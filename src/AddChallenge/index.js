import React from 'react';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class AddChallenge extends React.Component {
   constructor() {
      super();

      this.state = {
      	id: null,
      	title: '',
      	description: '',
      	keywords: [],
      	keywordSelections: [],
      	languages: [],
      	languageSelections: []
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
         await this.setState({
               keywords: parsedResponse,
               keywordSelections: keywordSelections
            })

      } catch (err) {
         console.log(err)
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
         await this.setState({
               languages: parsedResponse,
               languageSelections: languageSelections
            })

      } catch (err) {
         console.log(err)
      }
   }

   render() {

      const keywordList = this.state.keywords.map( (keyword) => {
         return <li key={keyword.id}>{keyword.keyword}</li>
      })

      const languageList = this.state.languages.map( (language) => {
         return <li key={language.id}>{language.language}</li>
      })

      return (
         <div>
         	Available keywords:
            <ul>
               {keywordList}
            </ul>

            Available languages:
            <ul>
               {languageList}
            </ul>
         </div>
      );

   }
}


export default AddChallenge;
