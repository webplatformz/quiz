import React, {Component} from 'react';
import {Answer} from '../../../../../server/domain/answer';
import {Button} from 'react-mdl';

interface AnswerComponentProps {
    answer: Answer;
    onClick: any;
    correctAnswerIds: string[],
    isSelected: boolean
}

export class AnswerComponent extends Component<AnswerComponentProps, any> {

    render() {
        return (
            <Button raised ripple style={{
                backgroundColor: this.getBackgroundColor(),
                border: this.getBorder(),
                boxSizing: 'border-box',
                fontSize: 'large',
                margin: '16px 0',
                padding: '12px 5px',
                height: 'auto',
                width: '100%',
                cursor: 'pointer'
            }}
                    onClick={this.props.onClick}>
                {this.props.answer.answer}
            </Button>
        );
    }

    private getBorder(): string {
        if (this.props.isSelected) {
            if (this.props.correctAnswerIds.length === 0 || this.isCorrectAnswer()) {
                return '3px solid #3ea026';
            }
            return '3px solid #f44336';
        }
        return 'none';
    }

    private getBackgroundColor(): string {
        if (this.isCorrectAnswer()) {
            return 'rgba(7,182,49,0.6)';
        } else {
            return 'default';
        }
    }

    private isCorrectAnswer() {
        return this.props.correctAnswerIds.some(correctAnswerId => correctAnswerId === this.props.answer.id);
    }
}