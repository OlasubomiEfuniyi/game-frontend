import React from "react";

class Welcome extends React.Component {
    render() {
        return (
            <div id="welcome-container">
                <h1>Welcome to our game!</h1>
                <div>
                    <button onClick={(e) => this.props.handleCreateGame()}>Create Game</button>
                    <button onClick={(e) => this.props.handleJoinGame()}>Join Game</button>
                </div>
            </div>
        );
    }
}

export default Welcome;
