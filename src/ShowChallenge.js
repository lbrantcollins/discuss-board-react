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
			loaded: false,
		}
	}

	// retrieve all existing questions and snippets for this challenge
	componentDidMount = async () => {

		console.log("this.props.challenge.id in ShowChallenge");
		console.log(this.props.challenge.id);

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
         loaded: true,
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

   	let questionList = null;
   	let snippetList = null;

   	if (this.state.loaded) {

   		if (this.state.questions) {

		   	console.log("this.state.questions inside ShowChallenge");
		   	console.log(this.state.questions);

		   	console.log("question 2 in ShowChallenge.js");
				console.log(this.state.questions[1]);


		   	questionList = this.state.questions.map( (question, i) => {

					return (

		   	////////////////////////////
		   	// use ShowRemark here (twice: question and response)
		   	////////////////////////////

						<Card key={i}>
							<Card.Content>
								<Card.Header> Student question: </Card.Header>
								<Card.Description> {question.remark} </Card.Description>
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

   		}

			if (this.state.snippets) {

				console.log("this.state.snippets inside ShowChallenge");
		   	console.log(this.state.snippets);

				console.log("snippet 1 inside ShowChallenge");
				console.log(this.state.snippets[0]);

				snippetList = this.state.snippets.map( (snippet, i) => {

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

			}

		}

		return (

			<div>

				<p> This is the ShowChallenge component </p>


				{questionList === null
					? null
					: 
						<div>
							<h2>Student questions about this challenge:</h2>
							<Card.Group>
								{questionList}
							</Card.Group>
						</div>
				}

				{snippetList === null
					? null
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





// {this.state.questionIndex
// 					?
// 						<ShowRemark 
// 							elementType="challenge"
// 							user={this.props.user}
// 							remark={this.state.questions[this.state.questionIndex]}
// 						/>
// 					:
						// <div>
							// <h2>Student questions about this challenge:</h2>
							// <Card.Group>
								// {questionList}
							// </Card.Group>
						// </div>
// 				}

// 				{this.state.snippetIndex
// 					?
// 						<ShowSnippet 
// 							user={this.props.user}
// 							question={this.state.snippets[this.state.snippetIndex]}
// 						/>
// 					:
// 						<div>
// 							<h2>Student answers to this challenge:</h2>
// 							<Card.Group>
// 								{snippetList}
// 							</Card.Group>
// 						</div>
// 				}











