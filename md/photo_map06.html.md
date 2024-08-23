<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Map with Geolocation and Image Markers</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <style>
        body,
        html {
            height: 100%;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
        }

        #map {
            flex-grow: 1;
            width: 100%;
        }

        #controls {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1000;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 5px;
            border-radius: 5px;
        }

        button {
            padding: 5px 10px;
            font-size: 14px;
            margin: 2px;
        }

        #position_view {
            position: absolute;
            bottom: 10px;
            left: 10px;
            z-index: 1000;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 5px;
            border-radius: 5px;
            font-size: 12px;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        #loadingMessage {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2000;
            background-color: rgba(255, 255, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>

<body>
    <div id="map"></div>
    <div id="controls">
        <button onclick="stopTracking()" aria-label="Stop tracking location">Stop Tracking</button>
        <button onclick="summarize()" aria-label="Summarize location data">Summarize</button>
        <button onclick="getPoints()" aria-label="Get all location points">Get Points</button>
    </div>
    <div id="loadingMessage">処理中...</div>
    <div id="position_view"></div>

    <script>
        var watch_id;
        var lat0 = 35.6895;
        var lon0 = 139.6917;
        var map;
        var currentMarker;

        var webAppUrl2 = 'https://script.google.com/macros/s/AKfycbxturkakiIhqMY-KSsFTYvGWrH7X1dH_QoU8oTljD7vh8j0wvywF3llIcELVzS0yeyuTA/exec';

        function startTracking() {
            watch_id = navigator.geolocation.watchPosition(
                updatePosition,
                handleLocationError,
                { "enableHighAccuracy": true, "timeout": 20000, "maximumAge": 5000 }
            );
        }

        function stopTracking() {
            if (watch_id) {
                navigator.geolocation.clearWatch(watch_id);
                watch_id = null;
            }
        }

        function handleLocationError(error) {
            let errorMessage;
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "位置情報の利用が許可されていません。";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "位置情報が取得できません。";
                    break;
                case error.TIMEOUT:
                    errorMessage = "位置情報の取得がタイムアウトしました。";
                    break;
                default:
                    errorMessage = "位置情報の取得中にエラーが発生しました。";
            }
            alert(errorMessage);
        }

        function updatePosition(position) {
            lat0 = position.coords.latitude;
            lon0 = position.coords.longitude;

            var geo_text = `緯度: ${lat0.toFixed(6)}, 経度: ${lon0.toFixed(6)}`;
            document.getElementById('position_view').innerText = geo_text;

            if (!map) {
                map = L.map('map').setView([lat0, lon0], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
            } else {
                map.setView([lat0, lon0]);
            }

            if (currentMarker) {
                map.removeLayer(currentMarker);
            }
            currentMarker = L.marker([lat0, lon0]).addTo(map)
                .bindPopup("<b>HERE!</b>")
                .openPopup();
        }

        function getPoints() {
            document.getElementById('loadingMessage').style.display = 'block';

            fetch(webAppUrl2)
                .then(response => response.json())
                .then(data => {
                    data.forEach(point => {
                        var marker = L.marker([point.lat, point.lon], {
                            icon: L.icon({
                                iconUrl: point.path, // 3列目のパスを使用
                                iconSize: [32, 32],  // アイコンのサイズ
                                iconAnchor: [16, 32], // アンカーの位置
                                popupAnchor: [0, -32] // ポップアップのアンカー位置
                            })
                        }).addTo(map);

                        marker.on('click', function () {
                            window.open(point.path, '_blank'); // クリックで画像を新しいウィンドウで開く
                        });
                    });
                    document.getElementById('loadingMessage').style.display = 'none';
                })
                .catch(error => {
                    console.error('Error fetching the data:', error);
                    document.getElementById('loadingMessage').style.display = 'none';
                    alert('データの取得中にエラーが発生しました。後ほど再試行してください。');
                });
        }

        document.addEventListener("DOMContentLoaded", function () {
            startTracking();
        });
    </script>
</body>

</html>