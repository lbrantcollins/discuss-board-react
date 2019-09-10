import React from 'react';

import SelectKeywords from './SelectKeywords';
import SelectLanguages from './SelectLanguages';

class AddChallenge extends React.Component {
   // props: challenge_id
   constructor() {
      super();

      this.state = {
         id: '',
      	title: '',
      	description: '',
         newChallengeCreated: false,
      }

   }
   
   // pre-processing may not be needed for this component
   // componentDidMount = async () => {
   // }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   handleSubmit = async (e) => {
      e.preventDefault();

      // send new challenge data to database
      const newChallenge = await this.props.addChallenge({
         teacher_id: this.props.teacher_id,
         title: this.state.title,
         description: this.state.description
      })

      this.setState({
         id: newChallenge.id,
         newChallengeCreated: true
      })

      // how to access session[:message] here?
      // and then reset it to null so does not continue to display?
      // and can CSS style good "message" vs. "bad" message:
      // className="message {session[:message][:status]}"

      // return the new challenge in case we need a return
      return newChallenge;

      // this.props.history.push('/media/' + newMedia.data.id)

  }
   
   render() {

      return (

         <div>

            <h2>This is "EditChallenge"</h2>

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

}



export default AddChallenge;