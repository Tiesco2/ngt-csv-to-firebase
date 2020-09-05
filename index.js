var firebase = require("firebase");
var moment = require('moment');

var serviceAccount = require("./serviceAccountKey.json");

firebase.initializeApp({
  serviceAccount,
  databaseURL: "https://next-gate-t-new-bdd.firebaseio.com/"
});
const parse = require ('csv-parse');
const fs = require ('fs');
/**
* Loading Firebase Database and refering 
* to user_data Object from the Database
*/
var db = firebase.database();
var ref = db.ref("/asset_data");  //Set the current directory you are working in



const csvData = [];
fs.createReadStream(__dirname + '/tests_data.csv')
.pipe(
  parse ({
    delimeter: ','
  })
)
.on('data' , function (dataRow){
  csvData.push(dataRow);
})
.on('end' , function (){
  const column = csvData[0];
  const correspondColumn = {};
  for (let j=0; j<column.length; j++) {
    if (column[j] !== undefined) {
      correspondColumn[j] = column[j]
    }
  }
  const dataForFirebase = []
  for (let i=1; i<60000; i++ ) {
    let row = csvData[i];
    let newObject = {}
    for (let j=0; j < row.length; j++) {
      if (row[j] !== undefined) {
        let value = row[j]
        if(j===7) {
          console.log(row[j]);
          let date = moment(value)
          console.log(date.unix());
          value=date.unix();
        }
        newObject[correspondColumn[j]] = value
      }
    }
    dataForFirebase.push(newObject);
  }    
  const secondArrays = dataForFirebase.splice(60000,43247);    
  // boucler sur sencondArrays et envoyer chaque array de la boucle par firebase  
  //console.log(dataForFirebase);
  //console.log(secondArrays);
  /**
  * Setting Data Object Value
  */
  ref.set(dataForFirebase);
});