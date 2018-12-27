import * as React from 'react';
import { connect } from 'react-redux';
import IPlayer from 'src/models/player';
import { optional } from 'shell/types';
import { localRecord as rec } from 'store/set'
import { ApplicationState } from 'src/store/root';

interface publicProps {
    display: 'NAME' | 'NO' | 'FIRST-NAME' | 'LAST-NAME'
    playerNo?: optional<string>;
    player?: optional<rec<IPlayer>>;
}
interface injectedProps {
    player: rec<IPlayer>;
}
type props = publicProps & injectedProps;
interface state {

}

class PlayerDetails extends React.Component<props, state> 
{
    render(){
        if (!this.props.player) 
            return this.displayNothing();
        if (!this.props.player.value)
            return this.displayNothing();        

        switch(this.props.player.status){
            case "LOADED":
            case "REFRESHING":
                var player = this.props.player.value;
                switch(this.props.display){
                    default:
                    case 'NAME':
                        return <span>{player.firstName} {player.lastName}</span>;
                    case 'FIRST-NAME':
                        return <span>{player.firstName}</span>;
                    case 'LAST-NAME':
                        return <span>{player.lastName}</span>;
                    case 'NO':
                        return <span>{player.no}</span>;
                }
                break;
            default: 
                return this.displayNothing();
        }
    }

    displayNothing(){
        var player = this.props.player || { status: 'player-not-found', value: {}};
        var spanName = "display:player:"+ this.props.playerNo+ ' record-state:'+ player.status;
        return <span className={spanName}/>;
    }
}


function playerFromState(state: ApplicationState, props: publicProps){

    return {
        player: props.player || state.players.items[props.playerNo || 'x']
    };
}

export default connect(playerFromState)(PlayerDetails);