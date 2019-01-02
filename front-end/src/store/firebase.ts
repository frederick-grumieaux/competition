import firebaseConfig from './firebase.config';
import * as firebase from 'firebase';

//create the connection
const db = firebase
    .initializeApp(firebaseConfig)
    .firestore();

//extra configuration -> must be done before using the connection
db.settings({timestampsInSnapshots: true});

//start using the database connection...
var hwref = db.doc('translations/hello-world');
console.log("fetching data", hwref.path);
hwref
    .get()
    .then(x =>{
        console.log("args: ", x.exists, x.id, x.ref);
        console.log("received value:", x.data());
    });

export default db;