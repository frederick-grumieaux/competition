import * as Redux from 'redux';
import Game from 'models/game';
import { optional } from 'shell/types';

function reducer(state: optional<Game>, action: Redux.AnyAction){
    if (!state) state = new Game();

    switch(action.type){

    }

    return state;
}

export { reducer };