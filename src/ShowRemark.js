import React from 'react';

import { Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

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

      console.log("this.props.remark inside ShowRemark, componentDidMount");
      console.log(this.props.remark);

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
            buttonText = 'Change Response';
            break;

         case 'comment':
             remark = this.props.remark.response;
             label = "Instructor response:";
             buttonText = 'Change Response';
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

               // if the remark is not changed (this.state.remark is empty), 
               // then save original remark
               if (!this.state.remark) {
                  await this.setState({
                     remark: this.props.remark.remark,
                  })
               }

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

               // if the remark is not changed (this.state.remark is empty), 
               // then save original remark
               if (!this.state.remark) {
                  await this.setState({
                     remark: this.props.remark.remark,
                  })
               }

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

               // if the response is not changed (this.state.remark is empty), 
               // then save original response
               if (!this.state.remark) {
                  await this.setState({
                     remark: this.props.remark.response,
                  })
               }

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

               // if the response is not changed (this.state.remark is empty), 
               // then save original response
               if (!this.state.remark) {
                  await this.setState({
                     remark: this.props.remark.response,
                  })
               }

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

      return (

         <div>

            <div className={this.props.user.is_teacher ? "teacher-remark" : "student-remark"}>

               {this.props.userType === "teacher"
                  ?
                     <div>
                        <Card>
                           <Card.Content>

                              <Card.Header>{this.state.label}</Card.Header>

                              {this.props.user.is_teacher
                                 ?
                                    <Form>                          
                                       <Form.TextArea 
                                          name="remark" 
                                          value={this.state.remark}
                                          placeholder={this.state.remark}
                                          onChange={this.handleChange}
                                       />
                                       <Button 
                                          content={this.state.buttonText}
                                          onClick={this.editRemark}
                                       />
                                    </Form>
                                 :
                                    <div>
                                       <Card.Description>{this.state.remark}</Card.Description>
                                    </div>
                              }
                                 
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
                                             value={this.state.remark}
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

                                       <Card.Description>{this.props.remark.remark}</Card.Description>

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


