import React from 'react';
import { Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class Register extends React.Component {
	// props: lregister (function), toggleLoginRegister (function)
   constructor(){
      super();

      this.state = {
         username: '',
         password: '',
         is_teacher: false,
      }
   }

   
   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   toggleTeacher = (e) => {
      e.preventDefault();

      this.setState({
         is_teacher: !this.state.is_teacher
      })
   }

   handleSubmit = async (e) => {
      e.preventDefault();

      // send new user data to database
      const user = await this.props.register({
      	username: this.state.username,
         password: this.state.password,
         is_teacher: this.state.is_teacher,
      })

      // redirect somewhere
      // this.props.history.push('/browse-media')
      
      // just in case this call needs a return
      return user;
  	}

   render() {

   	// console.log("this.state.is_teacher", this.state.is_teacher);

   	// <input 
         					// type="checkbox" 
         					// onChange={this.toggleTeacher} 
         					// checked={this.state.is_teacher}
      					// />  

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
             
                  </Segment>
               </Form>
            </Grid.Column>
         </Grid>
      )
  }
}

export default Register;