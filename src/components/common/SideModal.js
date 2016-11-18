import '../../styles/objects/common/object.side-modal.scss';
import '../../styles/components/common/component.side-modal.scss';

/* Use "require" for non ES6 Modules */
let React = require('react');
let ReactDOM = require('react-dom');
let PropTypes = React.PropTypes;
let TweenLite = require('gsap').TweenLite;

class SideModal extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    /* React lifecycle function - exeuctes when props or state changes detected.  Here you can determine if the component needs to re-render or not */
    shouldComponentUpdate(nextProps) {
        if (nextProps.isOpen != this.props.isOpen) {
            return true;
        }

        return false;
    }

    componentDidUpdate() {      
        let sideModalCntr = ReactDOM.findDOMNode(this.refs.sideModalCntr);

        // Animate modal displa
        if (this.props.isOpen) {
            // slide in from the left and fade in
            TweenLite.fromTo(sideModalCntr, 0.5, { x: -1000, opacity: 0, zIndex: 0 }, { x: 0, opacity: 1, zIndex: 1 });
        } else {
            TweenLite.fromTo(sideModalCntr, 0.5, { x: 0, opacity: 1, zIndex: 1 }, { x: -1000, opacity: 0, zIndex: 0 });
        }
    }

    render() {
        return (
            <div ref="sideModalCntr" className="side-modal">
                {this.props.children}
            </div>
        );
    }
}

SideModal.propTypes = {
    children: PropTypes.node,
    isOpen: PropTypes.bool.isRequired
};


export default SideModal;