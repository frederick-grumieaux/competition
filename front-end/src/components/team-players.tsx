import * as React from 'react';
import Game, { GamePlayer } from 'src/models/game';
import PlayerDetails from 'comp/player-details';

interface props {
    game: Game;
    isHomeTeam: boolean;
}
interface state {

}

export class TeamPlayers extends React.Component<props, state> {
    render (){
        var team = this.props.isHomeTeam ?
            this.props.game.home :
            this.props.game.visitors;
        
        var players = team.players;

        console.log("logging the team:", team, players);

        return <section>
            <h1>{this.props.isHomeTeam ? 'Home' : 'Guests'}</h1>
            <h3>colors: {team.colors.map((value, idx) => <span key={idx}>{value}</span>)}</h3>
            <ul>
                {players.map(player => 
                    <li key={player.number}>
                        <span>{player.number}</span>
                        <PlayerDetails display="NAME" playerNo={player.playerNo} />
                        <span>cards</span>
                        <span>time penalities</span>
                        <span>total # goals</span>
                        <span>{player.playerNo}</span>
                    </li>
                )}
            </ul>
        </section>
    }
}