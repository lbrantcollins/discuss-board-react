import React from 'react';
import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

import ChallengeSummary from './ChallengeSummary'

const ChallengeList = (props) => {

	const challengeList = props.challenges.map( challenge => {
		return (

			<ChallengeSummary 
				key={challenge.id} 
				challenge={challenge} 
				editChallenge={props.editChallenge}
			/>
		)
	})

	return(

		<Card.Group>
			{challengeList}
		</Card.Group>
	)
}

export default ChallengeList;