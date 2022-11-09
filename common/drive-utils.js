
//Creating folders. Two funcions -> prepareSubfolders and createSubfolderIfDoesntExist

function prepareSubfolders_(parentFolder, SUBFOLDERS_NAMES) {

  let subFolders={}

  for (let FOLDER_NAME in SUBFOLDERS_NAMES) {
      subFolders[SUBFOLDERS_NAMES[FOLDER_NAME]]=createSubfolderIfDoesntExist_(
        parentFolder,
        SUBFOLDERS_NAMES[FOLDER_NAME] 
    );
  }
  
  return subFolders
}

function createSubfolderIfDoesntExist_(parentFolder, subfolderName) {
  const subFolderIter = parentFolder.getFoldersByName(subfolderName);

  if (!subFolderIter.hasNext()) {
    return parentFolder.createFolder(subfolderName);
  }else{
    return parentFolder.getFoldersByName(subfolderName).next()
  }
}


//Extracting csv data from file
function readCsvFileContent_(file) {
  return Utilities.parseCsv(file.getBlob().getDataAsString());
}
