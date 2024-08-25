//https://script.google.com/macros/s/AKfycbwQyaR1pi5RZzZOpWkyO4MFuonJsKMvV7knpQFM5N_-C4g6n7kHVwNmAHojMWQj4102xw/exec

function doGet() {
  const sheet = SpreadsheetApp.openById('1FGH3E5nkT5FoSEEp7CqHgWkeg_GaKJpkkJS_0_LaESc').getSheetByName('image');
  const data = sheet.getDataRange().getValues();

  const points = data.slice(1).map(row => {
    const coordinates = parseWKT(row[0]);
    return {
      lat: coordinates[1],
      lon: coordinates[0],
      path: row[2]  // 画像のパスを3列目から取得
    };
  });

  return ContentService.createTextOutput(JSON.stringify(points)).setMimeType(ContentService.MimeType.JSON);
}


// WKTをGeoJSONの座標配列に変換する関数
function parseWKT(wkt) {
  Logger.log("Parsing WKT: " + wkt);

  // "POINT(" または "POINT (" の部分を取り除き、座標部分を取得
  const coordsStr = wkt.replace(/POINT\s*\(/, '').replace(')', '').trim();

  // 座標の緯度と経度を数値に変換
  const [lng, lat] = coordsStr.split(' ').map(Number);

  if (isNaN(lng) || isNaN(lat)) {
    throw new Error("Invalid coordinates: " + coordsStr);
  }

  // GeoJSON形式で座標を返す
  return [lng, lat];
}
