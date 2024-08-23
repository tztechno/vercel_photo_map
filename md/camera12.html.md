<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>カメラ操作と日時・位置情報付き写真保存</title>
</head>

<body>
    <h1>カメラ操作と日時・位置情報付き写真保存</h1>
    <button id="startButton">カメラを起動</button>
    <button id="captureButton" disabled>写真を撮影</button>
    <button id="stopButton" disabled>カメラを切断</button>
    <button id="sendButton" disabled>写真を選択・送信</button>
    <video id="video" width="640" height="480" autoplay></video>
    <canvas id="canvas" width="640" height="480" style="display: none;"></canvas>

    <script>
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const startButton = document.getElementById('startButton');
        const captureButton = document.getElementById('captureButton');
        const stopButton = document.getElementById('stopButton');
        const sendButton = document.getElementById('sendButton');

        let stream;
        let latitude = null;
        let longitude = null;
        let latestDataURL = null;
        let latestFileName = null;

        // 位置情報を取得
        navigator.geolocation.getCurrentPosition(
            (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
            },
            (error) => {
                console.error('位置情報の取得に失敗しました:', error);
            }
        );

        startButton.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                captureButton.disabled = false;
                stopButton.disabled = false;
            } catch (error) {
                console.error('カメラの起動に失敗しました:', error);
            }
        });

        captureButton.addEventListener('click', () => {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 画像を圧縮してDataURLに変換
            latestDataURL = canvas.toDataURL('image/png', 0.3);

            // 現在の日付を取得してフォーマット（時間部分を除く）
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');

            // ファイル名に日付と位置情報を追加
            latestFileName = `photo_${dateStr}`;
            if (latitude !== null && longitude !== null) {
                latestFileName += `_lat${latitude.toFixed(6)}_lon${longitude.toFixed(6)}`;
            }
            latestFileName += '.png';

            sendButton.disabled = false;
        });

        sendButton.addEventListener('click', () => {
            const webAppUrl = 'https://script.google.com/macros/s/AKfycbwRpJCDekKPs6q0r4_GYPTvfMRzgspvpDp1wYLIkLZqQERzqG9ALoKpy2asaepvNevYsg/exec';

            const canvas = document.getElementById('canvas');
            const fileName = 'uploaded_image.png'; // 送信するファイル名
            const dataURL = canvas.toDataURL('image/png'); // 画像データをBase64形式で取得
            const base64Data = dataURL.split(',')[1]; // "data:image/png;base64,"の部分を除去

            const postData = JSON.stringify({
                content: base64Data,
                fileName: fileName
            });

            fetch(webAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: postData
            })
                .then(response => response.json())
                .then(data => {
                    console.log('File uploaded successfully:', data.url);
                    alert('File uploaded successfully');
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error uploading file');
                });
        });


        stopButton.addEventListener('click', () => {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
            captureButton.disabled = true;
            sendButton.disabled = true;
            stopButton.disabled = true;
        });
    
    </script>
</body>

</html>