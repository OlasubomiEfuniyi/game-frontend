import React from "react";

class Game extends React.Component {

    render() {
        return (
            <div id="game-container">
                {this.props.gameData.foodData.map((piece, index, arr) => {
                    let radius = Number.parseInt(piece._radius);
                    let x = Number.parseInt(piece._x);
                    let y = Number.parseInt(piece._y);
                    let color = piece._color;

                     <div key = {index} className="circular-piece" 
                    style={{width: radius * 2, height: radius * 2, backgroundColor: color, position:"absolute", left: x, top: y}}></div>
                })}
            </div>
        );
    }
}

export default Game;