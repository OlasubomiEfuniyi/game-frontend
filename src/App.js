import './App.css';
import React from "react";
import Welcome from "./components/welcome";
import Create from "./components/create";
import Join from "./components/join";

const WELCOMING = 0;
const JOINING = 1;
const CREATING = 2;
const WAITING = 3;
const PLAYING = 4;
const FINISHED = 5;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //The game can be in one of 6 states based on what the client is doing
      //1. WELCOMING  - A user is on the welcome screen
      //2. JOINING - A user is being prompted for join info
      //3. CREATING - A user is creating a game 
      //4. WAITING - A user is waiting for other players to join a created game
      //5. PLAYING - A user is playing a game
      //6. FINISHED - A user has finished playing a game
      gameState: [WELCOMING]
    }
  }
  componentDidMount() {
    const ws = new WebSocket("ws://localhost:8080");

    ws.addEventListener('error', (err) => {
      console.log(`Error occured while creating web socket: ${err}`);
    });
  }

  handleCreateGame() {
    this.state.gameState.push(CREATING);
    this.setState({gameState: this.state.gameState});
  } 

  handleJoinGame() {
    this.state.gameState.push(JOINING);
    this.setState({gameState: this.state.gameState});
  }

  handleJoin() {

  }

  handleBack() {
    this.state.gameState.pop();

    this.setState({gameState: this.state.gameState});
  }

  render() {
    switch(this.state.gameState[this.state.gameState.length - 1]) {
      case WELCOMING:
        return (
          <div id="app-container">
            <Welcome 
              handleCreateGame={() => this.handleCreateGame()}
              handleJoinGame={() => this.handleJoinGame()} />
          </div>
        );
      case CREATING:
        return (
          <div id ="app-container">
            <Create 
            handleJoinGame={() => this.handleJoinGame()}
            handleBack={() => this.handleBack()} />
          </div>
        );
      case JOINING:
        return (
          <div id="app-container">
            <Join 
            handleJoin={() => this.handleJoin()}
            handleBack={() => this.handleBack()} />
          </div>
        );

      default:
        return (
          <div id="app-container">
            <h1>Invalid game state</h1>
          </div>
        );
    }
  }
}

export default App;
