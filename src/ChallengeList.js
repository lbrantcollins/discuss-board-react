import React from 'react';
import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

import ChallengeSummary from './ChallengeSummary'
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
			challenges: []
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

   // showEditChallenge = (challengeToBeEdited) => {
   //    this.setState({
   //       challengeToBeEdited: challengeToBeEdited,
   //       editChallenge: true
   //    })
      
   // }

   showChallenge = (i) => {
   	this.setState({
   		index: i,
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

				{this.state.index || this.state.index === 0
					?
						<ShowChallenge 
							user={this.props.user}
							challenge={this.state.challenges[this.state.index]}
						/>
					:
						<Card.Group>
							{challengeList}
						</Card.Group>
				}
				
			</div>
		)

	}
}

export default ChallengeList;




 
 

