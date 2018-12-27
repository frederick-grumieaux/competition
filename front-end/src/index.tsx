import data from 'shell/window';
import * as React from  'react';
import * as ReactDOM from 'react-dom';
import * as store from 'src/store/root';

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
        return <div>Hello world {this.state.anwser}</div>;
    }
}

ReactDOM.render(<MyExample name="Joe"/>, document.getElementById('injectionpoint'));