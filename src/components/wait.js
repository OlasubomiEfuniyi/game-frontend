import React from "react";

class Wait extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="wait-container">
                <ul>
                    {this.props.waitlist.map((value, index, arr) => {
                        return <li key={index}>{value}</li>;
                    })}
                </ul>
            </div>
        );
    }
}

export default Wait;