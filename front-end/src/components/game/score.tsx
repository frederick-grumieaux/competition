import * as React from  'react';
import Game, { Goal } from 'src/models/game';
import { optional } from 'src/app-shell/types';
import { set } from 'src/store/set';

interface props {
    game: Game;
}
interface state {

}

export class Score extends React.Component<props, state> {

    constructor(props: props){
        super(props);
    }

    render(){
        var home = 0;
        var guests = 0;
        var records : record[] = [];

        for(var idx = 0; idx < this.props.game.score.length; idx++){
            var rec = this.props.game.score[idx];                
            var map = {
                key: idx+'',
                minute : rec.minute,
                guests: guests,
                home: home,
                homePlayerNumber: this.homePlayerNumber(rec.playerId),
                guestPlayerNumber: this.guestPlayerNumber(rec.playerId)
            };
            if (map.homePlayerNumber) map.home = ++home;
            else map.guests = ++guests;
            records.push(map);
        }

        return <div className="goals-all">
            <div className="header">
                <div>M</div>
                <div>P</div>
                <div>H</div>
                <div>G</div>
                <div>P</div>
            </div>
            {records.map(this.renderGoal)}
        </div>;
    }

    renderGoal(goal:record){
        return <div key={goal.key} className="goal-details">
            <div>{goal.minute}</div>
            <div>{goal.homePlayerNumber}</div>
            <div>{goal.home}</div>
            <div>{goal.guests}</div>
            <div>{goal.guestPlayerNumber}</div>
        </div>;
    }

    homePlayerNumber(playerId: string):optional<string> {
        return this.props.game.home.players
            .filter(p => p.playerNo === playerId)
            .map(p => p.number+'')[0];
    }
    guestPlayerNumber(playerId: string):optional<string> {
        return this.props.game.visitors.players
            .filter(p => p.playerNo === playerId)
            .map(p => p.number+'')[0];
    }
}

interface record {
    key: string;
    minute: number;
    home: number;
    guests: number;
    homePlayerNumber: optional<string>;
    guestPlayerNumber: optional<string>;
}