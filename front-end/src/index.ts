import data from 'shell/window';

var root = document.getElementById('injectionpoint');
root!.innerHTML = "This is the 2nd version of the app.";

console.log("application started");
console.log("The data = ", new data().lastItem());
console.log("Async:", new data().Test().then(x => x+1));