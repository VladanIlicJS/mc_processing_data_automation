class Drive {
  constructor(id) {
    this.folder = DriveApp.getFolderById(id)
  }

  prepareSubfolders(SUBFOLDERS_NAMES) {
    let subFolders = {}

    for (let FOLDER_NAME in SUBFOLDERS_NAMES) {
      subFolders[SUBFOLDERS_NAMES[FOLDER_NAME]] = this.createSubfolderIfDoesntExist(SUBFOLDERS_NAMES[FOLDER_NAME])
    }
    return subFolders
  }

  createSubfolderIfDoesntExist(subfolderName) {
    const subFolderIter = this.folder.getFoldersByName(subfolderName)

    if (!subFolderIter.hasNext()) {
      return this.folder.createFolder(subfolderName)
    } else {
      return this.folder.getFoldersByName(subfolderName).next()
    }
  }

  numberOfFilesInsideFolder() {
    const fileIter = this.folder.getFiles()
    let i = 0
    while (fileIter.hasNext()) {
      i++
      fileIter.next()
    }
    return i
  }
}
