import * as Redux from 'redux';
import Game, { Goal } from 'models/game';
import { optional } from 'shell/types';

function reducer(state: optional<Game>, x: Redux.AnyAction){
    if (!state) state = new Game();
    var clone = {...state};
    var action = x as AnyGameAction;

    switch(action.type){
        case "GAME_GUEST_COLORS":
            clone.visitors = {...clone.visitors};
            clone.visitors.colors = [action.mainColor, action.secundaryColor];
            return clone;

        case "GAME_HOME_COLORS":
            clone.home = {...clone.home};
            clone.home.colors = [action.mainColor, action.secundaryColor];
            return clone;

        case "GAME_PLAYER_GUEST":
            if (clone.visitors.players.filter(p => p.number === action.no).length > 0)
                return state;
            clone.visitors = {...clone.visitors};
            clone.visitors.players = [...clone.visitors.players, { number: action.no, playerNo: action.playerId }]
            return clone;

        case "GAME_PLAYER_HOME":
            if (clone.home.players.filter(p => p.number === action.no).length > 0)
                return state;
            clone.home = {...clone.home};
            clone.home.players = [...clone.home.players, { number: action.no, playerNo: action.playerId}];
            return clone;
        
        case "GAME_SCORE_GOAL":
            clone.score = [...clone.score, new Goal(action.playerId, action.minute)];
            return clone;
    }

    return state;
}

interface AddHomePlayerAction  extends Redux.AnyAction {
    type: "GAME_PLAYER_HOME"
    playerId: string;
    no: number;
}
interface AddGuestPlayerAction extends Redux.AnyAction {
    type: "GAME_PLAYER_GUEST"
    playerId: string;
    no: number;
}
interface SetHomeColorsAction extends Redux.AnyAction {
    type: "GAME_HOME_COLORS";
    mainColor: string;
    secundaryColor: string;
}
interface SetGuestColors  extends Redux.AnyAction {
    type: "GAME_GUEST_COLORS";
    mainColor: string;
    secundaryColor: string;
}
interface ScoreGoalAction extends Redux.AnyAction {
    type: "GAME_SCORE_GOAL";
    playerId: string;
    minute: number;
    inSecondHalf: boolean;
}
type AnyGameAction = AddHomePlayerAction | AddGuestPlayerAction | SetHomeColorsAction | SetGuestColors | ScoreGoalAction;

class GameActions {

    public AddHomePlayer(playerId: string, no: number) : AddHomePlayerAction{
        return { type: "GAME_PLAYER_HOME", playerId, no};
    }
    public AddGuestPlayer(playerId: string, no: number): AddGuestPlayerAction{
        return {type: "GAME_PLAYER_GUEST", playerId, no};
    }
    public SetHomeColors(mainColor: string, secundaryColor: string): SetHomeColorsAction{
        return { type: "GAME_HOME_COLORS", mainColor, secundaryColor }
    }
    public SetGuestColors(mainColor: string, secundaryColor: string): SetGuestColors{
        return { type: "GAME_GUEST_COLORS", mainColor, secundaryColor };
    }
    public ScoreGoal(playerId: string, minute: number, inSecondHalf: boolean): ScoreGoalAction{
        return {type: "GAME_SCORE_GOAL", playerId, minute, inSecondHalf};
    }

}

const actions = new GameActions();

export { reducer, actions };