import React, {Component, PropTypes} from 'react';
import './cards.less';

class Cards extends Component {
    render() {
        return (
            <section className="cards-default">
                <div className="cards-hd">{this.props.title}</div>
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