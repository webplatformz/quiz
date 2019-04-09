import React, {Component} from 'react'
import {gql} from "apollo-boost";
import {Subscription, withApollo} from "react-apollo";

const PLAYER_JOIN_SUBSCRIPTION = gql`
    subscription onPlayerJoined($joinId: String!){
        onPlayerJoined(joinId: $joinId) {
          players {name}
        }
    }
`;

class WaitingRoom extends Component<any, any> {

    render() {
        return <Subscription
            subscription={PLAYER_JOIN_SUBSCRIPTION}
            variables={{
                joinId: this.props.match.params.joinId
            }}>
                {(result: any) => {
                    if(result.loading) {
                        return <p>Waiting ...</p>
                    }
                    const players = result.data.onPlayerJoined.players.map((player: any) => <li>{player.name}</li>);
                    return <ul>{players}</ul>
                }}
        </Subscription>
    }
}

export default withApollo(WaitingRoom);