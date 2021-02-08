import React from "react";
import Leaderboard from "./leaderboard";

const VELOCITY = 4;
const LEFT = -1;
const RIGHT = 1;
const UP = -1;
const DOWN = 1;

class Game extends React.Component {
    constructor(props) {
        super(props);

        let playerX = Number.parseInt(this.props.gameData.playerData.get(this.props.playerId).pieces[0]._x); //The x coordinate of the players piece
        let playerY = Number.parseInt(this.props.gameData.playerData.get(this.props.playerId).pieces[0]._y); //The y coordinate of the players piece
        this.state = {
            playerX: playerX,
            playerY: playerY,
            dirX: RIGHT, //The direction in which the x coordinate is changing. Values are either LEFT or RIGHT
            dirY: UP, //The direction in which the y coordinate is changing. Values are either Up or Down
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

        //constantly update the player's x and y coordinates
        window.setInterval(() => {
            let element = document.getElementById("player-piece");
            let newPlayerX = this.state.playerX + (this.state.dirX * VELOCITY);
            let newPlayerY = this.state.playerY + (this.state.dirY * VELOCITY);

            element.style.left = newPlayerX;
            element.style.top = newPlayerY;

            this.setState({playerX: newPlayerX, playerY: newPlayerY});
        }, 10);
    }

    handleMouseMove(e) {
        //Translate the position of this player's piece in the direction correspoinding to the mouse movement but with a constant velocity

        let newDirX = this.state.dirX;
        let newDirY = this.state.dirY;

        if(e.movementX !== 0) {
            newDirX = (e.movementX/Math.abs(e.movementX)) == LEFT ? LEFT : RIGHT;
        }

        if(e.movementY !== 0) {
            newDirY = (e.movementY/Math.abs(e.movementY)) == UP ? UP : DOWN;
        }
        
        //TODO: Inform the server of this player's new x and y coordinates

        //Update the player's x and y coordinates
        this.setState({dirX: newDirX, dirY: newDirY});
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

                //Use the x and y coordinate kept in state for this player. When the player moves, this state will be updated and
                //sent to the server for this player so that the server can disseminate it to the other players who will then see
                //the position of this player updated on their screens. I do this so that the change in this players position is
                //close to instantaneous for them to see.
                if(key === this.props.playerId) {
                    allPlayerPieces.push(
                        <div key={i} id="player-piece" className="circular-piece" 
                            style={{width: radius * 2, height: radius * 2, backgroundColor: color, position:"absolute", left: this.state.playerX + (this.state.dirX * VELOCITY), top: this.state.playerY + (this.state.dirY * VELOCITY)}}>{value.name}
                        </div>
                    );
                } else {
                    allPlayerPieces.push(
                        <div key={i} className="circular-piece" 
                            style={{width: radius * 2, height: radius * 2, backgroundColor: color, position:"absolute", left: x, top: y}}>{value.name}
                        </div>
                    );
                }
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
            <div id="game-container" onMouseMove={(e) => {this.handleMouseMove(e);}}>
                {foodPieces}

                {allPlayerPieces}

                <Leaderboard playerData={this.props.gameData.playerData} leaderboard={this.props.gameData.leaderboard} />
            </div>
        );
    }
}

export default Game;