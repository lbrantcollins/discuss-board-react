import React from 'react';
import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

import AddRemark from './AddRemark';
import ShowRemark from './ShowRemark'
import ShowSnippet from './ShowSnippet'

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class ShowChallenge extends React.Component {
	// props: user (user info), challenge (challenge info)
	constructor() {
		super();

		this.state = {
			questions: [],
			index: null,
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

   showSnippet = (i) => {
   	this.setState({
   		index: i,
   	})
   }

   render() {

   	let questionList = null;
   	let snippetList = null;

   	if (this.state.loaded) {

   		let questionList = null;

	      // Show the list of student questions (and accompanying teacher responses)
	      // each of which is a "ShowRemark" generated here by a map method on all questions

	      if (this.state.questions) {

	         // for each question, create an entry to render (with it's teacher response)
	         questionList = this.state.questions.map( (question, i) => {

	            return (

	               <Card key={i}>
	                  <ShowRemark className="student-remark"
	                     user={this.props.user}
	                     remark={question}
	                     userType="student"
	                     elementType="challenge"
	                  />

	                  {question.response
	                     ?
	                        <div>
	                           <ShowRemark className="teacher-remark"
	                              user={this.props.user}
	                              remark={question}
	                              userType="teacher"
	                              elementType="question"
	                           />
	                        </div>
	                     : 
	                        <div>
	                           {this.props.user.is_teacher
	                              ?
	                                 <div>
	                                    <AddRemark 
	                                       user={this.props.user}
	                                       remark={question}
	                                       elementType="question"
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

								<Card.Description> 
									<pre><code> {snippet.snippet}</code></pre>
								</Card.Description>

								<Card.Meta>	
									<Button 
										content="View Student Comments"
										onClick={() => this.showSnippet(i)}
									/> 
								</Card.Meta>	

							</Card.Content>
						</Card>
						
					)
				})

			}

		}

		return (

			<div>

				<h2> The Challenge: </h2>

				<div>
					<Card>
						<Card.Content>
							<Card.Header> {this.props.challenge.title} </Card.Header>
							<Card.Description> {this.props.challenge.description} </Card.Description>
							<Card.Meta>	
								{this.props.user.is_teacher
									?
										<Button 
											size="mini" 
											onClick={this.editChallenge}
										> 
											Edit 
										</Button>
									:
										null
								}
							</Card.Meta>				
						</Card.Content>
					</Card>
				</div>


				{questionList === null
					? null
					: 
						<div>
							<Card.Group>
								{questionList}
							</Card.Group>
						</div>
				}

				{snippetList === null
					? null
 					: 
 						<div>
	 					   {this.state.index || this.state.index === 0
								?
									<ShowSnippet 
										user={this.props.user}
										snippet={this.state.snippets[this.state.index]}
									/>
								:
									<div>
			 							<Card.Group>
			 								{snippetList}
			 							</Card.Group>
			 						</div>
							}
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

// 				{this.state.index
// 					?
// 						<ShowSnippet 
// 							user={this.props.user}
// 							question={this.state.snippets[this.state.index]}
// 						/>
// 					:
// 						<div>
// 							<h2>Student answers to this challenge:</h2>
// 							<Card.Group>
// 								{snippetList}
// 							</Card.Group>
// 						</div>
// 				}











