import React from 'react';
import './index.css'

import SelectKeywords from '../SelectKeywords';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class AddChallenge extends React.Component {
   // props: challenge_id
   constructor() {
      super();

      this.state = {
      	title: '',
      	description: '',
      }

   }
   
   componentDidMount = async () => {
      // not sure if this is needed
   }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   handleSubmit = async (e) => {
      e.preventDefault();

      // send new challenge data to database and lift up state
      const newChallenge = await this.props.addChallenge({
         teacher_id: this.state.teacher_id,
         title: this.state.title,
         description: this.state.description
      })

      this.setState({
         id: newChallenge.id,
         newChallengeCreated: true
      })

      // return the new challenge in case we need a return
      return newChallenge;

      // this.props.history.push('/media/' + newMedia.data.id)

  }
   
   render() {

      return (

         <div>

            <h3>This is "EditChallenge"</h3>

            <form onSubmit={this.handleSubmit}>
               <label>Title:</label>
               <br/>
               <input 
                  type="text" 
                  name="title" 
                  placeholder="Challenge Title" 
                  onChange={this.handleChange}
               />
               <br/>
               <label>Description:</label>
               <br/>
               <textarea 
                  rows="8"
                  name="description" 
                  placeholder="Challenge Description"
                  onChange={this.handleChange}
               ></textarea>
               <br/>
               <button>Submit Challenge</button>
            </form>

            {/* Allow keyword selection after challenge created */}
            {this.state.newChallengeCreated ? <SelectKeywords challenge_id={this.props.challenge_id} /> : null}
            

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
