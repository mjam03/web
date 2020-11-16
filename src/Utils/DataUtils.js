import { readRemoteFile } from 'react-papaparse'

/*
Plain javascript functions
Used to help manipulate and load data from various sources
Helpful when deving and need to e.g. manipulate local data
*/

export function loadLocalCsv(filePath, callBack) {
	/*
	* Function to load local csv file into object
	* {filePath} is a string relative path - note data must be in 'public', not 'src'
	* {callBack} is a function to operate on the object e.g. just return it
	* callBack usually is a setState function to set state on calling component
	*/
  readRemoteFile(filePath,
    // pass a object of settings so headers are keys, types are picked up
    // complete is a function to call on the returned data
    // this is where we call our callback function
    // all this is required as the data is parsed asynchronously
    {
      header: true,
      dynamicTyping: true,
      complete: function (res) {
        callBack(res.data);
      }
    });
};