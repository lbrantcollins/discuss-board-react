import React from 'react';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class ShowRemark extends React.Component {
   // props: userID, loggedIn, isTeacher,
   //        remarkId (id of question, comment, response, observation),
   //        parentId (id of challenge, snippet, question, comment),
   //        elementType ("challenge", "snippet", "question", "comment"),
   //        remarkUserId, remark, substantial
   //        editRemark (a function at top level, App.js)
   constructor(props) {
      super(props);

      this.state = {
         remark: this.props.remark,
      }

   }
   
   // pre-processing for this component
   componentDidMount = async () => {

      console.log("--------> this.props at start of ShowRemark <--------");
      console.log(this.props);

      this.setState({
         remark: this.props.remark,
      })
      
   }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   handleSubmitEditedRemark = async (e) => {
      e.preventDefault();

      console.log("*********** inside handleSubmitEditedRemark");

      // variable to hold response from the PUT fetch
      let putResponse;
      let returnRemark;

      switch (this.props.elementType) {

         // Set a label to title the remark box

         case 'challenge':
            
            // update database
            putResponse = await fetch(API_URL + '/questions/' + this.props.remarkId, {
               method: 'PUT',
               body: JSON.stringify({
                  challenge_id: this.props.parentId,
                  student_id: this.props.remarkUserId,
                  question: this.state.remark,
                  substantial: this.props.substantial,
               }),
               headers: {'Content-Type': 'application/json'},
               credentials: 'include',
            }) 
            returnRemark = await putResponse.json();

            break;

         case 'snippet':

            console.log("----------->  in the snippet case writing to DB <---------");
            
            // update database
            putResponse = await fetch(API_URL + '/comments/' + this.props.remarkId, {
               method: 'PUT',
               body: JSON.stringify({
                  snippet_id: this.props.parentId,
                  student_id: this.props.remarkUserId,
                  comment: this.state.remark,
                  substantial: this.props.substantial,
               }),
               headers: {'Content-Type': 'application/json'},
               credentials: 'include',
            }) 
            returnRemark = await putResponse.json();

            break;

         case 'question':
                       
            // update database
            putResponse = await fetch(API_URL + '/responses/' + this.props.remarkId, {
               method: 'PUT',
               body: JSON.stringify({
                  comment_id: this.props.parentId,
                  teacher_id: this.props.remarkUserId,
                  response: this.state.remark,
               }),
               headers: {'Content-Type': 'application/json'},
               credentials: 'include',
            }) 
            returnRemark = await putResponse.json();

            break;

         case 'comment':
            
            // update database
            putResponse = await fetch(API_URL + '/observations/' + this.props.remarkId, {
               method: 'PUT',
               body: JSON.stringify({
                  comment_id: this.props.parentId,
                  teacher_id: this.props.remarkUserId,
                  observation: this.state.remark,
               }),
               headers: {'Content-Type': 'application/json'},
               credentials: 'include',
            }) 
            returnRemark = await putResponse.json();

            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment")
      }

      // just in case the call needs a return
      return returnRemark;

   }

      
   render() {

      return (

         <div>

            <h3>This is "ShowRemark"</h3>

            <div className={this.props.isTeacher ? "teacher-remark" : "student-remark"}>

               
               {
                  this.props.loggedIn && this.props.remarkUserId === this.props.userId
                     ?  
                        <div>
                           <textarea 
                              rows="8"
                              name="remark" 
                              value={this.state.remark}
                              placeholder={this.state.remark}
                              onChange={this.handleChange}
                           ></textarea>
                           <br/>
                           <button onSubmit={this.props.editRemark.bind(null,
                                 this.props.elementType,
                                 this.props.parentId,
                                 this.props.remarkId,
                                 this.props.remarkUserId,
                                 this.state.remark,
                                 this.props.substantial
                              )}
                           >
                              Submit Changes
                           </button>
                        </div>
                     : this.state.remark
               }

            </div>

            
         </div>
           
      )

   }

}

export default ShowRemark;
