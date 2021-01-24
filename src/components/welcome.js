import React from "react";

class Welcome extends React.Component {
    render() {
        return (
            <div id="welcome-container">
                <h1 className="main-text">Welcome to our game!</h1>
                <div>
                    <button className="big-button" onClick={(e) => this.props.handleCreateGame()}>Create Game</button>
                    <button className ="big-button" onClick={(e) => this.props.handleJoinGame()}>Join Game</button>
                </div>
            </div>
        );
    }
}

export default Welcome;
