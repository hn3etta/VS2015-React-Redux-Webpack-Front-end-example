import React, {Component} from 'react';
import {Link} from 'react-router';

import ReactLogo from '../../images/react.png';
import ReduxLogo from '../../images/redux.png';
import ReactRouterLogo from '../../images/react-router.png';
import WebpackLogo from '../../images/webpack.png';
import '../../styles/objects/pages/object.home-page.scss';
import '../../styles/components/pages/component.home-page.scss';

class HomePage extends Component {
	render() {
		return (
			<div className="home-page">
				<h1 className="home-page__title">
					Visual Studio 2015 React Redux Webpack Front-end example
				</h1>
				<h2 className="home-page__sub-title">
					This example was mostly built following Cory House&apos;s excellent Pluralsight course <br/>
					<a href="https://www.pluralsight.com/courses/react-redux-react-router-es6" target="_blank" rel="noopener noreferrer">&ldquo;Building Applications with React and Redux in ES6&rdquo;</a>
					<br/>
					I modified things here and there to fit into Visual Studio 2015 (update 3) and to prove out multiple other technologies.
				</h2>
				<div className="home-page__icon-content-cntr">
					<div className="home-page__icon-cntr">
						<img className="home-page__icon" src={ReactLogo}/>
					</div>
					<div className="home-page__content-cntr">
						<h3 className="home-page__icon-title react">
							React
						</h3>
						<p className="home-page__desc">
							is an open-source JavaScript library providing a view for data rendered as HTML.
							React views are typically rendered using components that contain additional components specified as custom HTML tags.
							React promises programmers a model in which subcomponents cannot directly affect enclosing components (&ldquo;data flows down&rdquo;);
							efficient updating of the HTML document when data changes; and a clean separation between components on a modern single-page application.
						</p>
						<Link to="react" className="home-page__btn">Learn More</Link>
					</div>
				</div>
				<div className="home-page__icon-content-cntr">
					<div className="home-page__icon-cntr">
						<img className="home-page__icon" src={ReduxLogo}/>
					</div>
					<div className="home-page__content-cntr">
						<h3 className="home-page__icon-title redux">
							Redux
						</h3>
						<p className="home-page__desc">
							Redux is a predictable state container for JavaScript apps.
							It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test.
							On top of that, it provides a great developer experience, such as live code editing combined with a time traveling debug&apos;n.
						</p>
						<Link to="redux" className="home-page__btn">Learn More</Link>
					</div>
				</div>
				<div className="home-page__icon-content-cntr">
					<div className="home-page__icon-cntr">
						<img className="home-page__icon" src={ReactRouterLogo}/>
					</div>
					<div className="home-page__content-cntr">
						<h3 className="home-page__icon-title react-router">
							React Router
						</h3>
						<p className="home-page__desc">
							React Router keeps your UI in sync with the URL.
							It has a simple API with powerful features like lazy code loading, dynamic route matching, and location transition handling built right in.
							Make the URL your first thought, not an after-thought.
						</p>
						<Link to="react-router" className="home-page__btn">Learn More</Link>
					</div>
				</div>
				<div className="home-page__icon-content-cntr">
					<div className="home-page__icon-cntr">
						<img className="home-page__icon" src={WebpackLogo}/>
					</div>
					<div className="home-page__content-cntr">
						<h3 className="home-page__icon-title react-router">
							Webpack
						</h3>
						<p className="home-page__desc">
							is a module bundler.  Webpack takes modules with dependencies and generates static assets representing those modules.
							Existing module bundlers are not well suited for big projects (big single page applications).
							The most pressing reason for developing another module bundler was Code Splitting and that static assets should fit seamlessly together through modularization.
						</p>
						<Link to="webpack" className="home-page__btn">Learn More</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default HomePage;
