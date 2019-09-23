import React from 'react';

import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';


import AddRemark from './AddRemark';
import ShowRemark from './ShowRemark';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class ShowSnippet extends React.Component {
   // props: user, snippet
   constructor() {
      super();

      this.state = {
         snippetText: '',
         comments:[],
         loaded: false,
      }

   }

   componentDidMount = async () => {

      try {
         // retrieve any comments (& observations) on the snippet
         const response = await fetch(API_URL + '/comments/snippet/' + this.props.snippet.id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
         })
         const parsedResponse = await response.json();

         this.setState({
            snippetText: this.props.snippet.snippet,
            comments: parsedResponse.comments,
            loaded: true,
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

   // save the updated snippet text to the database
   saveSnippet = async (e) => {
      e.preventDefault();

      // if no change made to snippet (this.state.snippetText is empty, 
      // then save the original snippet
      if (!this.state.snippetText) {
         await this.setState({
            snippetText: this.props.snippet.snippet,
         })
      }

      await fetch(API_URL + '/snippets/' + this.props.snippet.id, {
         method: 'PUT',
         body: JSON.stringify({snippet: this.state.snippetText}),
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      }) 
   }

   // reload the page after a remark is added
   addRemark = () => {
      this.componentDidMount();
   }

   
   render() {

      let commentList = null;

      // Show the list of student comments (and accompanying teacher observations)
      // each of which is a "ShowRemark" generated here by a map method on all comments

      if (this.state.loaded && this.state.comments) {

         // for each comment, create an entry to render (with it's teacher observation)
         commentList = this.state.comments.map( (comment, i) => {

            return (

               <Card key={i}>
                  <ShowRemark className="student-remark"
                     user={this.props.user}
                     remark={comment}
                     userType="student"
                     elementType="snippet"
                  />

                  {comment.response
                     ?
                        <div>
                           <ShowRemark className="teacher-remark"
                              user={this.props.user}
                              remark={comment}
                              userType="teacher"
                              elementType="comment"
                           />
                        </div>
                     : 
                        <div>
                           {this.props.user.is_teacher
                              ?
                                 <div>
                                    <AddRemark 
                                       user={this.props.user}
                                       remark={comment}
                                       elementType="comment"
                                       addRemark={this.addRemark}
                                    />
                                 </div>
                              : 
                                 null
                           }
                        </div>                           
                  }
               </Card>

            )
            
         })

      }


    	return (
            		
   		<div>
   			
            <Card.Group>
            
               <Card>
                  <Card.Content>
                     <Card.Header>
                        Student answer:
                     </Card.Header>

                        Language: {this.props.snippet.language}
                  
                     <Card.Description>

                        {this.props.user.is_teacher || this.props.snippet.student_id === this.props.user.id
                           ?
                              <Form>
                                 <Form.TextArea 
                                    name="snippetText" 
                                    value={this.state.snippetText}
                                    placeholder={this.state.snippetText}
                                    onChange={this.handleChange}
                                 />
                                 <Button 
                                    content={this.props.user.is_teacher ? "Submit Corrections" : "Submit Changes"}
                                    onClick={this.saveSnippet}
                                 />
                              </Form>                             
                           : 
                              <div>
                                 <pre><code> {this.props.snippet.snippet}</code></pre>
                              </div>                       
                        }

                     </Card.Description>
                  </Card.Content>
               </Card>
           
            {this.props.user.is_teacher
               ? null
               :
                  <AddRemark 
                     user={this.props.user}
                     remark={this.props.snippet}
                     elementType="snippet"
                     addRemark={this.addRemark}
                  />
            }

               {commentList}

            </Card.Group>         

   		</div>

   	)
   }
}

export default ShowSnippet;






