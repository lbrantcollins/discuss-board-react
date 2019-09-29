import React from 'react';
import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

// import ChallengeSummary from './ChallengeSummary'
import AddChallenge from './AddChallenge'
import ShowChallenge from './ShowChallenge'

// import AddChallenge from './AddChallenge'

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class ChallengeList extends React.Component {
	// props: user (user info)
	constructor() {
		super();

		this.state = {
			index: null,
			challenges: [],
			loaded: false,
			addChallenge: false,
		}
	}

	componentDidMount = async () => {

      // retrieve all existing challenges
      const response = await fetch(API_URL + '/challenges', {
         method: 'GET',
         headers: {'Content-Type': 'application/json'},
         credentials: 'include',
      })
      const parsedResponse = await response.json();

      this.setState({
         challenges: parsedResponse.challenges
      })

   }

   addChallenge = () => {
   	this.setState({
   		addChallenge: true,
   	})
   }

   showChallenge = (i) => {
   	this.setState({
   		index: i,
   	})
   }

   updateChallengeForShowChallenge = () => {
   	this.componentDidMount();
   }

   returnToChallengeList = () => {
   	// re-initialize state and re-mount component
   	this.setState({
   		index: null,
   		challenges:[],
   		addChallenge: false,
   	})
   	this.componentDidMount();
   }

   showAddChallenge = () => {
      this.setState({
         addChallenge: true
      })
      
   }

   

	render() {

		const challengeList = this.state.challenges.map( (challenge, i) => {

			return (

				<Card key={i}>
					<Card.Content>
						<Card.Header> {challenge.title} </Card.Header>
						<Card.Description> {challenge.description} </Card.Description>
						<Card.Meta>	
							<Button 
								content="View Details"
								size="mini" 
								onClick={() => this.showChallenge(i)}>  
							</Button>
						</Card.Meta>				
					</Card.Content>
				</Card>
				
			)
		})



		return (

			<div>

				{this.state.addChallenge
						?
							<AddChallenge 
								user={this.props.user}
								returnToChallengeList={this.returnToChallengeList}
							/>
						:
							<div>
								{this.state.index || this.state.index === 0
									?
										<ShowChallenge 
											user={this.props.user}
											challenge={this.state.challenges[this.state.index]}
											updateChallengeForShowChallenge={this.updateChallengeForShowChallenge}
											returnToChallengeList={this.returnToChallengeList}
										/>
									:
										<div>

											{this.props.user.is_teacher
												?
													<div>
														<Button className="secondary"
															content="Add a Challenge"
															onClick={this.addChallenge}
														/>
														<br/>
														<br/>
													</div>
												:
													null
											}

											<Card.Group>
												{challengeList}
											</Card.Group>

										</div>
								}
							</div>
				}
				
			</div>
		)

	}
}

export default ChallengeList;




 
 

