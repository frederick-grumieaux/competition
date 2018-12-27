import * as React from  'react';
import { connect } from 'react-redux';
import { Score } from './score';
import { TeamPlayers } from 'comp/team-players';
import GameModel from 'models/game';
import { ApplicationState } from 'src/store/root';

interface publicProps {

}
interface injectedProps {
    game: GameModel;
}
type props = publicProps & injectedProps;
interface state {

}

class TheGame extends React.Component<props, state> {

    constructor(props: props){
        super(props);
    }

    render(){
        return <main className="theGame mainView">
            <section className="homeTeam">
                <TeamPlayers game={this.props.game} isHomeTeam={true}/>
            </section>
            <section className="visitorTeam">
                <TeamPlayers game={this.props.game} isHomeTeam={false}/>
            </section>
            <section className="score">
                <Score game={this.props.game}/>
            </section>
        </main>
    }
}

function  mapStateToProps(appState: ApplicationState, props: publicProps) : injectedProps {
    return { game: appState.game };
}


var Game = connect(mapStateToProps)(TheGame);

export { Game };