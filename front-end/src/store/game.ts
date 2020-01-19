import * as Redux from 'redux';
import Game, { Goal } from 'models/game';
import { optional } from 'shell/types';
import keyGenerator from 'shell/unique-id';
import { BaseReducer } from 'store/reducer';

export class GameReducer extends BaseReducer<Game> {
    constructor() {
        super(new Game());
    }

    ActionSwitch(cloner:() => Game, action: Redux.AnyAction) {
        switch (action.type) {
            case "GAME_RESET": return this.resetGame(cloner, action);
            case "GAME_ADD_PLAYER_HOME": return this.addHomePlayer(cloner, action as AddHomePlayerAction);
            case "GAME_ADD_PLAYER_GUEST": return this.addGuestPlayer(cloner, action as AddGuestPlayerAction);
            case "GAME_REMOVE_PLAYER": return this.removePlayer(cloner, action as RemovePlayerAction);
            case "GAME_PLAYER_ALTER": return this.playerChangeNumber(cloner, action as PlayerChangeNumberAction);

            case "GAME_HOME_COLORS": return this.setHomeColors(cloner, action as SetHomeColorsAction);
            case "GAME_GUEST_COLORS": return this.setGuestColors(cloner, action as SetGuestColorsAction);

            case "GAME_SCORE_GOAL": return this.scoreGoal(cloner, action as ScoreGoalAction);
            case "GAME_SCORE_GOAL_ALTERATION": return this.updateGoal(cloner, action as UpdateGoalAction);
            case "GAME_GOAL_DELETE": return this.deleteGoal(cloner, action as RemoveGoalAction);
        }
    }

    cloneHome(cloner: () => Game) {
        var clone = cloner();
        clone.home = { ...clone.home };
        return clone;
    }
    cloneVisitors(cloner: () => Game) {
        var clone = cloner();
        clone.visitors = { ...clone.visitors };
        return clone;
    }
    cloneHomePlayers(cloner: () => Game) : Game{
        var clone = this.cloneHome(cloner);
        clone.home.players = [...clone.home.players];
        return clone;
    }
    cloneVisitorPlayers(cloner: () => Game) : Game {
        var clone = this.cloneVisitors(cloner);
        clone.visitors.players = [...clone.visitors.players];
        return clone;
    }
    
    resetGame(cloner: () => Game, action: ResetGameAction) {
        var state = cloner();
        var newGame = new Game();
        Object.getOwnPropertyNames(state).map(x => delete (state as any)[x]);
        Object.getOwnPropertyNames(newGame).map(x => (state as any)[x] = (newGame as any)[x]);
    }
    addHomePlayer(cloner: () => Game, action: AddHomePlayerAction) {
        var oldState = super.getOldState(cloner);
        if (oldState.home.players.filter(x => x.number === action.no || x.playerNo === action.playerId).length > 0)
            return;

        var clone = this.cloneHomePlayers(cloner);
        clone.home.players.push({
            number: action.no,
            playerNo: action.playerId
        });
    }
    addGuestPlayer(cloner: () => Game, action: AddGuestPlayerAction) {
        var oldState = super.getOldState(cloner);
        if (oldState.visitors.players.filter(x => x.number === action.no || x.playerNo === action.playerId).length > 0)
            return;

        var clone = this.cloneVisitorPlayers(cloner);
        clone.visitors.players.push({
            number: action.no,
            playerNo: action.playerId
        });
    }
    playerChangeNumber(cloner: () => Game, action: PlayerChangeNumberAction) {
        let oldState = super.getOldState(cloner);
        if (oldState.home.players.filter(p => p.playerNo === action.playerId).length > 0) {
            var clone = this.cloneHomePlayers(cloner);
            clone.home.players = clone.home.players.map(p => {
                if (p.playerNo === action.playerId)
                    return { ...p, number: action.newNo };
                else return p;
            });
        }
        else if (oldState.visitors.players.filter(p => p.playerNo === action.playerId).length > 0) {
            var clone = this.cloneVisitorPlayers(cloner);
            clone.visitors.players = clone.visitors.players.map(p => {
                if (p.playerNo === action.playerId)
                    return { ...p, number: action.newNo };
                else
                    return p;
            });
        }
    }
    removePlayer(cloner: () => Game, action: RemovePlayerAction) {
        let old = super.getOldState(cloner);        
        if (old.home.players.filter(p => p.playerNo === action.playerId).length > 0) {
            var clone = this.cloneHomePlayers(cloner);
            clone.home.players = clone.home.players.filter(x => x.playerNo !== action.playerId);
        }
        else if (old.visitors.players.filter(p => p.playerNo === action.playerId)) {
            var clone = this.cloneVisitorPlayers(cloner);
            clone.visitors.players = clone.visitors.players.filter(x => x.playerNo !== action.playerId);
        }
    }

    setHomeColors(cloner: () => Game, action: SetHomeColorsAction) {
        var clone = this.cloneHome(cloner);
        clone.home.colors = [action.mainColor, action.secundaryColor];
    }
    setGuestColors(cloner: () => Game, action: SetGuestColorsAction) {
        var clone = this.cloneVisitors(cloner);
        clone.visitors.colors = [action.mainColor, action.secundaryColor];
    }

    scoreGoal(cloner: () => Game, action: ScoreGoalAction) {
        var goal = new Goal(action.ref, action.playerId, action.minute, action.firstHalf ? 1 : 2);
        if (action.inSecondHalf)
            goal.minute += 30;

        var clone = cloner();
        clone.score = [...clone.score, goal];
    }
    updateGoal(cloner: () => Game, action: UpdateGoalAction) {
        var clone = cloner();

        clone.score.map(goal => {
            if (goal.ref !== action.ref) return goal;

            var update = { ...goal };
            if (action.playerId !== undefined)
                update.playerId = action.playerId;
            if (action.minute !== undefined)
                update.minute = action.minute;
            if (action.firstHalf !== undefined)
                update.half = action.firstHalf ? 1 : 2;

            return update;
        });
    }
    deleteGoal(cloner: () => Game, action: RemoveGoalAction) {
        var clone = cloner();
        clone.score = clone.score.filter(goal => goal.ref !== action.ref);
    }
}

export interface ResetGameAction extends Redux.AnyAction {
    type: "GAME_RESET"
}

export interface AddHomePlayerAction  extends Redux.AnyAction {
    type: "GAME_ADD_PLAYER_HOME"
    playerId: string;
    no: number;
}
export interface AddGuestPlayerAction extends Redux.AnyAction {
    type: "GAME_ADD_PLAYER_GUEST";
    playerId: string;
    no: number;
}
export interface RemovePlayerAction extends Redux.AnyAction {
    type: "GAME_REMOVE_PLAYER";
    playerId: string;
}
export interface PlayerChangeNumberAction extends Redux.AnyAction {
    type: "GAME_PLAYER_ALTER";
    playerId: string;
    newNo: number;
}

export interface SetHomeColorsAction extends Redux.AnyAction {
    type: "GAME_HOME_COLORS";
    mainColor: string;
    secundaryColor: string;
}
export interface SetGuestColorsAction  extends Redux.AnyAction {
    type: "GAME_GUEST_COLORS";
    mainColor: string;
    secundaryColor: string;
}

export interface ScoreGoalAction extends Redux.AnyAction {
    type: "GAME_SCORE_GOAL";
    ref: string;
    playerId: string;
    minute: number;
    firstHalf: boolean;
}
export interface UpdateGoalAction extends Redux.AnyAction {
    type: "GAME_SCORE_GOAL_ALTERATION";
    ref: string;
    playerId?: string | undefined;
    minute?: number | undefined;
    firstHalf?: boolean | undefined;
}
export interface RemoveGoalAction extends Redux.AnyAction {
    type: "GAME_GOAL_DELETE";
    ref: string;
}

class GameActions {

    public ResetGame(): ResetGameAction {
        return { type: "GAME_RESET" };
    }

    public AddHomePlayer(playerId: string, no: number) : AddHomePlayerAction{
        return { type: "GAME_ADD_PLAYER_HOME", playerId, no};
    }
    public AddGuestPlayer(playerId: string, no: number): AddGuestPlayerAction{
        return { type: "GAME_ADD_PLAYER_GUEST", playerId, no};
    }
    public RemovePlayer(playerId: string): RemovePlayerAction {
        return { type: "GAME_REMOVE_PLAYER", playerId }
    }
    public ChangeNumberForPlayer(playerId: string, newNo: number): PlayerChangeNumberAction {
        return { type: "GAME_PLAYER_ALTER", playerId, newNo }
    }

    public SetHomeColors(mainColor: string, secundaryColor: string): SetHomeColorsAction{
        return { type: "GAME_HOME_COLORS", mainColor, secundaryColor }
    }
    public SetGuestColors(mainColor: string, secundaryColor: string): SetGuestColorsAction{
        return { type: "GAME_GUEST_COLORS", mainColor, secundaryColor };
    }
    public ScoreGoal(playerId: string, minute: number, firstHalf: boolean): ScoreGoalAction {

        return {
            type: "GAME_SCORE_GOAL",
            ref: keyGenerator(),
            playerId, minute, firstHalf
        };
    }
    public UpdateGoalMinute(ref: string, newMinute : number): UpdateGoalAction {
        return { type: "GAME_SCORE_GOAL_ALTERATION", ref, minute: newMinute }
    }
    public UpdateGoalHalf(ref: string, firstHalf : boolean): UpdateGoalAction {
        return { type: "GAME_SCORE_GOAL_ALTERATION", ref, inSecondHalf: !firstHalf }
    }
    public UpdateGoalPlayer(ref: string, newPlayerId: string): UpdateGoalAction {
        return { type: "GAME_SCORE_GOAL_ALTERATION", ref, playerId: newPlayerId };
    }
    public RemoveGoal(ref: string): RemoveGoalAction {
        return { type: "GAME_GOAL_DELETE", ref };
    }
}

const actions = new GameActions();

export { actions };