import React from 'react';

import { Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';
// import { Link } from 'react-router-dom';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class ShowRemark extends React.Component {
   // props: userID, loggedIn, is_teacher,
   //        remarkId (id of question, comment, response, observation),
   //        parentId (id of challenge, snippet, question, comment),
   //        elementType ("challenge", "snippet", "question", "comment"),
   //        remarkUserId, remark, substantial
   //        editRemark (a function at top level, App.js)
   constructor() {
      super();

      this.state = {
         remark: '',
         label: '',
      }

   }
   
   // pre-processing for this component
   componentDidMount = async () => {

      // provide a label (a remark title) customized for the specific component
      // and set the remark and remark user id according to the remark type
      let label;
      let remark;
       
      switch (this.props.elementType) {

          case 'challenge':
            label = "Student question:";
            remark = this.props.remark.question;
            break;

         case 'snippet':
            label = "Student comment:";
            remark = this.props.remark.comment;
            break;

         case 'question':
            label = "Instructor response:";
            remark = this.props.remark.response;
            break;

         case 'comment':
             label = "Instructor response:";
             remark = this.props.remark.observation;
            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment")
      }

      this.setState({
         remark: remark,
         label: label,
      })
      
   }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   editRemark = async (elementType, parentId, remarkId, remarkUserId, remark, substantial) => {

      // variables to hold response from the database PUT
      let putResponse;
      let returnRemark;

      switch (elementType) {

         // Set a label to title the remark box

         case 'challenge':
            
            // update database
            try {

               putResponse = await fetch(API_URL + '/questions/' + remarkId, {
                  method: 'PUT',
                  body: JSON.stringify({
                     challenge_id: parentId,
                     student_id: remarkUserId,
                     question: remark,
                     substantial: substantial,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               }) 
               returnRemark = await putResponse.json();

            } catch(err) {
               console.log(err);
            }

            break;

         case 'snippet':
            
            // update database
            try {

               putResponse = await fetch(API_URL + '/comments/' + remarkId, {
                  method: 'PUT',
                  body: JSON.stringify({
                     snippet_id: parentId,
                     student_id: remarkUserId,
                     comment: remark,
                     substantial: substantial,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               }) 
               returnRemark = await putResponse.json();

            } catch(err) {
               console.log(err);
            }

            break;

         case 'question':
                       
            // update database
            try {

               putResponse = await fetch(API_URL + '/responses/' + remarkId, {
                  method: 'PUT',
                  body: JSON.stringify({
                     comment_id: parentId,
                     teacher_id: remarkUserId,
                     response: remark,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               }) 
               returnRemark = await putResponse.json();

            } catch(err) {
               console.log(err);
            }

            break;

         case 'comment':
            
            // update database
            try {

               putResponse = await fetch(API_URL + '/observations/' + remarkId, {
                  method: 'PUT',
                  body: JSON.stringify({
                     comment_id: parentId,
                     teacher_id: remarkUserId,
                     observation: remark,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               }) 
               returnRemark = await putResponse.json();

            } catch(err) {
               console.log(err);
            }

            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment")
      }

      // just in case the call needs a return
      return returnRemark;



   }
     
   render() {

      const remarkUserId = this.props.remark.teacher_id;
      
      // const remarkUserId = 
      //    {this.props.user.is_teacher 
      //       ? this.props.remark.teacher_id 
      //       : this.props.remark.student_id
      //    })



      return (

         <div>

            <div className={this.props.user.is_teacher ? "teacher-remark" : "student-remark"}>
             
               {remarkUserId === this.props.user.id
                  ?  
                     <div>
                        <Card.Header>{this.state.label}</Card.Header>
                        <Card.Content>
                           <Form>
                              <Form.TextArea 
                                 name="remark" 
                                 value={this.state.remark}
                                 placeholder={this.state.remark}
                                 onChange={this.handleChange}
                              />
                              <Button 
                                 content='Submit Changes'
                                 onClick={this.props.editRemark.bind(null,
                                 this.props.elementType,
                                 this.props.parentId,
                                 this.props.remarkId,
                                 this.props.remarkUserId,
                                 this.state.remark,
                                 this.props.substantial
                              )}/>
                           </Form>
                           
                        </Card.Content>
                        </div>
                     
                  : 
                  <div>
                        <Card.Header>{this.state.label}</Card.Header>
                        <Card.Content>{this.state.remark}</Card.Content>
                        </div>
               }

            </div>

            
         </div>
           
      )

   }

}

export default ShowRemark;

// <Card>
//          <Card.Content>
//             <Card.Header id="comment-header">{props.comment.user_id.username}</Card.Header>
//             <Card.Meta>{date}</Card.Meta>
//             <Card.Description>{props.comment.content}</Card.Description>
//             {(props.comment.user_id.id === props.userId) && (props.loggedIn)
//                ?
//                   <Button onClick={props.deleteComment.bind(null, props.comment.id)}>
//                      Delete
//                   </Button>
//                : null
//             }  
//          </Card.Content>
//       </Card>


// <textarea 
//                               rows="8"
//                               name="remark" 
//                               value={this.state.remark}
//                               placeholder={this.state.remark}
//                               onChange={this.handleChange}
//                            ></textarea>
//                            <br/>
//                            <button onClick={this.props.editRemark.bind(null,
//                               this.props.elementType,
//                               this.props.parentId,
//                               this.props.remarkId,
//                               this.props.remarkUserId,
//                               this.state.remark,
//                               this.props.substantial
//                            )}>
//                               Submit Changes
//                            </button>



