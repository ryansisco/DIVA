// ipSort
// input - array of potential IP addresses
// output - sorted array of IP addresses / non-IP addresses
// reference - https://gist.github.com/9point6/6988755
//             https://stackoverflow.com/questions/4460586/javascript-regular-expression-to-check-for-ip-addresses
function ipSort( ipAddressArray, order ) {
  // create a seperate array of strictly IP addresses
  var isIP = [], isNotIP = [], allElements = [];

  // separate IPs from not-IPs
  ipAddressArray.forEach(function(element) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(element))
      isIP.push(element)
    else
      isNotIP.push(element);
  });

  // sort IPs
  isIP.sort( function( a, b ) {
    a = a.split( '.' );
    b = b.split( '.' );
    for( var i = 0; i < a.length; i++ ) {
      if (( a[i] = parseInt( a[i] )) < ( b[i] = parseInt( b[i] )))
        return -1;
      else if (a[i] > b[i])
        return 1;
    }
    return 0;
  } );

  if (order === "Ascending"){
    allElements = isIP.concat(isNotIP.sort());
  }
  else if (order === "Descending"){
    allElements = ((isIP.sort()).reverse()).concat((isNotIP.sort()).reverse());
  }
  // return both arrays of IP addresses / non-IP addresses
  return allElements;
}

// getTitles
// input: content - CSV file content
// output: array of elements that make up the first row of CSV file
export function getTitles(content){
  // split the CSV file content by each newline
  const first = content.split('\n')[0];

  // return each element, split by commas
  return first.split(',');
};

// getRows 
// input: content - CSV file content
//        title - title of CSV column, example: "IOC"
// output: array of unique elements belonging to the specified column
export function getRows(content, title){
  // initialize array of CSV file content
  const contentArray = content.split('\n');
  const titleRow = contentArray[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

  // initialize output array
  var checkboxArray = [];

  // obtain offset of 'title' string within the first row of CSV file
  const offset = titleRow.indexOf(title)

  // check if 'title' input exists in the first row of CSV content
  if (offset === -1)
    return []; // return an empty array if offset is non-existent

  // loop through every row in the CSV file, adding unique elements to output array
  for(let i = 1; i < contentArray.length; i++){
    let rowArray = contentArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    
    // test for empty lines
    var emptyTest = rowArray.filter(Boolean);
    if (emptyTest.length === 0)
      continue;

    // obtain single column element of the given row
    var rowElement = rowArray[offset];

    // re-format IP addresses, if applicable
    // example: "192,168,1,1" --> 192.168.1.1
    if(rowElement.indexOf(",") != -1)
      rowElement = rowElement.replace(/,/g, ".");
    if(rowElement.indexOf("\"") != -1)
      rowElement = rowElement.replace(/\"/g, "");

    // add element to output array if it doesn't already exist
    if (checkboxArray.indexOf(rowElement) === -1){
      checkboxArray.push(rowElement);
    }
  }

  // remove any empty strings from the array
  checkboxArray = checkboxArray.filter(Boolean);

  // return the output array after being sorted
  return checkboxArray.sort();
};

// getTypes
// input: content - CSV file content
//        offsets - 
// output: 
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

// sortData
// input: indices - 
//        data - 
//        order - 
// output: return indices and data, both sorted in user-given order
function sortData(indices, data, order, axis){
  // initialize sorted indices array
  var sortedIndices = [], ip = [], nonIP = [];

  // sort indices into ascending/descending order
  sortedIndices = ipSort(indices, order);

  var currentIndex, newIndex;
  var tempData, newData = []

  data.forEach(function(element) {
    currentIndex = element[axis];
    newIndex = sortedIndices.indexOf(indices[currentIndex]);

    if (newIndex > 0){
    tempData = element;
    tempData[axis] = newIndex;
    newData.push(tempData);
    }
    
  });


  var returnData = [];
  returnData["sortedIndices"] = sortedIndices;
  returnData["newData"] = newData;
  return returnData;

}


//Returns second object for CSV --> 3DV
//USES GLOBAL: userSelect
export function get3dvObjectSort(content, columns, sortingObject) {
  //Define sorting/filtering variables

  //create a filter object based off the sort object
  var filter = {
    x: sortingObject["x_filter"],
    y: sortingObject["y_filter"],
    z: sortingObject["z_filter"]
  };

  var sort = {
    x: sortingObject["x_sort"],
    y: sortingObject["y_sort"],
    z: sortingObject["z_sort"]
  }
  //create an object to hold strings to compare to filter data
  var strChanges = { x: "", y: "", z: "" }; 


  const contentArray = content.split('\n'); //split the array into lines

  var indices = { x: [], y: [], z: [] }; //create the indices arrays

  const offsets = { //create the column offsets for the user chosen axes
    x: contentArray[0].split(',').indexOf(columns.x),
    y: contentArray[0].split(',').indexOf(columns.y),
    z: contentArray[0].split(',').indexOf(columns.z)
  };

  const types = getTypes(content, offsets); //get the type of each column

  //add the max/min arrays
  const maximums = { x: null, y: null, z: null };
  const minimums = { x: null, y: null, z: null };
  
  var data = []; //initialize the data array

  for(let i = 1; i < contentArray.length; i++){ //for each line in the CSV file...
    let rowArray = contentArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); //split by commas
    const tempVals = {x: null, y: null, z: null}; //create a temp {x,y,z} object

    if ((rowArray.filter(Boolean)).length === 0)
      continue;

    Object.keys(indices).map(key => {

      //Strip off any beginning/end double-quotes and replace "," with "."
      strChanges[key] = rowArray[offsets[key]];
      if(strChanges[key].indexOf("\"") > 0){
        strChanges[key] = strChanges[key].replace(/['"]+/g, '');
      }
      if(strChanges[key].indexOf(",") > 0){
        strChanges[key] = strChanges[key].replace(",", ".");
      }

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
        postStr = postStr.replace(/,/g, ".");

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

  var tempSortReturn;
  if (sort["x"] != "Original"){
    tempSortReturn = sortData(indices.x, data, sort["x"], "x");
    indices.x = tempSortReturn["sortedIndices"];
    data = tempSortReturn["newData"];
  }
  else if (sort["y"] != "Original"){
    tempSortReturn = sortData(indices.y, data, sort["y"], "y");
    indices.y = tempSortReturn["sortedIndices"];
    data = tempSortReturn["newData"];
  }
  else if (sort["z"] != "Original"){
    tempSortReturn = sortData(indices.z, data, sort["z"], "z");
    indices.z = tempSortReturn["sortedIndices"];
    data = tempSortReturn["newData"];
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

  return finalObject;
};


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

  return finalObject;
};
