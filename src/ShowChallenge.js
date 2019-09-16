import React from 'react';
import { Container, Card, Checkbox, Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';

// import ChallengeSummary from './ChallengeSummary'
// import AddChallenge from './AddChallenge'

// use the API url from environment if it exists
const API_URL = process.env.REACT_APP_API_URL || ''; 


class ShowChallenge extends React.Component {
	// props: challenge (challenge info)
	constructor() {
		super();

		this.state = {
			index: null,
			snippets: [],
		}
	}

	// retrieve all existing snippets for this challenge
	componentDidMount = async () => {

		console.log("inside componentDidMount in ShowChallenge");

		console.log("------> Here is the challege to be shown:");
		console.log(this.props.challenge);
   }

   render() {

		return (

			<div>

				<p> This is the ShowChallenge component </p>
				
			</div>
		)

	}
}

export default ShowChallenge;
