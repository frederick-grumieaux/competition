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
console.log("observing data", hwref.path);
var data = {} as any;
hwref.onSnapshot(x => {
        console.log("received new snapshot ...", x.exists, x.id);
        console.log("received value:", data = x.data());
    });
setTimeout(() => {
    var promise : Promise<void>;
    if (data['nl-NL']){
        promise = hwref.update({
            'nl-BE': "Dag wereld",
            'nl-NL': firebase.firestore.FieldValue.delete()
        });
    }
    else {
        promise = hwref.update({
            'nl-BE': "Dag wereld",
            'nl-NL': "Dag Iedereen"
        });
    }
    promise
        .then(x => console.log("record updated"))
        .catch(x => console.error("update failed:", x));
    
}, 10000);
export default db;