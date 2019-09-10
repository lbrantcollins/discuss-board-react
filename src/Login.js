import React from 'react';
import { Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

class Login extends React.Component {
	// props: login (function), register (function)
   constructor(){
      super();

      this.state = {
         username: '',
         password: '',
      }
   }
   
   handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   handleSubmit = async (e) => {
      e.preventDefault();

      // send new user data to database
      const user = await this.props.login({
      	username: this.state.username,
         password: this.state.password,
      })

      // redirect somewhere
      // this.props.history.push('/browse-media')
      
      // just in case this call needs a return
      return user;
  	}

   render() {

      return (
      
         <Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh'}}>
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
             
                  </Segment>
               </Form>
            </Grid.Column>
         </Grid>
      )
  }
}

export default Login;
