import React from "react";

class Join extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: ""
        };
    }

    handleNameChange(newName) {
        this.setState({name: newName});
    }

    handleCodeChange(newCode) {
        this.setState({code: newCode});
    }

    render() {
        return (
            <div id="join-container">
                <input id="code" placeholder="Enter Game Code" onInput={(e) => this.handleCodeChange(e.target.value)} />
                <br />
                <input id="name" placeholder="Enter Player Name" onInput={(e) => this.handleNameChange(e.target.value)} />
                <br />
                <button onClick={(e) => this.props.handleJoin(this.state.code, this.state.name)}>Join</button>
                <button onClick={(e) => this.props.handleBack() }>Back</button>
            </div>
        );
    }
}

export default Join;