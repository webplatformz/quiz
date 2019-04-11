import React, {Component} from 'react';
import {Player} from '../../../../../server/domain/player';
import PlayerList from './PlayerList';
import {Card, CardText, CardTitle, Spinner, Button} from "react-mdl";
import {gql} from "apollo-boost";
import {withApollo, WithApolloClient} from "react-apollo";

interface WaitingRoomProps {
    players: Player[];
    operatorId: string | undefined;
}

const LAUNCH_QUESTION_MUTATION = gql`
    mutation launchNextQuestion($operatorId: String!){
        launchNextQuestion(operatorId: $operatorId)
    }
`;

class WaitingRoom extends Component<WithApolloClient<WaitingRoomProps>, any> {

    constructor(props: WithApolloClient<WaitingRoomProps>) {
        super(props);
        this.startGame = this.startGame.bind(this);
    }


    startGame() {
        this.props.client.mutate({
            mutation: LAUNCH_QUESTION_MUTATION,
            variables: {
                operatorId: this.props.operatorId
            }
        });
    }

    render() {
        let startButton;
        if(this.props.operatorId) {
            startButton = (
                <Button raised ripple colored
                        onClick={this.startGame}
                        style={{position: "absolute", right: 0, marginRight: '25px'}}>
                    Start Game
                </Button>
            );
        }
        return (
            <Card shadow={3} style={{width: '500px', margin: 'auto', padding: '10px'}}>
                <CardTitle style={{textAlign: "center"}}>
                    <h4 style={{margin: 0}}>Players</h4> {startButton}
                </CardTitle>
                <CardText style={{paddingTop: 0, paddingBottom: 0}}>
                    <PlayerList players={this.props.players}/>
                    <div style={{marginBottom: '16px'}}>
                        <Spinner style={{margin: "auto",}}/>
                    </div>
                </CardText>
            </Card>
        );
    }
}

export default withApollo(WaitingRoom);