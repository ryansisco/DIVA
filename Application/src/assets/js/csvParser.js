//Return the first line of the CSV file as an array
//INPUT: contents of entire CSV file
//OUTPUT: div = ['row1_col1', 'row1_col2', ..., 'row1_colN']
export function getTitles(content){
  const first = content.split('\n')[0];
  return first.split(',');
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

//Returns second object for CSV --> 3DV
//USES GLOBAL: userSelect
export function get3dvObject(content, columns) {

  const contentArray = content.split('\n');

  const indices = { x: [], y: [], z: [] };

  const offsets = {
    x: contentArray[0].split(',').indexOf(columns.x),
    y: contentArray[0].split(',').indexOf(columns.y),
    z: contentArray[0].split(',').indexOf(columns.z)
  };

  const types = getTypes(content, offsets);

  const maximums = { x: null, y: null, z: null };
  const minimums = { x: null, y: null, z: null };
  
  const data = [];

  for(let i = 1; i < contentArray.length; i++){
    let rowArray = contentArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const tempVals = {x: null, y: null, z: null};
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
