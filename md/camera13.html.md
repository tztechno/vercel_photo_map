<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>カメラ操作と自動保存</title>
</head>

<body>
    <h1>カメラ操作とファイル送信</h1>
    <button id="startButton">カメラを起動</button>
    <button id="captureButton" disabled>写真を撮影</button>
    <input type="file" id="fileInput" accept="image/*" style="display: none;">
    <button id="sendButton" disabled>写真を送信</button>
    <button id="stopButton" disabled>カメラを切断</button>
    <video id="video" width="640" height="480" autoplay></video>
    <canvas id="canvas" width="640" height="480" style="display: none;"></canvas>

    <script>
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const startButton = document.getElementById('startButton');
        const captureButton = document.getElementById('captureButton');
        const sendButton = document.getElementById('sendButton');
        const stopButton = document.getElementById('stopButton');
        const fileInput = document.getElementById('fileInput');

        let stream;
        let latestFile = null;

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

            // 画像をファイルとして保存
            canvas.toBlob((blob) => {
                latestFile = new File([blob], 'captured_image.png', { type: 'image/png' });
                sendButton.disabled = false; // ファイルが準備できたら送信ボタンを有効にする
            }, 'image/png');
        });

        sendButton.addEventListener('click', () => {
            if (latestFile) {
                const formData = new FormData();
                formData.append('file', latestFile);

                const webAppUrl = 'https://script.google.com/macros/s/AKfycbzPGotskOuYWQxuDymGkS2bkOwSg2y4NOyxtadzV7Jitmye6Fafmlrd2KadRWH4_QY0Jg/exec'; // 実際のURLに置き換えてください

                fetch(webAppUrl, {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.text())
                    .then(result => {
                        console.log('写真が送信されました:', result);
                        alert('写真が送信されました');
                    })
                    .catch(error => {
                        console.error('写真の送信に失敗しました:', error);
                        alert('写真の送信に失敗しました');
                    });
            }
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
