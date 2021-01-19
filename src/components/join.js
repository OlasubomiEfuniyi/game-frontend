import React from "react";

class Join extends React.Component {

    render() {
        return (
            <div id="join-container">
                <input id="code" placeholder="Enter Game Code"></input>
                <br />
                <button onClick={(e) => this.props.handleJoin()}>Join</button>
                <button onClick={(e) => this.props.handleBack() }>Back</button>
            </div>
        );
    }
}

export default Join;