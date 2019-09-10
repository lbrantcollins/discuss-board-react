import React from 'react';

import { Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';
// import { Link } from 'react-router-dom';

// use the API url from environment if it exists
// const API_URL = process.env.REACT_APP_API_URL || ''; 

class ShowRemark extends React.Component {
   // props: userID, loggedIn, is_teacher,
   //        remarkId (id of question, comment, response, observation),
   //        parentId (id of challenge, snippet, question, comment),
   //        elementType ("challenge", "snippet", "question", "comment"),
   //        remarkUserId, remark, substantial
   //        editRemark (a function at top level, App.js)
   constructor(props) {
      super(props);

      this.state = {
         remark: this.props.remark,
         label: '',
      }

   }
   
   // pre-processing for this component
   componentDidMount = async () => {

      // provide a label (a remark title) customized for the specific component
      let label;
       
      switch (this.props.elementType) {

          case 'challenge':
            label = "Student question:";
            break;

         case 'snippet':
            label = "Student comment:";
            break;

         case 'question':
            label = "Instructor response:";
            break;

         case 'comment':
             label = "Instructor response:";
            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment")
      }


      this.setState({
         remark: this.props.remark,
         label: label,
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

            <div className={this.props.is_teacher ? "teacher-remark" : "student-remark"}>
             
               {this.props.remarkUserId === this.props.userId
                  ?  
                     
                     <Card>
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
                     </Card>
                     
                  : 
                     <Card>
                        <Card.Header>{this.state.label}</Card.Header>
                        <Card.Content>{this.state.remark}</Card.Content>
                     </Card>
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



