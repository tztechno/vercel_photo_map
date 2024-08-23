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

            // 画像を圧縮（例: 0.7の品質で変換）
            latestDataURL = canvas.toDataURL('image/png', 0.3);

            // 現在の日付と時刻を取得してフォーマット
            const now = new Date();
            const timestamp = now.toISOString().replace(/[:\-]/g, '').replace(/\..+/, '');

            // ファイル名に日時と位置情報を追加
            latestFileName = `${timestamp}`;
            if (latitude !== null && longitude !== null) {
                latestFileName += `_lat${latitude.toFixed(6)}_lon${longitude.toFixed(6)}`;
            }
            latestFileName += '.png';

            // 自動的にファイルとして保存するためのリンクを作成
            const link = document.createElement('a');
            link.href = latestDataURL;
            link.download = latestFileName;  // 日時情報と位置情報を含むファイル名
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);  // リンクを削除

            sendButton.disabled = false;
        });

        sendButton.addEventListener('click', () => {
            if (latestDataURL && latestFileName) {
                const webAppUrl = 'https://script.google.com/macros/s/AKfycbygqpM0xJbpUiz4LlOCq73AhHF6L2n3S5qYrFoR6WH0keEhhB-wmJuywmf7iTvuEZrUhg/exec'; // ここにPost.GsのWebApp URLを指定する
                const blob = dataURItoBlob(latestDataURL);

                const formData = new FormData();
                formData.append('file', blob, latestFileName);

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

        function dataURItoBlob(dataURI) {
            const byteString = atob(dataURI.split(',')[1]);
            const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        }
    </script>
</body>

</html>