import React from "react";
import Leaderboard from "./leaderboard";
import {LEFT, RIGHT, UP, DOWN} from "./game_constants";
import Piece from "./piece";


class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerData: this.props.gameData.playerData,
            foodData: this.props.gameData.foodData,
            leaderboard: this.props.gameData.leaderboard
        };
    }
    
    componentDidMount() {
        //Scroll to the x and y coordinate of the player's piece
        //this.scrollToPlayer();

        //constantly update the player's x and y coordinates
        // window.setInterval(() => {
        //     let element = document.getElementById("player-piece");
        //     let newPlayerX = this.state.playerX + (this.state.dirX * VELOCITY);
        //     let newPlayerY = this.state.playerY + (this.state.dirY * VELOCITY);

        //     element.style.left = newPlayerX;
        //     element.style.top = newPlayerY;

        //     this.setState({playerX: newPlayerX, playerY: newPlayerY});
        // }, 1);
    }

    scrollToPlayer(x,y) {
        let top =  y >= (window.innerHeight) ? y - (window.innerHeight/2) : y; //Add half the height of the screen to the player's Y coordinate
        let left = x >= (window.innerWidth)  ? x - (window.innerWidth/2) : x; //Add half the width of the screen to the player's X coordinate

        document.getElementById("game-container").scroll({
            top: top,
            left: left,
            behavior: 'smooth'
        });
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
                        <Piece key={i} playerX={x} playerY={y} color={color} radius={radius} 
                        dirX={LEFT} dirY={UP} controllable={true} name={value.name} scrollToPlayer={(x, y) => this.scrollToPlayer(x,y)}/>
                    );
                } else {
                    allPlayerPieces.push(
                        <Piece key={i} playerX={x} playerY={y} color={color} radius={radius} 
                        dirX={LEFT} dirY={UP} controllable={false} name={value.name} scrollToPlayer={(x, y) => this.scrollToPlayer(x,y)}/>
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
            <div id="game-container">
                {foodPieces}

                {allPlayerPieces}

                <Leaderboard playerData={this.props.gameData.playerData} leaderboard={this.props.gameData.leaderboard} />
            </div>
        );
    }
}

export default Game;