import * as types from 'src/app-shell/types';

export default class Game {
    constructor() {
        this.score = [];
        this.home = new TeamDetails();
        this.visitors = new TeamDetails();
        this.faults = [];
    };


    public home: TeamDetails;
    public visitors: TeamDetails;
    public score: Goal[];
    public faults: Fault[];
    public timeKeeper: types.oString;
    public secretaris: types.oString;
}

export class TeamDetails {
    constructor(){
        this.colors = [];
        this.players = [];
    }

    teamId: types.oString;
    colors: string[];
    players: GamePlayer[];
}
export class GamePlayer {
    constructor(playerNo: string, number: number){
        this.playerNo = playerNo;
        this.number = number;
    }
    
    public playerNo: string;
    public number: number;
}
export class Goal {
    constructor(ref: string, playerId: string, minute: number, half: 1|2) {
        this.ref = ref;
        this.playerId = playerId;
        this.minute = minute;
        this.half = half;
    }

    public ref: string;
    public playerId: string;
    public minute: number;
    public half: 1|2;
}
type faults =  'YELLOW' | 'TIME' | 'RED' ;
export class Fault {
    constructor(type: faults, playerNo: string){
        this.type = type;
        this.playerNo = playerNo;
    }

    public type: faults;
    public playerNo : string; 
}