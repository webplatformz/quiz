import React, {Component} from 'react'
import Create from "./Create";
import Join from "./Join";

export default class Start extends Component<any, any> {
    render() {
        return (
            <div>
                <Create />
                <Join />
            </div>
        )
    }
}