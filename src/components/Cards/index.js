import React, {Component, PropTypes} from 'react';
import './cards.less';

class Cards extends Component {
    render() {
        const {
            title
        } = this.props
        return (
            <section className="cards-default">
                { title ?<div className="cards-hd">{title}</div> : '' }
                <div className="cards-bd">
                    {this.props.children}
                </div>
            </section>
        );
    }
}

Cards.propTypes = {

};

export default Cards;