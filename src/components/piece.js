import React from "react";
import { createPortal } from "react-dom";
import {LEFT, RIGHT, UP, DOWN} from "./dir";

const VELOCITY = 10;

class Piece extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerX: props.playerX,
            playerY: props.playerY,
            dirX: [props.dirX], //index 0 contains the current x direction, index 1 contains the new x direction
            dirY: [props.dirY], //index 0 contains the current y direction, index 1 contains the new y direction
            turning: false,
            velocity: VELOCITY,
            radius: props.radius,
            controllable: props.controllable //Only the player's pieces should be controllable
        }
    }

    componentDidMount() {
        this.props.scrollToPlayer(this.state.playerX, this.state.playerY);

        //TODO: Need to improve turning so that the piece moves along a curve. For example, if i am going right up and the direction changes to left up, then
        //reduce the velocity for the x until it hits 0. switch to the new direction and gradually increase it for the x until it hits its previous value. Notice
        //that the velocity for the y does not change in the process.
        window.setInterval(() => {
            if(!this.state.turning) {
                let newPlayerX = this.state.playerX + (this.state.dirX[0] * this.state.velocity);
                let newPlayerY = this.state.playerY + (this.state.dirY[0] * this.state.velocity);

                if(this.state.velocity < VELOCITY) {
                    this.setState({playerX: newPlayerX, playerY: newPlayerY, velocity: this.state.velocity + 1});
                } else {
                    this.setState({playerX: newPlayerX, playerY: newPlayerY});
                }
                
            } else {
                //Keep on reducing the velocity until it hits 0. make the swich in direction and gradually increase the velocity until it is
                //back to its original value
                if(this.state.velocity > 0) {
                    this.setState({velocity: this.state.velocity - 1});
                } else {
                    let newDirX = this.state.dirX[1];
                    let newDirY = this.state.dirY[1];

                    this.state.dirX.pop();
                    this.state.dirY.pop();

                    this.state.dirX[0] = newDirX;
                    this.state.dirY[0] = newDirY;

                    this.setState({dirX: this.state.dirX, dirY: this.state.dirY, velocity: 1, turning: false});
                }
            }

        }, 1);

        window.onmousemove = (e) => {
            this.handleMouseMove(e);
        }
    }

    handleMouseMove(e) {
        if(this.state.controllable && !this.state.turning) {
            //Translate the position of this player's piece in the direction correspoinding to the mouse movement but with a constant velocity

            let oldDirX = this.state.dirX[0];
            let oldDirY = this.state.dirY[0];

            let newDirX = oldDirX;
            let newDirY = oldDirY;

            if(e.movementX !== 0) {
                newDirX = (e.movementX/Math.abs(e.movementX)) == -1 ? LEFT : RIGHT;
            }

            if(e.movementY !== 0) {
                newDirY = (e.movementY/Math.abs(e.movementY)) == -1 ? UP : DOWN;
            }
            

            //TODO: Inform the server of this player's new x and y coordinates

            let turning = (newDirX !== oldDirX) || (newDirY !== oldDirY);
            if(turning) { //dirX and dirY have two elements respectively only when turning, otherwise both individual elements remained the same
                this.state.dirX.push(newDirX);
                this.state.dirY.push(newDirY);
            } 

            //Update the player's x and y coordinates and indicate whether or not a turn is happening
            this.setState({dirX: this.state.dirX, dirY: this.state.dirY, turning: turning});
        }
    }


    render() {
        return (
            <div className="circular-piece" 
            style={{width: this.state.radius * 2, height: this.state.radius * 2, backgroundColor: this.props.color, position:"absolute", left: this.state.playerX , top: this.state.playerY}}
            onMouseMove={(e) => this.handleMouseMove(e)}>{this.props.name}
            </div>
        );
    }
}

export default Piece;