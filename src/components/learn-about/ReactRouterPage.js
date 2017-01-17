import React, {Component} from 'react';

import '../../styles/objects/common/object.card-block.scss';
import '../../styles/components/common/component.card-block.scss';
import '../../styles/objects/pages/object.react-router-page.scss';
import '../../styles/components/pages/component.react-router-page.scss';

class ReactRouterPage extends Component {
	render() {
		return (
			<div className="react-router-page">
				<h1 className="react-router-page__title">
					React Router
				</h1>
				<p className="react-router-page__subtitle">
					React Router is a powerful routing library built on top of React that helps you add new screens and flows to your application incredibly quickly, all while keeping the URL in sync with what&apos;s being displayed on the page.
				</p>
				<div className="react-router-page__card-block-cntr">
					<div className="card-block">
						<h3 className="card-block__title">
							Route Configuration
							<br/><br/>
						</h3>
						<p className="card-block__desc">
							A route configuration is basically a set of instructions that tell a router how to try to match the URL and what code to run when it does.
							To illustrate some of the features available in your route config, let&apos;s expand on the simple app from the introduction.
						</p>
					</div>
					<div className="card-block">
						<h3 className="card-block__title">
							Route Matching
							<br/><br/>
						</h3>
						<p className="card-block__desc">
							A route has three attributes that determine whether or not it &quot;matches&quot; the URL:
						</p>
						<ol className="card-block__order-list">
							<li>
								Nesting and
							</li>
							<li>
								its path
							</li>
							<li>
								its precedence
							</li>
						</ol>
					</div>
					<div className="card-block">
						<h3 className="card-block__title">
							Histories
						</h3>
						<p className="card-block__desc">
							React Router is built with history.
							In a nutshell, a history knows how to listen to the browser&apos;s address bar for changes and parses the URL into a location object that the router can use to match routes and render the correct set of components.
							<br/><br/>
							There are three types of histories you&apos;ll come across most often, but note that anyone can build a custom history implementation for consumption with React Router.
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default ReactRouterPage;
