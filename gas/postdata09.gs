function doGet() {
  return HtmlService.createHtmlOutputFromFile('form.html')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function uploadFileToDrive(data, fileName) {
  var folder = DriveApp.getFolderById('1TcMC3ONutNpbq0KoNcXlljTqm4a_5oEV');  // フォルダIDを指定
  var contentType = data.substring(5, data.indexOf(';'));
  var bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,') + 7));
  var blob = Utilities.newBlob(bytes, contentType, fileName);
  var file = folder.createFile(blob);
  return file.getUrl();
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var fileUrl = uploadFileToDrive(data.data, data.fileName);
  return ContentService.createTextOutput(fileUrl);
}