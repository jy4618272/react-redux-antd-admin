import React, {Component, PropTypes} from 'react'

class FinanceStat extends Component {
    componentDidMount(){
        const id = parseInt(this.props.params.id)
    }

    render () {
        return (
            <div>
                333ddd
            </div>
        )
    }
}

FinanceStat.propTypes = {

}

export default FinanceStat