console.log('hello titi');
const parse = require ('csv-parse');
const fs = require ('fs');

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
  for (let j=0; j < column.length; j++) {
    if (column[j] !== undefined) {
      correspondColumn[j] = column[j]
    }
  }
  const dataForFirebase = []
  for (let i = 1; i < csvData.length; i++ ) {
    let row = csvData[i];
    let newObject = {}
    for (let j=0; j < row.length; j++) {
      if (row[j] !== undefined) {
        newObject[correspondColumn[j]] = row[j]
      }
    }
    dataForFirebase.push(newObject);
  }          
  console.log(dataForFirebase);
});