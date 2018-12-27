import data from 'shell/window';
import * as React from  'react';
import * as ReactDOM from 'react-dom';
import * as store from 'src/store/root';
import { Game } from 'comp/game/general';
import { Provider } from 'react-redux';
import { actions } from './store/game';

var root = document.getElementById('injectionpoint');
root!.innerHTML = "This is the 2nd version of the app.";

console.log("application started");
console.log("The data = ", new data().lastItem());
console.log("the store: ", store.store);

interface props {
    name: string;
}
interface state {
    anwser: number;
}

class MyExample extends React.Component<props, state> {
    
    constructor(props:props) {
        super(props);

        this.state = { anwser: 42 };
    }

    public render() {
        //return <div>Hello world {this.state.anwser}</div>;

        return <Provider store={store.store}>
            <Game />
        </Provider>
    }
}

ReactDOM.render(<MyExample name="Joe"/>, document.getElementById('injectionpoint'));


store.store.dispatch(actions.AddGuestPlayer('2334', 12));
store.store.dispatch(actions.AddGuestPlayer('2534', 10));
store.store.dispatch(actions.AddGuestPlayer('2399', 23));
store.store.dispatch(actions.AddGuestPlayer('7045', 1));
store.store.dispatch(actions.AddHomePlayer('6980', 45));
store.store.dispatch(actions.AddHomePlayer('9883', 7));
store.store.dispatch(actions.AddHomePlayer('3345', 3));
store.store.dispatch(actions.SetGuestColors("black", "white"));
store.store.dispatch(actions.SetHomeColors("red", "blue"));

store.store.dispatch(actions.ScoreGoal("2334", 1, false));
store.store.dispatch(actions.ScoreGoal("9883", 1, false));
store.store.dispatch(actions.ScoreGoal("3345", 3, false));
store.store.dispatch(actions.ScoreGoal("3345", 5, false));
store.store.dispatch(actions.ScoreGoal("7045", 9, false));
store.store.dispatch(actions.ScoreGoal("6980", 9, false));
store.store.dispatch(actions.ScoreGoal("2399", 10, false));
store.store.dispatch(actions.ScoreGoal("2399", 14, false));
store.store.dispatch(actions.ScoreGoal("2334", 18, false));

