var firebase = require("firebase");

var serviceAccount = require("./serviceAccountKey.json");

firebase.initializeApp({
  serviceAccount,
  databaseURL: "https://next-gate-tech-test-e33f2.firebaseio.com"
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
  const secondArrays =[]
  for (let i=1; i<60000; i++ ) {
    let row = csvData[i];
    let newObject = {}
    for (let j=0; j < row.length; j++) {
      if (row[j] !== undefined) {
        newObject[correspondColumn[j]] = row[j]
      }
    }
    dataForFirebase.push(newObject);
    const secondArrays = dataForFirebase.splice(52000,51247);
  }          
  console.log(dataForFirebase);
  console.log(secondArrays);
  /**
  * Setting Data Object Value
  */
  ref.set(dataForFirebase);
});