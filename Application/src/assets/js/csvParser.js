//userSelect are dummy variables for CSVParser ---> 3DV
const userSelect = [
 'IOC', 'Date', 'Country Code'
];

//Return the first line of the CSV file as an array
//INPUT: contents of entire CSV file
//OUTPUT: div = ['row1_col1', 'row1_col2', ..., 'row1_colN']
export function uiToCSV_titles(content){
  var str = content;
  var first = str.split('\n')[0];
  var div = first.split(',');
  return div;
};

//The following two unfilled functions are for filtering options to pass to the UI,
// which will be done after alpha release
export function uiToCSV_object2(content){
  var object = [];

  return object;
};

export function uiToCSV_object3(content){
  var object = [];

  return object;
};

//Returns first object for CSV --> 3DV
//USES GLOBAL: userSelect
export function parserTo3DV_object1(){

  var select1 = userSelect[0], 
      select2 = userSelect[1],
      select3 = userSelect[2];

  var type1 = "string", 
      type2 = "timestamp",
      type3 = "string";

  var text = '{"xColumn":{"title":"'+select1+'","type":"'+type1+'"},"yColumn":{"title":"'+select2+'","type":"'+type2+'"},"zColumn":{"title":"'+select3+'","type":"'+type3+'"}}';
  var object = JSON.parse(text);

  return object;
};

//Returns second object for CSV --> 3DV
//USES GLOBAL: userSelect
export function parserTo3DV_object2(content){
  var object = [];
  var text = '[';
  var contentArray = content.split('\n');
  var contentArrayLength = contentArray.length;

  var xTemp, xOffset = contentArray[0].split(',').indexOf(userSelect[0]);
  var yTemp, yOffset = contentArray[0].split(',').indexOf(userSelect[1]);
  var zTemp, zOffset = contentArray[0].split(',').indexOf(userSelect[2]);
  var textTemp = "";

  for (var i = 1; i < contentArrayLength; i++){
    //var subdataTemp = {};
    var rowArray = contentArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    var rowArrayLength = rowArray.length;

    //TODO: identify bad elements
    if(rowArray[0].indexOf('"') > -1){
      rowArray[0] = rowArray[0].substring(1, rowArray[0].length - 1);
    }

    xTemp = rowArray[xOffset], yTemp = rowArray[yOffset], zTemp = rowArray[zOffset];
    textTemp += '{"x":"'+xTemp+'","y":"'+yTemp+'","z":"'+zTemp+'"}';

    //TODO: subdata

    if(i != (contentArrayLength - 1)){
      textTemp += ",";
    }
  }
  
  text = text + textTemp + "]";
  object = JSON.parse(text);

  return text;
};
