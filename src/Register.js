import React from 'react';
import { Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class Register extends React.Component {
	// props: register (function), toggleLoginRegister (function)
   constructor(){
      super();

      this.state = {
         username: '',
         password: '',
         is_teacher: false,
      }
   }

   // keep state up-to-date with what user is typing (username/password)
   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   // keep state up-to-date with user click on checkbox (is teacher or not)
   toggleTeacher = (e) => {
      e.preventDefault();

      this.setState({
         is_teacher: !this.state.is_teacher
      })
   }

   // send user data along to create a new user in the database
   handleSubmit = async (e) => {
      e.preventDefault();

      const user = await this.props.register({
      	username: this.state.username,
         password: this.state.password,
         is_teacher: this.state.is_teacher,
      })
  	}

   render() {

      return (
      
         <Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh'}}>
            <Grid.Column style={{maxWidth: 450}}>
               <Header as='h2' textAlign='center'>
                  Register 
               </Header>
               <Form onSubmit={this.handleSubmit}>
                  <Segment stacked textAlign='left'>

                     Username:
                     <Form.Input fluid icon='user' iconPosition='left' placeholder='username' type='text' name='username' onChange={this.handleChange}/>

                     Password:
                     <Form.Input fluid icon='lock' iconPosition='left' type='password' name='password' onChange={this.handleChange}/>

                     Are you a teacher?
                     <Checkbox onChange={this.toggleTeacher} checked={this.state.is_teacher}/>
               		                  
                     
                     <Button fluid size='large' type='sumbit'>Register</Button>

                     <Message>
                        Already registered? <span className="link-text" onClick={this.props.toggleLoginRegister}>Log in</span>
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
      )
  }
}

export default Register;


