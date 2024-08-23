<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>カメラ操作と写真保存</title>
</head>

<body>
    <h1>カメラ操作と写真保存</h1>
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

            // 自動的にファイルとして保存するためのリンクを作成
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'captured_image.png';  // 保存するファイル名
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