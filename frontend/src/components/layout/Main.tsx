import React from 'react'
import {Route, Switch} from "react-router";
import QuizContainer from "../pages/quiz/QuizContainer";
import AdminContainer from "../pages/quiz/AdminContainer";

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={QuizContainer}/>
            <Route path='/operator/:operatorId' component={QuizContainer}/>
            <Route path='/admin/:quizId' component={AdminContainer}/>
        </Switch>
    </main>
);

export default Main;