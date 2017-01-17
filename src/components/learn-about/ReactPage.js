import React, {Component} from 'react';

import ReactFlowchart from '../../images/react-flowchart.png';
import '../../styles/objects/common/object.card-block.scss';
import '../../styles/components/common/component.card-block.scss';
import '../../styles/objects/pages/object.react-page.scss';
import '../../styles/components/pages/component.react-page.scss';

class ReactPage extends Component {
	render() {
		return (
			<div className="react-page">
				<h1 className="react-page__title">
					React
				</h1>
				<div className="react-page__card-block-cntr">
					<div className="card-block">
						<h3 className="card-block__title">
							Declarative
							<br/><br/>
						</h3>
						<p className="card-block__desc">
							React makes it painless to create interactive UIs.Design simple views for each state in your application,
							and React will efficiently update and render just the right components when your data changes.
							<br/><br/>
							Declarative views make your code more predictable and easier to debug.
						</p>
					</div>
					<div className="card-block">
						<h3 className="card-block__title">
							Component-Based
							<br/><br/>
						</h3>
						<p className="card-block__desc">
							Build encapsulated components that manage their own state, then compose them to make complex UIs.
							<br/><br/>
							Since component logic is written in JavaScript instead of templates, you can easily pass rich data through your app and keep state out of the DOM.
						</p>
					</div>
					<div className="card-block">
						<h3 className="card-block__title">
							Learn Once, Write Anywhere
						</h3>
						<p className="card-block__desc">
							We don&apos;t make assumptions about the rest of your technology stack, so you can develop new features in React without rewriting existing code.
							<br/><br/>
							React can also render on the server using Node and power mobile apps using React Native.
						</p>
					</div>
				</div>
				<img className="react-page__content-image" src={ReactFlowchart}/>
			</div>
		);
	}
}

export default ReactPage;
