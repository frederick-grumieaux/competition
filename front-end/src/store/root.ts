import * as Redux from 'redux';
import { Manager, set } from 'store/set';
import Game from 'models/game';
import Player from 'models/player';
import Team from 'models/team';
import { reducer as gameReducer } from 'store/game';


//Create some generic managers for collections of data
var players = new Manager<Player>({ typeName: 'players', getKey: player => ''+player.no});
var teams = new Manager<Team>({ typeName: 'teams', getKey: team => ''+team.id});

//Combine several reducers into one master reducer
var applicationReducer = Redux.combineReducers({
    game: gameReducer,
    players: players.Reduce,
    teams: teams.Reduce
});

//create the actual store
const store = Redux.createStore(applicationReducer);

//create the interface that matches our store
interface ApplicationState {
    game: Game,
    players: set<Player>,
    teams: set<Team>,
}

//export public API of this file.
const playerActions = players.actions();
const teamActions = teams.actions();
export {
    store,
    ApplicationState,
    playerActions,
    teamActions,
};


// var state = {
//     user: { logedin: true|false, name: "dinge" },
//     view: "website" | "web-app",

//     server: {
//         teams: {}
//         players: {},
//         clubs: {},
//         matches: {},
//         competitions: {}
//     }

//     game: {
//         home: {
//             team: 'code',
//             colors: ["white", "black"],
//             players: [
//                 { no: 5, playerNr: "1233D" },
//                 ...
//             ]
//         }
//         visitor: {

//         },
//         score: [
//             { player: "lkjk", minute: 2 },
//             ...
//         ],
//         faults: [
//             { type: "yellow", min: 22, sec:12, player: "EDDJJD" }
//         ],
//         referees: [
//             { no: "SDSD"},
//             { no: "jkljlk"}
//         ],
//         timeKeeper: "SDSD",
//         secretaris: "sdsdlsksd",
//     }
// }