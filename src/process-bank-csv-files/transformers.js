function extractData_(fileContent,fileName) {
  
  if (fileContent.length == 0) {
    return false;
  }
  const sheetLogs= new Sheet('Logs')
  
  const [bankName,date]=splitFileName_(fileName)

  const EXPECTED_HEADER=returnRightBankHeader_(bankName)
  
  const headerFromFile = fileContent[0];
  const [headerComparationArray,errors] = compareHeaders_(EXPECTED_HEADER,headerFromFile)
  
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

  
  createAndAddBankNameAndDateColumns_(newfileContent,date,bankName)
  removeCurrencySymbol_(newfileContent)

  sheetLogs.logFileInfo(fileName)
  return newfileContent[0].map((_,index)=>newfileContent.map(row=>row[index]))
}


function splitFileName_(fileName){
    return [fileName.split(' ')[0],fileName.split(' ')[1].split('.')[0]]
}

function createAndAddBankNameAndDateColumns_(newfileContent,date,bankName){
  const numberOfColumns=newfileContent[0].length;
  newfileContent.unshift(new Array(newfileContent[0].length).fill(bankName))
  newfileContent.unshift(new Array(newfileContent[0].length).fill(date))
}

function removeCurrencySymbol_(newfileContent){
  newfileContent[newfileContent.length-1].map((amount,i)=>{
    if(amount.includes('$')){
      newfileContent[newfileContent.length-1][i]=amount.split('$')[1]
    }else{
      return amount
    }
  })
}
function isChecked_(newFileContent){
  let newTableData=[]
  newFileContent.forEach((row,i)=>{
      if(row.includes('checked')){
      newTableData.push(row)
      }
  })
  return newTableData
}



