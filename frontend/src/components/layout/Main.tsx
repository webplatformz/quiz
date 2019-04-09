import React from 'react'
import Start from "../pages/start/Start";
import {Route, Switch} from "react-router";
import WaitingRoom from "../pages/quiz/WaitingRoom";

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Start}/>
            <Route path='/:joinId' component={WaitingRoom}/>
            <Route path='/operator/:operatorId' component={WaitingRoom}/>
            <Route path='/admin/:adminId' component={WaitingRoom}/>
        </Switch>
    </main>
);

export default Main;