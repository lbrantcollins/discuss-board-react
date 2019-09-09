import React from 'react';

// use the API url from environment if it exists
// const API_URL = process.env.REACT_APP_API_URL || ''; 

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

      this.setState({
         remark: this.props.remark,
      })
      
   }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }
     
   render() {

      return (

         <div>

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
                           <button onClick={this.props.editRemark.bind(null,
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
