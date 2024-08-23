<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>カメラ起動</title>
</head>

<body>
    <h1>カメラを起動する</h1>
    <button id="startButton">カメラを起動</button>
    <video id="video" width="640" height="480" autoplay></video>

    <script>
        const video = document.getElementById('video');
        const startButton = document.getElementById('startButton');

        startButton.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
            } catch (error) {
                console.error('カメラの起動に失敗しました:', error);
            }
        });
    </script>
</body>

</html>