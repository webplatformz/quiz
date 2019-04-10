import React from 'react'
import {Route, Switch} from "react-router";
import PlayerList from "../pages/quiz/PlayerList";
import QuizContainer from "../pages/quiz/QuizContainer";

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={QuizContainer}/>
            <Route path='/operator/:operatorId' component={QuizContainer}/>
            <Route path='/createquiz/:quizId' component={PlayerList}/>
        </Switch>
    </main>
);

export default Main;