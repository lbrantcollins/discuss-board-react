import React from 'react';
import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

const ChallengeSummary = (props) => {

	// include a link to this.props.editChallenge (if user is a teacher)

	return(

		<Card>
			<Card.Content>
				<Card.Header>Title: {props.challenge.title}</Card.Header>
				<Card.Description>{props.challenge.description}</Card.Description>
				<Button 
					content="Edit" 
					onClick={this.props.editChallenge.bind(null, props.challenge.id)}
				/>
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