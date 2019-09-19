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

         console.log("Comments inside ShowSnippet component");
         console.log(parsedResponse);

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

   editSnippet = async (e) => {
      e.preventDefault();

      // add the snippet to the database
      const response = await fetch(API_URL + '/snippets/' + this.props.snippet_id, {
         method: 'PUT',
         body: JSON.stringify({
            challenge_id: this.props.snippet.challenge_id,
            language_id: this.props.snippet.language_id,
            student_id: this.props.snippet.student_id,
            snippet: this.props.snippetText,
            substantial: this.props.snippet.substantial,
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

      let commentList = null;

      console.log(this.state.challenges);

      // Show the list of student comments (and accompanying teacher observations)
      // each of which is a "ShowRemark" generated here by a map method on all comments

      if (this.state.loaded && this.state.comments) {

         // create an entry to render for each comment (with it's teacher observation)
         commentList = this.state.comments.map( (comment, i) => {

            return (

               <Card key={i}>
                  <ShowRemark className="student-remark"
                     user={this.props.user}
                     remark={comment}
                     userType="student"
                     elementType="snippet"
                  />

                  {comment.observation
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

            {this.props.user.is_teacher
               ? null
               :
                  <AddRemark 
                     user={this.props.user}
                     remark={this.props.snippet}
                     elementType="snippet"
                  />
            }
   			
            <Card.Group>

            
               <Card>

                  <Card.Header>
                     Student answer:
                  </Card.Header>

                  <Card.Meta>
                     Language: {this.props.snippet.language}
                  </Card.Meta>
               
                  <Card.Content>
                     {this.props.snippet.student_id === this.props.user.id
                        ?
                           <Form>
                              <Form.TextArea 
                                 name="snippetText" 
                                 value={this.props.snippet.snippet}
                                 placeholder={this.props.snippet.snippet}
                                 onChange={this.handleChange}
                              />
                              <Button 
                                 content="Submit Changes"
                                 onClick={this.editSnippet}
                              />
                           </Form>

                           
                        : 
                           <div>
                              <pre><code> {this.props.snippet.snippet}</code></pre>
                           </div>                       

                     }
                  </Card.Content>
               </Card>
           
               {commentList}

            </Card.Group>

            

   		</div>

   	)
   }
}

export default ShowSnippet;


    // <Card>
               // <Card.Content>
                        
               //    <Form>
               //       <Form.TextArea 
               //          name="remark" 
               //          value={this.state.remark}
               //          placeholder={this.state.remark}
               //          onChange={this.handleChange}
               //       />
               //       <Button 
               //          content='Submit Changes'
               //          onClick={this.props.editRemark.bind(null,
               //          this.props.elementType,
               //          this.props.parentId,
               //          this.props.remarkId,
               //          this.props.remarkUserId,
               //          this.state.remark,
               //          this.props.substantial
               //       )}/>
               //    </Form>
                           
               // </Card.Content>
            // </Card>                   




