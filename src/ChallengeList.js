import React from 'react';
import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

import ChallengeSummary from './ChallengeSummary'
import AddChallenge from './AddChallenge'

const ChallengeList = (props) => {
	// props: userId, is_teacher, challenges (incl keywords, langs, snippet_ids)
	//        addChallenge (function), editChallenge (function)
 
 	const challengeList = props.challenges.map( (challenge, i) => {

		return (

			<ChallengeSummary 
				key={i} 
				is_teacher={props.is_teacher}
				challenge={challenge} 
				showEditChallenge={props.showEditChallenge.bind(null, challenge.id)}
				showSnippets={props.showSnippets}
				// onClick={() => this.showChallenge(i) } // added by Reuben as a brainstorming idea
			/>
		)
	})

	return(

		<div>

		<h1>Current Challenges</h1>

			{props.is_teacher 
				?
					<Button
						content="Add Challenge"
						onClick={props.showAddChallenge}
					/>
				:
					null
			}

			<Card.Group>
				{challengeList}
			</Card.Group>

		</div>
	)
}

export default ChallengeList;