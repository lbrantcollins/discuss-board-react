import React from 'react';
import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

import ShowRemark from './ShowRemark'
import ShowSnippet from './ShowSnippet'

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class ShowChallenge extends React.Component {
	// props: user (user info), challenge (challenge info)
	constructor() {
		super();

		this.state = {
			questionIndex: null,
			questions: [],
			snippetIndex: null,
			snippets: [],

		}
	}

	// retrieve all existing questions and snippets for this challenge
	componentDidMount = async () => {

		// retrieve all existing questions for this challenge
		const response1 = await fetch(API_URL + '/questions/challenge/' + this.props.challenge.id, {
         method: 'GET',
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })
      const parsedResponse1 = await response1.json();

      // retrieve all existing snippets for this challenge
		const response2 = await fetch(API_URL + '/snippets/challenge/' + this.props.challenge.id, {
         method: 'GET',
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })
      const parsedResponse2 = await response2.json();

      this.setState({
         questions: parsedResponse1.questions,
         snippets: parsedResponse2.snippets,
      })
   }

   showQuestion = (i) => {
   	this.setState({
   		questionIndex: i,
   	})
   }

   showSnippet = (i) => {
   	this.setState({
   		snippetIndex: i,
   	})
   }

   render() {

   	const questionList = this.state.questions.map( (question, i) => {

			return (

				<Card key={i}>
					<Card.Content>
						<Card.Header> Student question: </Card.Header>
						<Card.Description> {question.question} </Card.Description>
						{this.props.user.is_teacher
							?
								<Card.Meta>	
									<Button 
										size="mini" 
										onClick={() => this.showQuestion(i)}> 
										Respond 
									</Button>
								</Card.Meta>				
							:
								null
						}
					</Card.Content>
				</Card>
				
			)
		})

		const snippetList = this.state.snippets.map( (snippet, i) => {

			return (

				<Card key={i}>
					<Card.Content>
						<Card.Header> Student answer: </Card.Header>
						<Card.Description> {snippet.snippet} </Card.Description>
							<Card.Meta>	
								<Button 
									size="mini" 
									onClick={() => this.showSnippet(i)}> 
									View Student Comments 
								</Button>
							</Card.Meta>						
					</Card.Content>
				</Card>
				
			)
		})


		return (

			<div>

				<p> This is the ShowChallenge component </p>

				{this.state.questionIndex
					?
						<ShowRemark 
							user={this.props.user}
							remark={this.state.questions[this.state.questionIndex]}
						/>
					:
						<div>
							<h2>Student questions about this challenge:</h2>
							<Card.Group>
								{questionList}
							</Card.Group>
						</div>
				}

				{this.state.snippetIndex
					?
						<ShowSnippet 
							user={this.props.user}
							question={this.state.snippets[this.state.snippetIndex]}
						/>
					:
						<div>
							<h2>Student answers to this challenge:</h2>
							<Card.Group>
								{snippetList}
							</Card.Group>
						</div>
				}

				
			</div>
		)

	}
}

export default ShowChallenge;
