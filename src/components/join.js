import React from "react";

class Join extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            joinEnabled: false
        };
    }

    handleNameChange(newName) {
        if(newName.length != 0 && this.state.code.length != 0) {
            this.setState({name: newName, joinEnabled: true});
        } else {
            this.setState({name: newName, joinEnabled: false});
        }
    }

    handleCodeChange(newCode) {
        if(newCode.length != 0 && this.state.name.length != 0) {
            this.setState({code: newCode, joinEnabled: true});
        } else {
            this.setState({code: newCode, joinEnabled: false});
        }
    }

    

    render() {
        return (
            <div id="join-container">
                <input className="join-input"id="code" placeholder="Enter Game Code" onInput={(e) => this.handleCodeChange(e.target.value)} />
                <br />
                <input className="join-input" id="name" placeholder="Enter Player Name" onInput={(e) => this.handleNameChange(e.target.value)} />
                <br />
                {this.state.joinEnabled ? 
                    <button className="join-button" onClick={(e) => this.props.handleJoin(this.state.code, this.state.name)}>Join</button> :
                    <button className="join-button" onClick={(e) => this.props.handleJoin(this.state.code, this.state.name)} disabled>Join</button>
                }
                <button className="join-button" onClick={(e) => this.props.handleBack() }>Back</button>
            </div>
        );
    }
}

export default Join;