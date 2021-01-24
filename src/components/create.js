import React from "react";

class Create extends React.Component {

    render() {
        return (
            <div id="create-container">
                <p>Your game code is {this.props.gameCode}</p>
                <p>Copy and share the game code with other players</p>

                <button className="big-button" onClick={(e) => this.props.handleJoinGame()}>Join Game</button>
                <button className="small-button" onClick={(e) => this.props.handleBack()}>Back</button>
            </div>
        );
    }
}

export default Create;