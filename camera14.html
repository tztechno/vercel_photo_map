<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>カメラ操作とファイル送信</title>
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
        let latestFileURL = null;

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

            // 画像をBase64形式で保存
            const dataURL = canvas.toDataURL('image/png');
            // データURLをBlobに変換
            fetch(dataURL)
                .then(res => res.blob())
                .then(blob => {
                    // BlobをURLに変換して保存
                    latestFileURL = URL.createObjectURL(blob);

                    // 自動的にダウンロードリンクを作成
                    const link = document.createElement('a');
                    link.href = latestFileURL;
                    link.download = 'captured_image.png'; // 保存するファイル名
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    sendButton.disabled = false; // ファイルが準備できたら送信ボタンを有効にする
                })
                .catch(error => console.error('画像の保存に失敗しました:', error));
        });

        sendButton.addEventListener('click', () => {
            if (latestFileURL) {
                const formData = new FormData();
                // 最新のファイルを指定して送信
                fetch(latestFileURL)
                    .then(res => res.blob())
                    .then(blob => {
                        formData.append('file', blob, 'captured_image.png');

                        const webAppUrl = 'https://script.google.com/macros/s/AKfycbyGLSCLXBXbeuNsrPV3x2i6YP25Kx_SWU8s43HOY2-zuAJEUYhnehrEAthENfpJlrqAPw/exec'; // 実際のURLに置き換えてください

                        return fetch(webAppUrl, {
                            method: 'POST',
                            body: formData
                        });
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