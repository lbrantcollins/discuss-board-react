import React from 'react';
import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 

// import ChallengeSummary from './ChallengeSummary'
// import AddChallenge from './AddChallenge'

class ChallengeList extends React.Component {
	constructor() {
		super();

		this.state = {
			index: null,
			challenges: []
		}
	}

	render() {

		return (

			<div>

			<p> This is the ChallengeList component. </p>
			
			</div>
		)

	}
}

export default ChallengeList;

// <h1>Current Challenges</h1>

			// {props.is_teacher 
			// 	?
			// 		<Button
			// 			content="Add Challenge"
			// 			onClick={props.showAddChallenge}
			// 		/>
			// 	:
			// 		null
			// }

			// <Card.Group>
			// 	{challengeList}
			// </Card.Group>


	// props: userId, is_teacher, challenges (incl keywords, langs, snippet_ids)
	//        addChallenge (function), editChallenge (function)

	// componentDidMount = async () => {

 //      // retrieve all existing challenges
 //      const response = await fetch(API_URL + '/challenges', {
 //            method: 'GET',
 //            headers: {'Content-Type': 'application/json'},
 //            credentials: 'include',
 //         })
 //         const challenges = await response.json();

 //         this.setState({
 //            challenges: challenges
 //         })

 //   }
 
 // 	const challengeList = props.challenges.map( (challenge, i) => {

	// 	return (

	// 		<ChallengeSummary 
	// 			key={i} 
	// 			is_teacher={props.is_teacher}
	// 			challenge={challenge} 
	// 			showEditChallenge={props.showEditChallenge.bind(null, challenge.id)}
	// 			showSnippets={props.showSnippets}
	// 			// onClick={() => this.showChallenge(i) } // added by Reuben as a brainstorming idea
	// 		/>
	// 	)
	// })

