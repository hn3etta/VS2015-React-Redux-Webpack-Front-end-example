/* Use "require" for non ES6 Modules */
let React = require('react');

// Images
import ReduxFlowchart from '../../images/redux-flowchart.png';
import '../../styles/objects/pages/object.redux-page.scss';
import '../../styles/components/pages/component.redux-page.scss';
// Common SCSS
import '../../styles/objects/common/object.card-block.scss';
import '../../styles/components/common/component.card-block.scss';

class ReduxPage extends React.Component {
    render() {
        return (
            <div className="redux-page">
                <h1 className="redux-page__title">
                    Redux
                </h1>
                <div className="redux-page__card-block-cntr">
                    <div className="card-block">
                        <h3 className="card-block__title">
                            Single source of truth
                            <br /><br />
                        </h3>
                        <p className="card-block__desc">
                            The state of your whole application is stored in an object tree within a single store.
                            <br /><br />
                            This makes it easy to create universal apps, as the state from your server can be serialized and hydrated into the client with no extra coding effort.
                            A single state tree also makes it easier to debug or introspect an application; it also enables you to persist your app’s state in development, for a faster development cycle.
                            Some functionality which has been traditionally difficult to implement - Undo/Redo, for example - can suddenly become trivial to implement, if all of your state is stored in a single tree.
                        </p>
                    </div>
                    <div className="card-block">
                        <h3 className="card-block__title">
                            State is read-only
                            <br /><br />
                        </h3>
                        <p className="card-block__desc">
                            The only way to mutate the state is to emit an action, an object describing what happened.
                            <br /><br />
                            This ensures that neither the views nor the network callbacks will ever write directly to the state.
                            Instead, they express an intent to mutate.  Because all mutations are centralized and happen one by one in a strict order, there are no subtle race conditions to watch out for.
                            As actions are just plain objects, they can be logged, serialized, stored, and later replayed for debugging or testing purposes.
                        </p>
                    </div>
                    <div className="card-block">
                        <h3 className="card-block__title">
                            Changes are made with pure functions
                        </h3>
                        <p className="card-block__desc">
                            To specify how the state tree is transformed by actions, you write pure reducers.
                            <br /><br />
                            Reducers are just pure functions that take the previous state and an action, and return the next state.
                            Remember to return new state objects, instead of mutating the previous state.
                            You can start with a single reducer, and as your app grows, split it off into smaller reducers that manage specific parts of the state tree.
                            Because reducers are just functions, you can control the order in which they are called, pass additional data, or even make reusable reducers for common tasks such as pagination.
                        </p>
                    </div>
                </div>
                <img className="react-page__content-image" src={ReduxFlowchart} />
            </div>
        );
    }
}

export default ReduxPage;