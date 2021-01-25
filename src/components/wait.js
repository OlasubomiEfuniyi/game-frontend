import React from "react";

class Wait extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="wait-container">
                <div id="waiting-player-list-container">
                    <ul>
                        {this.props.waitlist.map((value, index, arr) => {
                            return <li key={index}>{value}</li>;
                        })}
                    </ul>

                    <button className="big-button" onClick={(e) => this.props.handleStartGame()}>Start Game</button>
                </div>
            </div>
        );
    }
}

export default Wait;