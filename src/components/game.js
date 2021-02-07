import React from "react";
import Leaderboard from "./leaderboard";

class Game extends React.Component {
    constructor(props) {
        super(props);

        let playerX = this.props.gameData.playerData.get(this.props.playerId).pieces[0]._x; //The x coordinate of the players piece
        let playerY = this.props.gameData.playerData.get(this.props.playerId).pieces[0]._y; //The y coordinate of the players piece
        this.state = {
            playerX: playerX,
            playerY: playerY,
            playerData: this.props.gameData.playerData,
            foodData: this.props.gameData.foodData,
            leaderboard: this.props.gameData.leaderboard
        };
    }
    
    componentDidMount() {
        //Scroll to the x and y coordinate of the player's piece
        if(this.state.playerX && this.state.playerY) {
            document.getElementById("game-container").scroll({
                top: this.state.playerY,
                left: this.state.playerX,
                behavior: 'smooth'
            });
        }
    }

    render() {
        let allPlayerPieces = []; //An array to hold all the game pieces to be rendered for each player
        let foodPieces = []; //An array to hold all the food pieces to be rendered
        let i = 0;

        //Create game pieces for all the players
        this.state.playerData.forEach((value, key, map) => {
            let pieces = value.pieces; //Get the array that contains data about this player's pieces

            pieces.forEach((piece, index, arr) => {
                let radius = Number.parseInt(piece._radius);
                let x = Number.parseInt(piece._x);
                let y = Number.parseInt(piece._y);
                let color = piece._color;

                allPlayerPieces.push(<div key={i} className="circular-piece" style={{width: radius * 2, height: radius * 2, backgroundColor: color, position:"absolute", left: x, top: y}}>{value.name}</div>);
                i++;                
            });
        });

        //Create food in the game
        this.state.foodData.map((piece, index, arr) => {
            let radius = Number.parseInt(piece._radius);
            let x = Number.parseInt(piece._x);
            let y = Number.parseInt(piece._y);
            let color = piece._color;

            foodPieces.push(<div key = {i} className="circular-piece" style={{width: radius * 2, height: radius * 2, backgroundColor: color, position:"absolute", left: x, top: y}}></div>);
            i++;
        });

        return (
            <div id="game-container">
                {foodPieces}

                {allPlayerPieces}

                <Leaderboard playerData={this.props.gameData.playerData} leaderboard={this.props.gameData.leaderboard} />
            </div>
        );
    }
}

export default Game;