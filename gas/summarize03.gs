function doGet() {
  try {
    summarizeCsvDataToSheet();
    return ContentService.createTextOutput('処理が完了しました。');
  } catch (error) {
    return ContentService.createTextOutput('エラーが発生しました: ' + error.toString());
  }
}

function summarizeCsvDataToSheet() {
  const folderId = '1TcMC3ONutNpbq0KoNcXlljTqm4a_5oEV';
  const spreadsheetId = '1FGH3E5nkT5FoSEEp7CqHgWkeg_GaKJpkkJS_0_LaESc';
  const sheetName = 'image';

  let sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  if (!sheet) {
    sheet = SpreadsheetApp.openById(spreadsheetId).insertSheet(sheetName);
  }
  sheet.clear();
  sheet.appendRow(['WKT', 'time', 'path']);

  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFilesByType(MimeType.JPEG);
  const batchSize = 50;
  let fileArray = [];
  let dataToAppend = [];

  while (files.hasNext()) {
    fileArray.push(files.next());
    if (fileArray.length === batchSize) {
      dataToAppend = dataToAppend.concat(processFiles(fileArray));
      fileArray = [];
    }
  }

  if (fileArray.length > 0) {
    dataToAppend = dataToAppend.concat(processFiles(fileArray));
  }

  if (dataToAppend.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, dataToAppend.length, dataToAppend[0].length).setValues(dataToAppend);
  }

  Logger.log('処理が完了しました。');
}

function processFiles(files) {
  let processedData = [];
  files.forEach(file => {
    try {
      const fileName = file.getName();
      const regex = /(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})_([-\d.]+)_([-\d.]+)\.jpg/i;
      const match = fileName.match(regex);

      if (match) {
        const time = match[1].replace(/-/g, ':').replace('T', ' ');
        const lat = match[2];
        const lon = match[3];
        const point = `POINT(${lon} ${lat})`;
        const path = `https://drive.google.com/uc?export=view&id=${file.getId()}`;

        processedData.push([point, time, path]);
      } else {
        Logger.log(`ファイル名が正しくありません: ${fileName}`);
      }
    } catch (error) {
      Logger.log(`ファイル処理中にエラーが発生しました: ${file.getName()}, エラー: ${error.toString()}`);
    }
  });
  return processedData;
}