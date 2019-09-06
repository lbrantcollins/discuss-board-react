import React from 'react';
import './index.css'

import SelectKeywords from '../SelectKeywords';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class EditChallenge extends React.Component {
   // props: challenge_id
   constructor(props) {
      super(props);

      this.state = {
         teacher_id: null,
      	title: '',
      	description: '',
      }

   }
   
   componentDidMount = async () => {

      try {

         // retrieve the challenge to be edited
         const response = await fetch(API_URL + '/challenges/' + this.props.challenge_id, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json'
            },
            credentials: 'include',
         })
         const challenge = await response.json();
        
         this.setState({
            teacher_id: challenge.teacher_id,
            title: challenge.title,
            description: challenge.description
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

   handleSubmit = async (e) => {
      e.preventDefault();

      // send edited challenge data to database and lift up state
      const editedChallenge = await this.props.editChallenge(this.props.challenge_id, 
         {
            teacher_id: this.state.teacher_id,
            title: this.state.title,
            description: this.state.description
         }
      )

      this.setState({
         title: editedChallenge.title,
         description: editedChallenge.description
      })

      //////////////////////////////
      // redirect somewhere?
      // this.props.history.push('/media/' + newMedia.data.id)
      //////////////////////////////

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
                  placeholder={this.state.title}
                  value={this.state.title} 
                  onChange={this.handleChange}
               />
               <br/>
               <label>Description:</label>
               <br/>
               <textarea 
                  rows="8"
                  name="description" 
                  placeholder={this.state.description}
                  value={this.state.description}
                  onChange={this.handleChange}
               ></textarea>
               <br/>
               <button>Submit Challenge</button>
            </form>

            <SelectKeywords challenge_id={this.props.challenge_id} />

            <SelectLanguages challenge_id={this.props.challenge_id} />

            

         </div>
           
      );

   }

}



export default EditChallenge;
