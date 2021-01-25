import React from "react";

class Game extends React.Component {

    render() {
        return (
            <div id="game-container">
                {this.props.gamePieces.map((piece, index, arr) => {
                    return <div key = {index} class="circular-piece" style={{width: 200, height: 200, backgroundColor: "green"}}></div>
                })}
            </div>
        );
    }
}

export default Game;