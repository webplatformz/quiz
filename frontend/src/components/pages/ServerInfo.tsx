import React, {Component} from 'react'

export default class ServerInfo extends Component<any, any> {
    render() {
        return (
            <div>
                <div>
                    {this.props.info}
                </div>
            </div>
        )
    }
}