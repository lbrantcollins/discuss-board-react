import React from 'react';
import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

import EditChallenge from './EditChallenge';

const ChallengeSummary = (props) => {

	// include a link to this.props.editChallenge (if user is a teacher)

	console.log("props.is_teacher\n", props.is_teacher);

	return(

		<Card>
			<Card.Content>
				<Card.Header>Title: {props.challenge.title}</Card.Header>
				<Card.Description>{props.challenge.description}</Card.Description>
				{props.is_teacher
					?
						<Button 
							content="Edit"
							onClick={props.showEditChallenge}					
						/>
						
					: null
				}
			</Card.Content>
		</Card>
	)
}

export default ChallengeSummary;

// {(props.comment.user_id.id === props.userId) && (props.loggedIn)
					// ?
						// <Button onClick={props.deleteComment.bind(null, props.comment.id)}>
							// Delete
						// </Button>
					// : null
				// }	


				// onClick=	{
				// 							<EditChallenge 
				// 								challenge_id={props.challenge.id}
				// 								editChallenge={props.editChallenge}
				// 							/>
				// 						}