import React, {Component} from 'react'
import {Button, Card, Textfield} from 'react-mdl';
import {gql} from "apollo-boost";
import {withApollo} from "react-apollo";
import {withRouter} from "react-router";
import {QuestionInput} from "../../../../../server/domain/question-input";
import {AnswerInput} from "../../../../../server/domain/answer-input";
import {QuizInput} from "../../../../../server/domain/quiz-input";

const UPDATE_QUIZ_MUTATION = gql`
    mutation updateQuiz($quizInput: QuizInput!){
        updateQuiz(input: $quizInput) {
            name
            operatorId
        }
    }
`;

const START_QUIZ = gql`
    mutation joinAsOperator($operatorId: String!){
        joinAsOperator(operatorId: $operatorId) {
            operatorId
            joinId
        }
    }
`;

class AdminContainer extends Component<any, any> {
    state = {
        quizState: 'Quiz not created yet',
        quizId: '-',
        quizName: '-',
        joinId: '-',
        operatorId: '-',
        questions: [{
            question: '',
            answers: [{
                answer: '',
                isCorrect: true
            }, {
                answer: '',
                isCorrect: false
            }]
        }],
        quizReadyToJoin: false
    };

    constructor(props: any) {
        super(props);
        this.joinAsOperator = this.joinAsOperator.bind(this);
        this.submitQuestions = this.submitQuestions.bind(this);
    }

    componentDidMount(): void {
        const quizId = this.props.match.params.quizId;
        if (quizId) {
            this.setState({...this.state, quizId: quizId});
        }
    }

    submitQuestions() {
        const questions: QuestionInput[] = [...this.state.questions].map(question => {
            return {
                question: question.question,
                answers: this.getShuffledAnswers(question.answers)
            }
        });

        const quizInput: QuizInput = {
            id: this.state.quizId,
            name: 'Dummy quiz',
            questions: questions
        };

        this.props.client.mutate({
            mutation: UPDATE_QUIZ_MUTATION,
            variables: {
                quizInput: quizInput
            }
        }).then((response: any) => {
            this.setState({
                ...this.state,
                quizState: "Quiz updated",
                operatorId: response.data.updateQuiz.operatorId,
                quizName: response.data.updateQuiz.name
            });
            return this.startQuiz(response.data.updateQuiz.operatorId);
        });
    }

    joinAsOperator() {
        this.props.history.push(`/operator/${this.state.operatorId}`);
    }

    addQuestionField() {
        this.setState({
            ...this.state,
            questions: [...this.state.questions, {
                question: '',
                answers: [{
                    answer: '',
                    isCorrect: true
                }, {
                    answer: '',
                    isCorrect: false
                }]
            }]
        });
    }

    handleQuestionChange(questionIndex: number, target: any) {
        const value = target.value;

        let questions = [...this.state.questions];
        if (!value && questionIndex > 0) {
            questions.splice(questionIndex, 1);
        } else {
            questions[questionIndex] = {
                question: value,
                answers: (questions[questionIndex] || {}).answers || []
            };
        }

        target.value = '';

        this.setState({
            ...this.state,
            questions: questions
        });
    }

    addAnswerField(questionIndex: number) {
        let questions = [...this.state.questions];
        let answers = [...questions[questionIndex].answers];
        answers.push({
            answer: '',
            isCorrect: false
        });

        questions[questionIndex] = {
            question: questions[questionIndex].question,
            answers: answers
        };

        this.setState({
            ...this.state,
            questions: questions
        });
    }

    handleAnswerChange(questionIndex: number, answerIndex: number, target: any) {
        const value = target.value;

        let questions = [...this.state.questions];
        let answers = [...questions[questionIndex].answers];

        if (!value && answerIndex > 0) {
            answers.splice(answerIndex, 1);
        } else {
            answers[answerIndex] = {
                answer: value,
                isCorrect: answerIndex === 0
            };
        }

        questions[questionIndex] = {
            question: questions[questionIndex].question,
            answers: answers
        };

        target.value = '';

        this.setState({
            ...this.state,
            questions: questions
        });
    }

    render() {
        let content = <div/>;
        if (this.state.quizReadyToJoin) {
            content = <div>
                <p>
                    State: {this.state.quizState} <br/>
                    QuizId: {this.state.quizId} <br/>
                    Name: {this.state.quizName} <br/>
                    OperatorId: {this.state.operatorId}<br/>
                    JoinId: {this.state.joinId} <br/>
                </p>
                <Button raised ripple colored style={{marginTop: '8px', marginBottom: '10px'}}
                        onClick={this.joinAsOperator}>Join as operator</Button>
            </div>
        }

        return (
            <div style={{display: 'flex', maxWidth: '600px', margin: 'auto', padding: '16px'}}>
                <Card shadow={3} style={{flex: '1', padding: '16px'}}>
                    <h4 style={{marginTop: 0}}>Create Quiz</h4>
                    <div>
                        {
                            this.state.questions.map((question, questionIndex) => {
                                return <div key={questionIndex}>
                                    <Textfield
                                        onChange={e => this.handleQuestionChange(questionIndex, e.target)}
                                        value={question.question}
                                        label={`Question ${questionIndex + 1}`}
                                        floatingLabel/>
                                    {
                                        question.answers.map((answer, answerIndex) => {
                                            return <div key={10 * questionIndex + answerIndex}>
                                                <Textfield
                                                    onChange={e => this.handleAnswerChange(questionIndex, answerIndex, e.target)}
                                                    value={answer.answer}
                                                    label={`Question ${questionIndex + 1} - Answer ${answerIndex + 1}`}
                                                    floatingLabel/>
                                            </div>
                                        })
                                    }
                                    <div>
                                        <Button raised ripple style={{marginTop: '8px', marginBottom: '10px'}}
                                                onClick={() => this.addAnswerField(questionIndex)}>Add answer
                                            field</Button>
                                    </div>
                                </div>
                            })
                        }
                        <div>
                            <Button raised ripple style={{marginTop: '8px', marginBottom: '10px'}}
                                    onClick={() => this.addQuestionField()}>Add question field</Button>
                        </div>
                    </div>
                    <div>
                        <Button raised ripple colored style={{marginTop: '8px', marginBottom: '10px'}}
                                onClick={this.submitQuestions}>Submit questions</Button>
                    </div>
                    {content}
                </Card>
            </div>
        )
    }

    private startQuiz(operatorId: string) {
        this.props.client.mutate({
            mutation: START_QUIZ,
            variables: {
                operatorId: operatorId
            }
        }).then((response: any) => this.setState({
            ...this.state,
            quizState: "Quiz started",
            quizReadyToJoin: true,
            joinId: response.data.joinAsOperator.joinId,
        }));
    }

    private getShuffledAnswers(answers: AnswerInput[]): AnswerInput[] {
        const answerCopy = [...answers];
        let shuffledAnswers: AnswerInput[] = [];
        while (answerCopy.length > 0) {
            const randomIndex = Math.round(Math.random() * (answerCopy.length - 1));
            shuffledAnswers.push(answerCopy.splice(randomIndex, 1)[0]);
        }
        return shuffledAnswers;
    }
}

export default withRouter(withApollo(AdminContainer));