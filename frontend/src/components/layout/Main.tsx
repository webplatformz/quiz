import React from 'react'
import {Query} from "react-apollo";
import {gql} from "apollo-boost";
import ServerInfo from "../pages/ServerInfo";

const INFO_QUERY = gql`
{
    info
}`;

const Main = () => (
    <main>
        <Query query={INFO_QUERY}>
            {({loading, error, data}) => {

                if (loading) return <div>Fetching</div>;
                if (error) return <div>Error</div>;


                return <ServerInfo info={data.info}/>
            }}
        </Query>
    </main>
);

export default Main;