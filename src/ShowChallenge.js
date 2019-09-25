import React from 'react';
import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

import EditChallenge from './EditChallenge'
import AddRemark from './AddRemark';
import ShowRemark from './ShowRemark'
import AddSnippet from './AddSnippet'
import ShowSnippet from './ShowSnippet'

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class ShowChallenge extends React.Component {
	// props: user (user info), challenge (challenge info)
	// 		 updateChallengeForShowChallenge (function)
	//        returnToChallengeList (function)
	constructor() {
		super();

		this.state = {
			questions: [],
			index: null,
			snippets: [],
			editChallenge: false,
			addSnippet: false,
			turnOffAddSnippetButton: false,
			loaded: false,
		}
	}

	// retrieve all existing questions and snippets for this challenge
	componentDidMount = async () => {

		this.setState({
			turnOffAddSnippetButton: false,
		})

		try {

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
	      	...this.state,
	         questions: parsedResponse1.questions,
	         snippets: parsedResponse2.snippets,
	         loaded: true,
	      })

	   } catch(err) {
	   	console.log(err);
	   }
   }

   showSnippet = (i) => {
   	this.setState({
   		index: i,
   	})
   }

    editChallenge = () => {
   	this.setState({
   		editChallenge: true,
   	})
   }

   returnToShowChallenge = () => {
  		this.setState({
   		editChallenge: false,
   	})
   	this.props.updateChallengeForShowChallenge();
   }

  handleSubmitReturnToChallengeList = (e) => {
   	e.preventDefault();

   	this.props.returnToChallengeList();
   }

  	toggleAddSnippet = async () => {
  		this.setState({
   		addSnippet: !this.state.addSnippet,
   	})
   	// Need to re-render the snippets
   	this.componentDidMount();
   }

   // turnOffAddSnippetButton = () => {
   // 	this.setState({
   // 		turnOffAddSnippetButton: true,
   // 	})
   // }

   returnToShowChallengePage = () => {
   	// re-initialize state and re-mount component
   	this.setState({
   		questions: [],
			index: null,
			snippets: [],
			editChallenge: false,
			addSnippet: false,
			turnOffAddSnippetButton: false,
			loaded: false,
   	})
   	this.componentDidMount();
   }

   render() {

   	let questionList = null;
   	let snippetList = null;

   	if (this.state.loaded) {

   		if (!this.state.editChallenge) {

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

					snippetList = this.state.snippets.map( (snippet, i) => {

						return (

							<Card key={i}>
								<Card.Content>

									<Card.Header> Student answer: </Card.Header>

									<Card.Meta>	
										Language: {snippet.language.language}
									</Card.Meta>

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

		}

		return (

			<div>

				{this.state.editChallenge
					?
					 	<EditChallenge 
					 		challenge={this.props.challenge}
					 		returnToShowChallenge={this.returnToShowChallenge}
				 		/>
					:
						<div>

							<div>
								<Button 
				               content="Return to Challenge List"
				               onClick={this.handleSubmitReturnToChallengeList}
				            />
				            <br/>
				            <br/>
			            </div>

							<div>
								<Card>
									<Card.Content>
										<Card.Header> {this.props.challenge.title} </Card.Header>
										<Card.Description> {this.props.challenge.description} </Card.Description>
										<Card.Meta>	
											{this.props.user.is_teacher
												?
													<Button 
														content="Edit"
														onClick={this.editChallenge}
													/> 
												:
													null


											}
										</Card.Meta>				
									</Card.Content>
								</Card>
							</div>

							<div>

								{this.state.index || this.state.index === 0
									?
										<ShowSnippet 
											user={this.props.user}
											snippet={this.state.snippets[this.state.index]}
											returnToShowChallengePage={this.returnToShowChallengePage}
										/>
									:

										<div>

											<div>

												{this.props.user.is_teacher
													? null
													:
														<div>
															<br/>
															<Button 
																content="Contribute an Answer"
																onClick={this.toggleAddSnippet}
															/> 
															<br/>
															<br/>
														</div>
												}

												{this.state.addSnippet
													?
														<Card>
                     								<Card.Content>
																<AddSnippet 
																	challenge={this.props.challenge}
																	student_id={this.props.user.id}
																	toggleAddSnippet={this.toggleAddSnippet}
																/>
															</Card.Content>
														</Card>
													:
														null
												}

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
							 							<Card.Group>
							 								{snippetList}
							 							</Card.Group>
							 						</div>
											}
										</div>
								}

							</div>
										
						</div>
				}
								
			</div>
		)

	}
}

export default ShowChallenge;

