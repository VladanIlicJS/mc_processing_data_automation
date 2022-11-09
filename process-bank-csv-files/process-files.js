
const FOLDER_ID = "1ZVynKoCEjSzqYjkWUdOeocSvjoIRGdTR";
const SUBFOLDERS_NAMES = {
  PROCESSED_FOLDER_NAME: "_Processed",
  REJECTED_FOLDER_NAME: "_Rejected",
};


function processBankCsvFiles() {

  const folder = DriveApp.getFolderById(FOLDER_ID); 
  const subfolders=prepareSubfolders_(folder, SUBFOLDERS_NAMES);

  let processCount = 0;
  let rejectedCount = 0;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Checks");

  const fileIter = folder.getFiles();
  const fileCount=filesCount(folder.getFiles())
  ss.getSheetByName('Logs').appendRow([new Date(),"Files processing started",`Files found ${fileCount}`])

  while (fileIter.hasNext()) {


    const file = fileIter.next();
    const fileName=file.getName()
    const fileContent = readCsvFileContent_(file);

    let newFileContent=extractData_(fileContent,fileName)

    if (newFileContent) {
      newFileContent.shift();

      newFileContent=isChecked(newFileContent)

      if (newFileContent.length > 0) {
        sheet.getRange(sheet.getLastRow() + 1, 1, newFileContent.length, newFileContent[0].length).setValues(newFileContent);
      }
      processCount++;
      if (environment.moveToProcessed) {
        file.moveTo(subfolders[SUBFOLDERS_NAMES.PROCESSED_FOLDER_NAME]);
      }
    } else {
      rejectedCount++;
      if (environment.moveToRejected) {
        file.moveTo(subfolders[SUBFOLDERS_NAMES.REJECTED_FOLDER_NAME]);
      }
    }
  }
  ss.getSheetByName('Logs').appendRow([new Date(),"Files processing ended",`successful files processed:${processCount} Failure files:${rejectedCount}`])
  //sendProcessedBankCsvFilesReport_(processCount,rejectedCount)

}



function extractData_(fileContent,fileName) {
  

  
  if (fileContent.length == 0) {
    return false;
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetLogs=ss.getSheetByName("Logs")
  
  const [bankName,date]=[fileName.split(' ')[0],fileName.split(' ')[1].split('.')[0]]


  EXPECTED_HEADER=returnRightBankHeaders(bankName)
  
  
  const headerFromFile = fileContent[0];
  let errors=[]

  array = EXPECTED_HEADER.map(header=>{
    if(headerFromFile.includes(header)){
      return true
    }else{
      errors.push(header)
      return false
    }
  })

  
  let newfileContent=[]
  let bankNameAndDateColumns=[]

  if (array.includes(false)){
    logFileInfo(sheetLogs,fileName,"FALSE",`${errors.length>1 ? `Columns ${errors.map(error=>`${error }`)} not found`: `Column ${errors[0]} not found`}`)
    return false
  }else{
    const fileContentTransposed = fileContent[0].map((_, colIndex) => fileContent.map(row => row[colIndex]))
    for (let i = 0; i<fileContentTransposed.length;i++){
      if(EXPECTED_HEADER.includes(fileContentTransposed[i][0])){
        const index=EXPECTED_HEADER.indexOf(fileContentTransposed[i][0])
        newfileContent[index]=fileContentTransposed[i]
      }
    }
  }
  const dateArray=new Array(newfileContent[0].length).fill(date)
  bankNameAndDateColumns.push(dateArray)

  const bankNameArray=new Array(newfileContent[0].length).fill(bankName)
  bankNameAndDateColumns.push(bankNameArray)

  newfileContent.unshift(bankNameAndDateColumns[1])
  newfileContent.unshift(bankNameAndDateColumns[0])
  newfileContent[newfileContent.length-1]=newfileContent[newfileContent.length-1].map((amount,i)=>{
    if(amount.includes('$')){
      return amount.split('$')[1]
    }else{
      return amount
    }

  })

  logFileInfo(sheetLogs,fileName,"TRUE")
  return newfileContent=newfileContent[0].map((_,index)=>newfileContent.map(row=>row[index]))
}


function isChecked(newFileContent){
  let newTableData=[]
  newFileContent.forEach((row,i)=>{
    if(row.includes('checked')){
      newTableData.push(row)
    }
  })
  return newTableData
}

function filesCount(fileIter){
  let i=0
  while(fileIter.hasNext()){
    i++
    fileIter.next()
  }
  return i
}


function returnRightBankHeaders(bankName){
  if(bankName=='Intesa'){
    return INTESA_HEADER
  }
  if(bankName=='OTP'){
    return OTP_HEADER
  }
  if(bankName=='Kombank'){
    return KOMBANK_HEADER
  }
  if(bankName=='Unicredit'){
    return UNICREDIT_HEADER
  }
}
function logFileInfo(sheet,fileName,success, error=""){

  const row=[new Date(),"Processing file",fileName,success,error]

  sheet.appendRow(row)


}


/**
 * Sending report
 */

function sendProcessedBankCsvFilesReport_(processCount,rejectedCount){
  
    const recipient = "vladanilic017@gmail.com";
    const subject = "Results";
    const body = `Processed files: ${processCount} \r\nRejected files: ${rejectedCount}`;
    
    sendEmail_(recipient, subject, body)

}

function sendEmail_(recipient, subject, body) {
  if (environment.createDraft) {
    GmailApp.createDraft(recipient, subject, body);
  } else {
    GmailApp.sendEmail(recipient, subject, body);
  }
}




