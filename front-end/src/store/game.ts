import * as Redux from 'redux';
import Game from 'models/game';

function reducer(state: Game | undefined, action: Redux.AnyAction){
    if (!state) state = new Game();

    switch(action.type){

    }

    return state;
}

export { reducer };