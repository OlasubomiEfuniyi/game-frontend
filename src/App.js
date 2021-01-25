import './App.css';
import React from "react";
import Welcome from "./components/welcome";
import Create from "./components/create";
import Join from "./components/join";
import Wait from "./components/wait";
import Game from "./components/game"

const WELCOMING = 0;
const JOINING = 1;
const CREATING = 2;
const WAITING = 3;
const PLAYING = 4;
const FINISHED = 5;

let ws = null;

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
      gameState: [WELCOMING], //game states will be pushed into this array to allow a user to go back if they want to
      gameCode: null, //The unique code used by the server to identify the game world
      gameWorld: null, //The web socket object used by this frontend to interract with the game world
      gameData: null, //An object that contains information about all the players and other game pieces
      playerName: "", //The name of the player in the game world
      playerWaitlist:[]
    }
  }

  componentDidMount() {
    ws = new WebSocket("ws://localhost:1024"); //This web socket is used to comminicate with the server to setup a game

    ws.addEventListener('error', (err) => {
      console.log(`Error occured while creating web socket: ${err}`);
    });

    ws.addEventListener('message', (message) => {
      let msg = JSON.parse(message.data);
      console.log(msg);
      this.handleMessageFromServer(msg);
    });
  }

  handleMessageFromServer(msg) {
    if(msg.status === "SUCCESS") {
      switch(msg.type) {
        case "CREATE":
          this.state.gameState.push(CREATING);
          this.setState({gameCode: msg.gameCode, gameState: this.state.gameState});
          break;
        case "PORT":
          this.connectToGameWorld(msg.port);
          break;
        default:
          console.log(`Invalid response from server ${msg}`);
          break;
      }
    } else {
      console.log("Error communicating with the server");
    }
  }

  handleGameWorldMessage(msg) {
    if(msg.status === "SUCCESS") {
      switch(msg.type) {
        case "CONNECT":
          //Once you connect to a game world, you cannot go back so no need to keep track of previous game states
          this.setState({gameState: [WAITING], playerWaitlist: msg.playerWaitlist});
          break;
        case "START":
          //Once the game is started, you cannot go back so no need to keep track of previous game states
          this.setState({gameState: [PLAYING], playerWaitlist: [], gameData: msg.gameData});
          break;
        default:
          console.log(`Invalid response from server ${msg}`);
          break;
      }
    } else {
      console.log("Error communicating with the game world");
    }
    
  }

  handleCreateGame() {
    //Tell the server to create a new game world
    let command = {
      type: "CREATE"
    };
    ws.send(JSON.stringify(command));
  } 

  //Transition to the joining screen
  handleJoinGame() {
    this.state.gameState.push(JOINING);
    this.setState({gameState: this.state.gameState});
  }

  handleJoin(code, name) {
    //Send a request to the server for the port number
    //associated with the game code
    console.log(code);
    this.setState({playerName: name}, () => {
      let command = {
        type: "PORT",
        gameCode: code
      };
  
      ws.send(JSON.stringify(command));
    });
  }

  handleBack() {
    this.state.gameState.pop();

    this.setState({gameState: this.state.gameState});
  }


  //This function sends a request to the server to start the game
  handleStartGame() {
    let command = {
      type: "START",
      gameCode: this.state.gameCode
    };

    this.state.gameWorld.send(JSON.stringify(command));
  }

  connectToGameWorld(port) {
    let gameWorld = new WebSocket(`ws://localhost:${port}`);

    this.setState({gameWorld: gameWorld}, () => {
      this.state.gameWorld.addEventListener('open', () => {
        let command = {
          type: "CONNECT",
          name: this.state.playerName
        };
    
        this.state.gameWorld.send(JSON.stringify(command));
      });

      this.state.gameWorld.addEventListener('message', (message) => {
        let msg = JSON.parse(message.data);
        console.log(msg);
        this.handleGameWorldMessage(msg);
      });
    });
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
            gameCode={this.state.gameCode} 
            handleJoinGame={() => this.handleJoinGame()}
            handleBack={() => this.handleBack()} />
          </div>
        );
      case JOINING:
        return (
          <div id="app-container">
            <Join 
            handleJoin={(code, name) => this.handleJoin(code, name)}
            handleBack={() => this.handleBack()} />
          </div>
        );
      case WAITING:
        return (
          <div id="app-container">
            <Wait waitlist = {this.state.playerWaitlist} handleStartGame={() => this.handleStartGame()}/>
          </div>
        );
      case PLAYING:
        return (
          <div id="app-container">
            <Game gamePieces={["data"]} />
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
