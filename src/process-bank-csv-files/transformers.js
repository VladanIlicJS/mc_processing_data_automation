function extractData_(fileContent,fileName) {
  
  if (fileContent.length == 0) {
    return false;
  }
  const sheetLogs= new Sheet('Logs')
  
  const [bankName,date]=splitFileName(fileName)

  const EXPECTED_HEADER=returnRightBankHeader(bankName)
  
  const headerFromFile = fileContent[0];
  const [headerComparationArray,errors] = compareHeaders(EXPECTED_HEADER,headerFromFile)
  
  let newfileContent=[]


  if (headerComparationArray.includes(false)){
    sheetLogs.logFileInfo(fileName,"False",errors)
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

  
  createAndAddBankNameAndDateColumns(newfileContent,date,bankName)
  removeCurrencySymbol(newfileContent)

  sheetLogs.logFileInfo(fileName)
  return newfileContent[0].map((_,index)=>newfileContent.map(row=>row[index]))
}


function splitFileName(fileName){
    return [fileName.split(' ')[0],fileName.split(' ')[1].split('.')[0]]
}

function createAndAddBankNameAndDateColumns(newfileContent,date,bankName){
  const numberOfColumns=newfileContent[0].length;
  newfileContent.unshift(new Array(newfileContent[0].length).fill(bankName))
  newfileContent.unshift(new Array(newfileContent[0].length).fill(date))
}

function removeCurrencySymbol(newfileContent){
  newfileContent[newfileContent.length-1].map((amount,i)=>{
    if(amount.includes('$')){
      newfileContent[newfileContent.length-1][i]=amount.split('$')[1]
    }else{
      return amount
    }
  })
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



