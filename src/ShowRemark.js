import React from 'react';

import { Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';
// import { Link } from 'react-router-dom';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class ShowRemark extends React.Component {
   // props: user, remark (student and teacher remarks and info), 
   //        elementType (challenge, question, snippet, comment),
   //        userType (the remark is written by a "student" or "teacher")
   constructor() {
      super();

      this.state = {
         remark: '',
         label: '',
         buttonText: '',
         loaded: false,
      }

   }
   
   // pre-processing for this component
   componentDidMount = async () => {

      // provide a label (a remark title) and button text customized 
      // for the specific component and grab the remark text from props
      let label;
      let buttonText;
      let remark;
       
      switch (this.props.elementType) {

          case 'challenge':
            remark = this.props.remark.remark;
            label = "Student question:";
            buttonText = 'Edit Question';
            break;

         case 'snippet':
            remark = this.props.remark.remark;
            label = "Student comment:";
            buttonText = 'Edit Comment';
            break;

         case 'question':
            remark = this.props.remark.response;
            label = "Instructor response:";
            buttonText = 'Edit Response';
            break;

         case 'comment':
             remark = this.props.remark.response;
             label = "Instructor response:";
             buttonText = 'Edit Response';
            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment")
      }

      this.setState({
         remark: remark,
         label: label,
         buttonText: buttonText,
         loaded: true,
      })
      
   }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   editRemark = async () => {

      // variables to hold response from the database PUT
      let remark;
      let parsedRemark;

      switch (this.props.elementType) {

         // Set a label to title the remark box

         case 'challenge':
            
            // update database for a student's question about a challenge
            try {

               await fetch(API_URL + '/questions/' + this.props.remark.remark_id, {
                  method: 'PUT',
                  body: JSON.stringify({
                     challenge_id: this.props.remark.parent_id,
                     student_id: this.props.remark.student_id,
                     question: this.state.remark,
                     substantial: this.props.remark.substantial,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               }) 

            } catch(err) {
               console.log(err);
            }

            break;

         case 'snippet':
            
            // update database for a student's comment about a snippet
            try {

               await fetch(API_URL + '/comments/' + this.props.remark.remark_id, {
                  method: 'PUT',
                  body: JSON.stringify({
                     snippet_id: this.props.remark.parent_id,
                     student_id: this.props.remark.student_id,
                     comment: this.state.remark,
                     substantial: this.props.remark.substantial,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               }) 

            } catch(err) {
               console.log(err);
            }

            break;

         case 'question':
                       
            // update database for teacher response to a student Q about challenge
            try {

               await fetch(API_URL + '/responses/' + this.props.remark.response_id, {
                  method: 'PUT',
                  body: JSON.stringify({
                     question_id: this.props.remark.remark_id,
                     teacher_id: this.props.remark.teacher_id,
                     response: this.state.remark,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               }) 

            } catch(err) {
               console.log(err);
            }

            break;

         case 'comment':
            
            // update database for teacher response to a student comment about snippet
            try {

               await fetch(API_URL + '/observations/' + this.props.remark.response_id, {
                  method: 'PUT',
                  body: JSON.stringify({
                     comment_id: this.props.remark.remark_id,
                     teacher_id: this.props.remark.teacher_id,
                     observation: this.state.remark,
                  }),
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
               }) 

            } catch(err) {
               console.log(err);
            }

            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment")
      }

   }
     
   render() {

      if (this.state.loaded) {

         console.log("this.props.user inside ShowRemark");
         console.log(this.props.user);

         console.log("this.props.remark inside ShowRemark");
         console.log(this.props.remark);


         // const remarkUserId = 
         //    {this.props.user.is_teacher 
         //       ? this.props.remark.teacher_id 
         //       : this.props.remark.student_id
         //    })
      }

      return (

         <div>

            <div className={this.props.user.is_teacher ? "teacher-remark" : "student-remark"}>

               {this.props.userType === "teacher"
                  ?
                     <div>
                        <Card>
                           <Card.Content>

                              <Card.Header>{this.state.label}</Card.Header>

                              <Form>                          
                                 <Form.TextArea 
                                    name="remark" 
                                    value={this.props.remark.response}
                                    placeholder={this.state.remark}
                                    onChange={this.handleChange}
                                 />
                                 <Button 
                                    content={this.state.buttonText}
                                    onClick={this.editRemark}
                                 />
                              </Form>
                                 
                           </Card.Content>
                        </Card>
                     </div>
                  :
                     <div>
                        {this.props.user.id === this.props.remark.student_id
                           ?  
                              <div>
                                 <Card>
                                    <Card.Content>

                                       <Card.Header>{this.state.label}</Card.Header>

                                       <Form>
                                          <Form.TextArea 
                                             name="remark" 
                                             value={this.props.remark.remark}
                                             placeholder={this.state.remark}
                                             onChange={this.handleChange}
                                          />
                                          <Button 
                                             content={this.state.buttonText}
                                             onClick={this.editRemark}
                                          />
                                       </Form>
                                       
                                    </Card.Content>
                                 </Card>
                              </div>
                              
                           : 
                              <div>
                                 <Card>
                                    <Card.Content>

                                       <Card.Header>{this.state.label}</Card.Header>

                                       <Card.Description>{this.state.remark}</Card.Description>

                                    </Card.Content>
                                 </Card>
                              </div>
                        }
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



