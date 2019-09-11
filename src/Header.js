import React from 'react';
import { Menu, Icon, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
// import './style.css'

class Header extends React.Component {

	constructor(){
		super()

		this.state = {
			activeItem: 'show-challenges'
		}
	}

	handleItemClick = (e, { name }) => {

		console.log(name);

		this.setState({ activeItem: name })

	}

	render(){
		return(

				<Menu className='nav'>

					<Menu.Item
						className='Link'
						name='show-challenges'
            		active={this.state.activeItem === 'show-challenges'}
            		onClick={this.handleItemClick}>
            		Challenges
					</Menu.Item>

					
							<Menu.Item
								className='Link'
								name='my-media'
				            active={this.state.activeItem === 'myMedia'}
				            onClick={this.handleItemClick}>
							</Menu.Item>
							<Menu.Item
								className='Link'
								name='my-favorites'
				            active={this.state.activeItem === 'myFavorites'}
				            onClick={this.handleItemClick}>
							</Menu.Item>
					
							<Menu.Item
								className='Link'
								name='login'
				            active={this.state.activeItem === 'login'}
				            onClick={this.handleItemClick}>
							</Menu.Item>
							<Menu.Item
								className='Link'
								name='register'
				            active={this.state.activeItem === 'register'}
				            onClick={this.handleItemClick}>
							</Menu.Item>
					
				</Menu>

		)

	}
}

export default Header