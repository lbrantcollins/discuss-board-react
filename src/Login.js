import React from 'react';
import { Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class Login extends React.Component {
	// props: login (function), toggleLoginRegister (function)
   constructor(){
      super();

      this.state = {
         username: '',
         password: '',
      }
   }
   
   // keep state up-to-date with what user is typing (username/password)
   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   handleSubmit = async (e) => {
      e.preventDefault();

      // send user data to function that check if user exists in DB
      const user = await this.props.login({
      	username: this.state.username,
         password: this.state.password,
      })

  	}

   render() {

      return (

         <div>

         <Segment>

            <h1>Classroom discussion board for a participation grade</h1>

            <ul>
               <li>Teachers can pose challenges</li>
               <li>Students can propose answers</li>
               <li>Students can comment on those answers</li>
               <li>Teachers can respond to each comment</li>
            </ul>

            <p>A comment/response "thread" is between one student and the teacher/TAs.
               <br/>
               The intent is to provide a 1-to-1 experience for the student.
               <br/>
               Yet all students can see all threads (anonymously).
            </p>

            <h3>Nice-to-have add-ons</h3>

            <ul>
               <li>Students can ask clarifying questions about the challenge</li>
               <li>Teachers can give feedback on a student answer</li>
               <li>Display date/time for each challenge, answer, comment, response</li>
               <li>Use highlighting to alert teachers to follow-on comments not yet addressed
                  (for timely 1-on-1 conversation between student and teacher)</li>
               <li>Students must be on a roster to be allowed to register on the site</li>
               <li>Display computer code with syntax highlighting</li>
            </ul>

            <h3>Technologies</h3>

            <ul>
               <li>Front end: JavaScript, React</li>
               <li>Back end: ruby, Sinatra, postgresql</li>
               <li>Nine SQL tables (two are through tables)</li>
            </ul>

      
            <Grid textAlign='center' verticalAlign='top' style={{ height: '100vh'}}>
               <Grid.Column style={{maxWidth: 450}}>
                  <Header as='h2' textAlign='center'>
                     Welcome!  Please log in.
                  </Header>
                  <Form onSubmit={this.handleSubmit}>
                     <Segment stacked textAlign='left'>

                        Username:
                        <Form.Input fluid icon='user' iconPosition='left' placeholder='username' type='text' name='username' onChange={this.handleChange}/>

                        Password:
                        <Form.Input fluid icon='lock' iconPosition='left' type='password' name='password' onChange={this.handleChange}/>
                        
                        <Button fluid size='large' type='sumbit'>Log in</Button>

                        <Message>
                        Not registered? <span className="link-text" onClick={this.props.toggleLoginRegister}>Sign up</span>
                        </Message>

                        {this.props.message
                           ?
                              <div>
                                 <br/>
                                 <p className="message bad"> {this.props.message} </p>
                              </div>
                           :
                              null
                        }

                
                     </Segment>
                  </Form>
               </Grid.Column>
            </Grid>

         </Segment>

         </div>
      )
  }
}

export default Login;
