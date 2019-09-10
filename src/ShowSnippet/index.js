import React from 'react';

import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';


import AddRemark from '../AddRemark';
import ShowRemark from '../ShowRemark';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class ShowSnippet extends React.Component {
   // props: userId, loggedIn, is_teacher, snippet_id
   //        editSnippet (a function), editRemark (a function)
   constructor() {
      super();

      this.state = {
         snippet: {},
         snippetText: '',
         comments:[],
      }

   }

   componentDidMount = async () => {

      // console.log("snippet_id", this.props.snippet_id);

      try {
         // retrieve the existing snippet from the database
         const response = await fetch(API_URL + '/snippets/' + this.props.snippet_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const snippet = await response.json(); 

         console.log(snippet);

         // retrieve any comments (& observations) on the snippet
         const response2 = await fetch(API_URL + '/comments/snippet/' + this.props.snippet_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const comments = await response2.json();

         console.log(comments);

         this.setState({
            snippet: snippet,
            snippetText: snippet.snippet,
            comments: comments,
         })

         
      } catch(err) {
         console.log(err);
      }

   }

   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   editSnippet = async (e) => {
      e.preventDefault();

      // add the snippet to the database
      const response = await fetch(API_URL + '/snippets/' + this.props.snippet_id, {
         method: 'PUT',
         body: JSON.stringify({
            challenge_id: this.state.snippet.challenge_id,
            language_id: this.state.snippet.language_id,
            student_id: this.state.snippet.student_id,
            snippet: this.state.snippetText,
            substantial: this.state.snippet.substantial,
         }),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })

      // return the new snippet in case the call needs a return
      const snippet = await response.json();

      // just in case the call needs a return
      return snippet;
  
   }

   
   render() {

      // Show the list of student comments (and accompanying teacher observations)
      // each of which is a "ShowRemark" generated here by a map method on all comments

      const commentList = this.state.comments.map( (comment) => {

         return (

            <Container key={comment.id} className="ui two cards">
               <Segment stacked textAlign='left'>

               <ShowRemark className="student-remark"
                  userId={this.props.userId}
                  loggedIn={this.props.loggedIn}
                  is_teacher={this.props.is_teacher}
                  remarkId={comment.id}
                  parentId={this.props.snippet_id}
                  elementType="snippet"
                  remarkUserId={comment.student_id}
                  remark={comment.comment}
                  substantial={comment.substantial}
                  editRemark={this.props.editRemark}
               />

               {comment.observation
                  ?
                     <div>

                        <ShowRemark className="teacher-remark"
                           userId={this.props.userId}
                           loggedIn={this.props.loggedIn}
                           is_teacher={this.props.is_teacher}
                           remarkId={comment.observation_id}
                           parentId={comment.id}
                           elementType="comment"
                           remarkUserId={comment.teacher_id}
                           remark={comment.observation}
                           substantial={null}  
                           editRemark={this.props.editRemark}
                        />
                     </div>
                  : 
                     <div>
                        {this.props.is_teacher
                           ?
                              <div>
                                 <AddRemark 
                                    userId={this.props.userId}
                                    elementId={comment.id}
                                    elementType="comment"
                                 />

                              </div>

                           : null
                        }
                     </div>

                           
               }
               </Segment>
            </Container> 
         )
         
      })

    	return (
            		
   		<div>

   			<Card>
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



            Language: {this.state.snippet.language}
            <br/>

            Code Snippet:
            <br/>
            

            {this.state.snippet.student_id === this.props.userId
               ?
                  <form onSubmit={this.editSnippet}>
           
                     <h4>You can edit your code snippet here:</h4>

                     <br/>
                     <textarea 
                        rows="8"
                        name="snippetText" 
                        value={this.state.snippetText}
                        placeholder={this.state.snippetText}
                        onChange={this.handleChange}
                     ></textarea>
                     <br/> 

                     <button>Submit Changes</button>
                  </form>
               : 
                  <pre><code>
                     {this.state.snippetText}
                  </code></pre>

            }


            <Card.Group>
               {commentList}
            </Card.Group>

            {this.props.is_teacher
               ? null
               :
                  <AddRemark 
                     userId={this.props.userId}
                     elementId={this.props.snippet_id}
                     elementType="snippet"
                  />
            }

   		</div>

   	)
   }
}

export default ShowSnippet;
