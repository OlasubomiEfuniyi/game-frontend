import React from "react";
import {LEFT, RIGHT, UP, DOWN} from "./dir";

const VELOCITY = 10;
const VELOCITY_QUOTIENT = 100; 

class Piece extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerX: props.playerX,
            playerY: props.playerY,
            dirX: [props.dirX], //index 0 contains the current x direction, index 1 contains the new x direction
            dirY: [props.dirY], //index 0 contains the current y direction, index 1 contains the new y direction
            turning: false,
            //absolute x and y velocity are equal but their current values can differ during turning
            velocityX: VELOCITY,    //Controls the rate at which the x coordinate of the piece changes
            velocityY: VELOCITY,    //Controls the rate at which the y coordinate of the piece changes
            currVelocityX: VELOCITY,
            currVelocityY: VELOCITY,
            radius: props.radius,
            controllable: props.controllable //Only the player's pieces should be controllable
        }
    }

    componentDidMount() {
        this.props.scrollToPlayer(this.state.playerX, this.state.playerY);

        /* The code below assumes that as long as turning has been set to true, the dirX and dirY state will remain unchnaged
        until it is reset to false. */
        window.setInterval(() => {
            if(!this.state.turning) {
                let newPlayerX = this.state.playerX + (this.state.dirX[0] * this.state.currVelocityX);
                let newPlayerY = this.state.playerY + (this.state.dirY[0] * this.state.currVelocityY);

    
                this.setState({playerX: newPlayerX, playerY: newPlayerY});     
            } else if(this.state.turning && this.state.dirX.length === 2 && this.state.dirY.length == 2) {
                    /* Find out which directions changed so i know which velocity to change. Since a turn is happening,
                    booth the x and y directions must have exactly two values in them */
                    let xChanged = this.state.dirX[0] !== this.state.dirX[1];
                    let yChanged = this.state.dirY[0] !== this.state.dirY[1];
                    let newVelocityX = this.state.currVelocityX;
                    let newVelocityY = this.state.currVelocityY;
                    
                    if(xChanged && !yChanged) {
                        //If x direction changed but y direction did no change, start decrementing x velocity until it hits 0.
                        if(this.state.currVelocityX > 0) {
                            newVelocityX = this.state.currVelocityX - (this.state.velocityX/VELOCITY_QUOTIENT);
                        } else {
                            let newDirX = this.state.dirX[1];
                            let newDirY = this.state.dirY[1];

                            this.state.dirX.pop();
                            this.state.dirY.pop();

                            this.state.dirX[0] = newDirX;
                            this.state.dirY[0] = newDirY;

                            this.setState({dirX: this.state.dirX, dirY: this.state.dirY});
                        }
                    } else if(yChanged && !xChanged) {
                        //if y direction changed but x direction did not, start decrementing y velocity until it hits 0
                        if(this.state.currVelocityY > 0) { 
                            newVelocityY = this.state.currVelocityY - (this.state.velocityY/VELOCITY_QUOTIENT);
                        } else {
                            let newDirX = this.state.dirX[1];
                            let newDirY = this.state.dirY[1];

                            this.state.dirX.pop();
                            this.state.dirY.pop();

                            this.state.dirX[0] = newDirX;
                            this.state.dirY[0] = newDirY;

                            this.setState({dirX: this.state.dirX, dirY: this.state.dirY});
                        }
                    } else if(xChanged && yChanged) {
                        //If both directions changed, start decrementing both velocities until they hit 0
                        //Since they are starting from the same place, they should hit 0 at the same time
                        if(this.state.currVelocityX > 0 && this.state.currVelocityY > 0) { 
                            newVelocityX = this.state.currVelocityX - (this.state.velocityX/VELOCITY_QUOTIENT);
                            newVelocityY = this.state.currVelocityY - (this.state.velocityY/VELOCITY_QUOTIENT);
                        } else {
                            let newDirX = this.state.dirX[1];
                            let newDirY = this.state.dirY[1];

                            this.state.dirX.pop();
                            this.state.dirY.pop();

                            this.state.dirX[0] = newDirX;
                            this.state.dirY[0] = newDirY;

                            this.setState({dirX: this.state.dirX, dirY: this.state.dirY});
                        }
                    } else { //One direction must change if a turn is happening
                        console.log("Expected a direction to change but did not");
                    }

                    let newPlayerX = this.state.playerX + (this.state.dirX[0] * this.state.currVelocityX);
                    let newPlayerY = this.state.playerY + (this.state.dirY[0] * this.state.currVelocityY);
                    this.setState({currVelocityX: newVelocityX, currVelocityY: newVelocityY, playerX: newPlayerX, playerY: newPlayerY});
                    
            } else if(this.state.turning) {
                let newPlayerX = this.state.playerX + (this.state.dirX[0] * this.state.currVelocityX);
                let newPlayerY = this.state.playerY + (this.state.dirY[0] * this.state.currVelocityY);

                //Time to increment the appropriate velocity while moving in the new direction
                if(this.state.currVelocityX < this.state.velocityX && this.state.currVelocityY === this.state.velocityY) {
                    //Only x direction changed and so only its velocity needs to be restored
                    this.setState({playerX: newPlayerX, playerY: newPlayerY, currVelocityX: this.state.currVelocityX + (this.state.velocityX/VELOCITY_QUOTIENT)});
                } else if(this.state.currVelocityY < this.state.velocityY && this.state.currVelocityX === this.state.velocityX) {
                    //Only y direction changed and so only its velocity needs to be restored
                    this.setState({playerX: newPlayerX, playerY: newPlayerY, currVelocityY: this.state.currVelocityY + (this.state.velocityY/VELOCITY_QUOTIENT)});
                } else if(this.state.currVelocityY < this.state.velocityX && this.state.currVelocityX < this.state.velocityX) {
                    //Both directions changes so both velocities need to be restored
                    this.setState({playerX: newPlayerX, playerY: newPlayerY, currVelocityX: this.state.currVelocityX + (this.state.velocityX/VELOCITY_QUOTIENT), currVelocityY: this.state.currVelocityY + (this.state.velocityY/VELOCITY_QUOTIENT)});
                } else {
                    //Both are fully restored, turn off turning
                    this.setState({turning: false, zeroCount: 0});
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