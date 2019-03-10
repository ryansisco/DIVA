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
function parserTo3DV_object_old(content){

  var select1 = userSelect[0], 
      select2 = userSelect[1],
      select3 = userSelect[2];

  var type1 = "string", 
      type2 = "timestamp/string",
      type3 = "string";

  var xIndices = [],
      yIndices = [],
      zIndices = [];

  var xMax = 0,
      yMax = 0,
      zMax = 0;

  var contentArray = content.split('\n');
  var contentArrayLength = contentArray.length;

  var xOffset = contentArray[0].split(',').indexOf(userSelect[0]);
  var yOffset = contentArray[0].split(',').indexOf(userSelect[1]);
  var zOffset = contentArray[0].split(',').indexOf(userSelect[2]);

  for(var i = 1; i < contentArrayLength; i++){
    var rowArray = contentArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if ( xIndices.indexOf(rowArray[xOffset]) == -1 ){
      xIndices.push(rowArray[xOffset]);
    }
    if ( yIndices.indexOf(rowArray[yOffset]) == -1 ){
      yIndices.push(rowArray[yOffset]);
    }
    if ( zIndices.indexOf(rowArray[zOffset]) == -1 ){
      zIndices.push(rowArray[zOffset]);
    }
  }

  var json1 = 
  { "xColumn": {
      "name": select1,
      "type": type1,
      "indexes": xIndices,
      "max": xIndices.length
    },
    "yColumn": {
      "name": select2,
      "type": type2,
      "indexes": yIndices,
      "max": yIndices.length
    },
    "zColumn": {
      "name": select3,
      "type": type3,
      "indexes": zIndices,
      "max": zIndices.length
    },

}

  return json1;
};

//Returns second object for CSV --> 3DV
//USES GLOBAL: userSelect
export function parserTo3DV_object(content, columns){



  var json1 = parserTo3DV_object_old(content);

  var object = [];
  var contentArray = content.split('\n');
  var contentArrayLength = contentArray.length;

  var xTemp, xOffset = contentArray[0].split(',').indexOf(userSelect[0]);
  var yTemp, yOffset = contentArray[0].split(',').indexOf(userSelect[1]);
  var zTemp, zOffset = contentArray[0].split(',').indexOf(userSelect[2]);
  var tempObjList = [];

  var xIndixes = json1["xColumn"]["indexes"];
  var yIndixes = json1["yColumn"]["indexes"];
  var zIndixes = json1["zColumn"]["indexes"];

  for (var i = 1; i < contentArrayLength; i++){
    var rowArray = contentArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    var rowArrayLength = rowArray.length;
    //TODO: identify bad elements
    if(rowArray[0].indexOf('"') > -1){
      rowArray[0] = rowArray[0].substring(1, rowArray[0].length - 1);
    }

    xTemp = xIndixes.indexOf(rowArray[xOffset]), 
    yTemp = yIndixes.indexOf(rowArray[yOffset]), 
    zTemp = zIndixes.indexOf(rowArray[zOffset]);

    if(xTemp == -1 || yTemp == -1 || zTemp == -1){
      continue;
    }

    var tempSubData = 
    {

    };

    var tempJson = 
    {
      "x": xTemp,
      "y": yTemp,
      "z": zTemp
    };

    tempObjList.push(tempJson);
    //TODO: subdata

  }

  var finalObject = {
    ...json1,
    "data": tempObjList
  }

  return finalObject;
};
