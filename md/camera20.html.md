<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>カメラ操作とファイル送信</title>
    <style>
        .button-container {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
        }

        button {
            width: 150px;
            padding: 10px;
            font-size: 16px;
        }

        #videoElement {
            width: 100%;
            max-width: 640px;
            margin: 20px auto;
            display: none;
        }

        #photoCanvas {
            display: none;
        }
    </style>
</head>

<body>
    <div class="button-container">
        <button id="cameraOn">Camera On</button>
        <button id="takePhoto">Take Photo</button>
        <button id="cameraOff">Camera Off</button>
        <button id="selectToSend">Select To Send</button>
    </div>
    <input type="file" id="fileInput" style="display: none;">

    <video id="videoElement" autoplay></video>
    <canvas id="photoCanvas"></canvas>

    <script>
        let stream;
        const video = document.getElementById('videoElement');
        const canvas = document.getElementById('photoCanvas');
        const fileInput = document.getElementById('fileInput');

        // GAS Web AppのURL（実際のURLに置き換えてください）
        const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/your-gas-web-app-id/exec';

        document.getElementById('cameraOn').addEventListener('click', async function () {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.style.display = 'block';
            } catch (err) {
                console.error('カメラの起動に失敗しました:', err);
            }
        });

        document.getElementById('takePhoto').addEventListener('click', function () {
            if (stream) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);

                canvas.toBlob(function (blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'photo.jpg';
                    link.click();
                }, 'image/jpeg');
            }
        });

        document.getElementById('cameraOff').addEventListener('click', function () {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                video.style.display = 'none';
            }
        });

        document.getElementById('selectToSend').addEventListener('click', function () {
            fileInput.click();
        });

        fileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                sendFileToGoogleDrive(file);
            }
        });

        function sendFileToGoogleDrive(file) {
            const webAppUrl = 'https://script.google.com/macros/s/AKfycbzQKJatIxHxAeSAO43fTRgn16N03QG4VGWEYBQt9mcyvzYLJfJtmU9KTI3EBqCAmCFx-A/exec';

            const formData = new FormData();
            formData.append('file', file);

            fetch(webAppUrl, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // GAS Web Appの設定によっては 'cors' に変更が必要
            })
                .then(response => {
                    console.log('ファイルが正常に送信されました');
                    alert('ファイルがGoogle Driveに送信されました');
                })
                .catch(error => {
                    console.error('ファイルの送信中にエラーが発生しました:', error);
                    alert('ファイルの送信に失敗しました');
                });
        }
    </script>
</body>

</html>

