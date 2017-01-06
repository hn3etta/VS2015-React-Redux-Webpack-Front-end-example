import { Link, IndexLink } from 'react-router';

/* Use "require" for non ES6 Modules */
let React = require('react');
let PropTypes = React.PropTypes;


import SystemErrorContainer from '../../containers/SystemErrorContainer';

// SCSS
import '../../styles/objects/object.header.scss';
import '../../styles/components/component.header.scss';

// Destructure props being passed in (limits scope)
// --> for "loading" if condition in a very short hand pattern.  If loading true then && condition is executed
// --> not really a big fan of this syntax but wrapping an IIFE to do an 'if' statement seems even more complicated to read
const Header = ({loading, isAuthd}) => {
    return (
        <section className="header">
            <div className="auth-bar">
                {!isAuthd &&
                    <Link to="/login" className="auth-link" activeClassName="auth-link--active">
                        Login
                    </Link>
                }
                {isAuthd &&
                    <Link to="/logoff" className="auth-link" activeClassName="auth-link--active">
                        Logoff
                    </Link>
                }
            </div>
            <div className="nav-cntr">
                <nav className="main-nav">
                    <IndexLink to="/" className="nav-link" activeClassName="nav-link--active">
                        Home
                    </IndexLink>
                    {isAuthd &&
                        <Link to="/courses" className="nav-link" activeClassName="nav-link--active">
                            Courses
                        </Link>
                    }
                    {isAuthd &&
                        <Link to="/open-courses" className="nav-link" activeClassName="nav-link--active">
                            Open Courses
                        </Link>
                    }
                    {loading &&
                        <div className={isAuthd ? "busyNavLoader--authd" : "busyNavLoader"} />
                    }
                </nav>
                <nav className="about-nav">
                    <Link to="/react" className="nav-link" activeClassName="nav-link--active">
                        React
                    </Link>
                    <Link to="/redux" className="nav-link" activeClassName="nav-link--active">
                        Redux
                    </Link>
                    <Link to="/react-router" className="nav-link" activeClassName="nav-link--active">
                        React Router
                    </Link>
                    <Link to="/webpack" className="nav-link" activeClassName="nav-link--active">
                        Webpack
                    </Link>
                </nav>
            </div>
            <SystemErrorContainer />
        </section>
    );
};

Header.propTypes = {
    loading: PropTypes.bool.isRequired,
    isAuthd: PropTypes.bool
};

export default Header;