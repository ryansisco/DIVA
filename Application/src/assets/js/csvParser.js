//Return the first line of the CSV file as an array
//INPUT: contents of entire CSV file
//OUTPUT: div = ['row1_col1', 'row1_col2', ..., 'row1_colN']
export function getTitles(content){
  const first = content.split('\n')[0];
  return first.split(',');
};

export function getRows(content, title){

  const contentArray = content.split('\n');
  const titleRow = contentArray[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  const offset = titleRow.indexOf(title)

  var checkboxArray = [];

  if (offset === -1)
    return [];

  for(let i = 1; i < contentArray.length; i++){
    let rowArray = contentArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    var rowElement = rowArray[offset];
    // var fixedRowElement = rowElement.replace(/['"]+/g, '');
    // fixedRowElement = fixedRowElement.replace(",", ".");

    if (checkboxArray.indexOf(rowElement) === -1){
      checkboxArray.push(rowElement);
    }

  }

  return checkboxArray.sort();
};


function getTypes(content, offsets) {
  const firstDataRow = content.split('\n')[2];
  const firstDataArr = firstDataRow.split(',');
  const types = {};

  //for the column values, test what type each is. Could be string, date, or number
  Object.entries(offsets).map(offset => {
    if (Date.parse(firstDataArr[offset[1]]))
      types[offset[0]] = 'date';
    else if (!isNaN(firstDataArr[offset[1]]))
      types[offset[0]] = 'number';
    else
      types[offset[0]] = 'string';
  });

  return types;
}

////////////////////// NEW SORT / FILTER //////////

//Returns second object for CSV --> 3DV
//USES GLOBAL: userSelect
export function get3dvObjectSort(content, columns) {
  //Define sorting/filtering variables
  //example sorting object
  var sortingObject = {
    "x": "IOC",
    "x_sort": "original",
    "x_filter": ["123.123.123.123", "456.456.456.456"],
    "y": "Date",
    "y_sort": "original",
    "y_filter": [],
    "z": "Country Code",
    "z_sort": "ascending",
    "z_filter": ["AU", "US"]
  };
  //create a filter object based off the sort object
  var filter = {
    x: sortingObject["x_filter"],
    y: sortingObject["y_filter"],
    z: sortingObject["z_filter"]
  };
  //create an object to hold strings to compare to filter data
  var strChanges = { x: "", y: "", z: "" }; 


  const contentArray = content.split('\n'); //split the array into lines

  const indices = { x: [], y: [], z: [] }; //create the indices arrays

  const offsets = { //create the column offsets for the user chosen axes
    x: contentArray[0].split(',').indexOf(columns.x),
    y: contentArray[0].split(',').indexOf(columns.y),
    z: contentArray[0].split(',').indexOf(columns.z)
  };

  const types = getTypes(content, offsets); //get the type of each column

  //add the max/min arrays
  const maximums = { x: null, y: null, z: null };
  const minimums = { x: null, y: null, z: null };
  
  const data = []; //initialize the data array

  for(let i = 1; i < contentArray.length; i++){ //for each line in the CSV file...
    let rowArray = contentArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); //split by commas
    const tempVals = {x: null, y: null, z: null}; //create a temp {x,y,z} object
    Object.keys(indices).map(key => {

      //Strip off any beginning/end double-quotes and replace "," with "."
      strChanges[key] = rowArray[offsets[key]];
      strChanges[key] = strChanges[key].replace(/['"]+/g, '');
      strChanges[key] = strChanges[key].replace(",", ".");

      if (types[key] === 'date') {
        const val = Date.parse(rowArray[offsets[key]]);
        tempVals[key] = val;
        if (val > maximums[key] || !maximums[key])
          maximums[key] = val;
        else if (val < minimums[key] || ! minimums[key])
          minimums[key] = val;
      }

      else if (types[key] === 'number') {
        const val = rowArray[offsets[key]];
        tempVals[key] = val;
        if (val > maximums[key] || !maximums[key])
          maximums[key] = val;
        else if (val < minimums[key] || ! minimums[key])
          minimums[key] = val;
      }

      else {
        //Strip off any beginning/end double-quotes and replace "," with "."
        // .... to single variable
        var preStr = rowArray[offsets[key]];
        var postStr = preStr.replace(/['"]+/g, '');
        postStr = postStr.replace(",", ".");

        //set start max and mins
        if (!maximums[key] && !minimums[key]) {
          maximums[key] = 0;
          minimums[key] = 0;
        }

        const existingIndex = indices[key].indexOf(postStr);

        if (existingIndex === -1) {

          indices[key].push(postStr);
          maximums[key]++;
          tempVals[key] = maximums[key];
        } else {
          tempVals[key] = existingIndex;
        }
      }

    });
    
    //if the data from csv doesn't exist within filter information, don't plot it
    if( filter["x"].indexOf(strChanges["x"]) === -1 && filter["y"].indexOf(strChanges["y"]) == -1 && filter["z"].indexOf(strChanges["z"]) == -1){
      continue;
    }

    //if any elements are missing in the user's chosen columns, skip the data point
    if(tempVals.x === -1 || tempVals.y === -1 || tempVals.z === -1){
      continue;
    }

    //TODO: subdata

    data.push(tempVals);
  }

    //TODO: sort based off of sorting object


  const finalObject = {
    xColumn: {
      name: columns.x,
      type: types.x,
      indices: indices.x,
      max: maximums.x,
      min: minimums.x
    },
    yColumn: {
      name: columns.y,
      type: types.y,
      indices: indices.y,
      max: maximums.y,
      min: minimums.y
    },
    zColumn: {
      name: columns.z,
      type: types.z,
      indices: indices.z,
      max: maximums.z,
      min: minimums.z
    },
    data
  }

  console.log(finalObject);
  return finalObject;
};



////////////////////////////////////////////////////

//Returns second object for CSV --> 3DV
//USES GLOBAL: userSelect
export function get3dvObject(content, columns) {

  const contentArray = content.split('\n'); //split the array into lines

  const indices = { x: [], y: [], z: [] }; //create the indices arrays

  const offsets = { //create the column offsets for the user chosen axes
    x: contentArray[0].split(',').indexOf(columns.x),
    y: contentArray[0].split(',').indexOf(columns.y),
    z: contentArray[0].split(',').indexOf(columns.z)
  };

  const types = getTypes(content, offsets); //get the type of each column

  //add the max/min arrays
  const maximums = { x: null, y: null, z: null };
  const minimums = { x: null, y: null, z: null };
  
  const data = []; //initialize the data array

  for(let i = 1; i < contentArray.length; i++){ //for each line in the CSV file...
    let rowArray = contentArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); //split by commas
    const tempVals = {x: null, y: null, z: null}; //create a temp {x,y,z} object
    Object.keys(indices).map(key => {
      if (types[key] === 'date') {
        const val = Date.parse(rowArray[offsets[key]]);
        tempVals[key] = val;
        if (val > maximums[key] || !maximums[key])
          maximums[key] = val;
        else if (val < minimums[key] || ! minimums[key])
          minimums[key] = val;
      }

      else if (types[key] === 'number') {
        const val = rowArray[offsets[key]];
        tempVals[key] = val;
        if (val > maximums[key] || !maximums[key])
          maximums[key] = val;
        else if (val < minimums[key] || ! minimums[key])
          minimums[key] = val;
      }

      else {
        //set start max and mins
        if (!maximums[key] && !minimums[key]) {
          maximums[key] = 0;
          minimums[key] = 0;
        }

        const existingIndex = indices[key].indexOf(rowArray[offsets[key]]);

        if (existingIndex === -1) {
          indices[key].push(rowArray[offsets[key]]);
          maximums[key]++;
          tempVals[key] = maximums[key];
        } else {
          tempVals[key] = existingIndex;
        }
      }
    });
    

    //if any elements are missing in the user's chosen columns, skip the data point
    if(tempVals.x === -1 || tempVals.y === -1 || tempVals.z === -1){
      continue;
    }

    //TODO: subdata

    data.push(tempVals);
  }

  const finalObject = {
    xColumn: {
      name: columns.x,
      type: types.x,
      indices: indices.x,
      max: maximums.x,
      min: minimums.x
    },
    yColumn: {
      name: columns.y,
      type: types.y,
      indices: indices.y,
      max: maximums.y,
      min: minimums.y
    },
    zColumn: {
      name: columns.z,
      type: types.z,
      indices: indices.z,
      max: maximums.z,
      min: minimums.z
    },
    data
  }

  console.log(finalObject)
  return finalObject;
};
