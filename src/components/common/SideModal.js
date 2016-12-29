import '../../styles/objects/common/object.side-modal.scss';
import '../../styles/components/common/component.side-modal.scss';

/* Use "require" for non ES6 Modules */
let React = require('react');
let ReactDOM = require('react-dom');
let PropTypes = React.PropTypes;
let TweenLite = require('gsap').TweenLite;
let TimelineLite = require('gsap').TimelineLite;

class SideModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.animMngrObj = {};
    }

    componentDidMount() {
        let sideModalElm = ReactDOM.findDOMNode(this.refs.sideModalCntr);

        this.animMngrObj = this.loadGSTimeline(TimelineLite, TweenLite, this.props.location, sideModalElm);

        this.determineModalDisplay(this.props.isOpen, this.animMngrObj);
    }

    /* React lifecycle function - exeuctes when props or state changes detected.  Here you can determine if the component needs to re-render or not */
    shouldComponentUpdate(nextProps) {
        if (nextProps.isOpen != this.props.isOpen) {
            return true;
        }

        return false;
    }

    componentDidUpdate() {      
        let sideModalElm = ReactDOM.findDOMNode(this.refs.sideModalCntr);

        this.determineModalDisplay(this.props.isOpen, this.animMngrObj);
    }

    loadGSTimeline(TimelineLite, TweenLite, location, animElement) {
        const loc = location ? location : "left";

        let animMngr = { tl: new TimelineLite() };

        switch (loc) {
            case "left":
                animMngr.tl.add(TweenLite.from(animElement, 0.5, { x: -500, opacity: 0, zIndex: 0 }));
                animMngr.tl.add(TweenLite.to(animElement, 0.5, { x: 0, opacity: 1, delay: 0.20 }));
                animMngr.tl.add(TweenLite.to(animElement, 0.5, { zIndex: 1, delay: 0.30 }));
                break;
            case "right":
                animMngr.tl.add(TweenLite.from(animElement, 0.5, { x: 300, opacity: 0, zIndex: 0 }));
                animMngr.tl.add(TweenLite.to(animElement, 0.5, { x: 0, opacity: 1, delay: 0.20 }));
                animMngr.tl.add(TweenLite.to(animElement, 0.5, { zIndex: 1, delay: 0.30 }));
                break;
        }

        return animMngr;
    }

    determineModalDisplay(isOpen, animMngrObj) {
        if (isOpen) {
            animMngrObj.tl.play();            
        } else {
            animMngrObj.tl.reverse();
        }
    }

    render() {
        return (
            <div ref="sideModalCntr" className={this.props.cssClassName}>
                {this.props.children}
            </div>
        );
    }
}

SideModal.propTypes = {
    children: PropTypes.node,
    cssClassName: PropTypes.string.isRequired,
    location: PropTypes.string,
    isOpen: PropTypes.bool.isRequired
};


export default SideModal;