<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>カメラ操作と位置情報付き写真保存</title>
</head>

<body>
    <h1>カメラ操作と位置情報付き写真保存</h1>
    <button id="startButton">カメラを起動</button>
    <button id="captureButton" disabled>写真を撮影</button>
    <button id="stopButton" disabled>カメラを切断</button>
    <video id="video" width="640" height="480" autoplay></video>
    <canvas id="canvas" width="640" height="480" style="display: none;"></canvas>

    <script>
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const startButton = document.getElementById('startButton');
        const captureButton = document.getElementById('captureButton');
        const stopButton = document.getElementById('stopButton');

        let stream;
        let latitude = null;
        let longitude = null;

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

            const dataURL = canvas.toDataURL('image/png');

            // 位置情報が取得されている場合、ファイル名に追加
            let fileName = 'captured_image';
            if (latitude !== null && longitude !== null) {
                fileName += `_lat${latitude.toFixed(6)}_lon${longitude.toFixed(6)}`;
            }
            fileName += '.png';

            // 自動的にファイルとして保存するためのリンクを作成
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = fileName;  // 位置情報を含むファイル名
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);  // リンクを削除
        });

        stopButton.addEventListener('click', () => {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
            captureButton.disabled = true;
            stopButton.disabled = true;
        });
    </script>
</body>

</html>