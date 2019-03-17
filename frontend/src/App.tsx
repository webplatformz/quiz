import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import './components/ServerInfo'
import ServerInfo from "./components/ServerInfo";
import {gql} from "apollo-boost";
import {Query} from "react-apollo";

const INFO_QUERY = gql`
{
    info
}`;

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>

                    <Query query={INFO_QUERY}>
                        {({loading, error, data}) => {

                            if (loading) return <div>Fetching</div>;
                            if (error) return <div>Error</div>;

                            return <ServerInfo info={data.info}/>
                        }}
                    </Query>
                </header>
            </div>
        );
    }
}

export default App;
