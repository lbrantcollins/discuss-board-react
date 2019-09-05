import React from 'react';

// import './App.css';
// require('./index.css'); 

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class KeywordList extends React.Component {
   constructor() {
      super();

      this.state = {
      	keywords: []
      }

   }
   
   componentDidMount = async () => {

      try {

         const response = await fetch(API_URL + '/keywords', {
            method: 'GET',
            credentials: 'include',// on every request we have to send the cookie
            headers: {
               'content-type': 'application/json'
            }
         })
         const parsedResponse = await response.json();
         console.log(parsedResponse);

         await this.setState({
               keywords: parsedResponse
            })

      } catch (err) {
         console.log(err)
      }
   }

   render() {

      const keywordList = this.state.keywords.map( (keyword) => {
         return <option key={keyword.id} value={keyword.keyword}>{keyword.keyword}</option>
      })

      console.log(this.state.keywords);

      return (
         <div>
            <select>
               {keywordList}
            </select>
         </div>
      );

   }
}


export default KeywordList;
