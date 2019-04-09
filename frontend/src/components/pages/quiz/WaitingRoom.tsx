import React, {Component} from 'react'
import {gql} from "apollo-boost";
//import {Player} from "../../../../../server/domain/quiz-start";
import {graphql} from "react-apollo";

const PLAYER_JOIN_SUBSCRIPTION = gql`
    subscription {
        onTest 
    }
`;

class WaitingRoom extends Component<any, any> {
    componentWillReceiveProps(data: any) {
        console.log(data)
    }

    render() {
        return (
            <div>
                Waiting...
            </div>
        )
    }
}

export default graphql(PLAYER_JOIN_SUBSCRIPTION)(WaitingRoom);