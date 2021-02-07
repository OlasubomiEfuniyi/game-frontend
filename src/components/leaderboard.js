import React from "react";

class Leaderboard extends React.Component {
    render() {
        return(
            <div id="leaderboard-container">
                <table id="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.leaderboard.map((value, index, arr) => {
                            return (
                                <tr key={index}> 
                                    <td>{this.props.playerData.get(value.id).name}</td>
                                    <td>{value.score}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Leaderboard;