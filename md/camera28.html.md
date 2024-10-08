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
            height: auto;
            margin: 20px auto;
            display: none;
            border: 1px solid #000;
        }

        #photoCanvas {
            display: none;
        }

        #cameraFacingLabel {
            text-align: center;
            margin-top: 10px;
            font-weight: bold;
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
    <div id="cameraFacingLabel"></div>
    <video id="videoElement" autoplay playsinline></video>
    <canvas id="photoCanvas"></canvas>

    <script>
        let stream;
        let currentFacingMode = 'user';
        const video = document.getElementById('videoElement');
        const canvas = document.getElementById('photoCanvas');
        const fileInput = document.getElementById('fileInput');
        const cameraFacingLabel = document.getElementById('cameraFacingLabel');

        const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbx4-Lc84yJ-ruC9dTKLg2jdYJw547TztRc6uN8UIUk-szNo-kzNPCjdhndgaFnRh1Qsig/exec';

        function updateCameraFacingLabel() {
            cameraFacingLabel.textContent = currentFacingMode === 'user' ? '前面カメラ' : '背面カメラ';
        }


            // 位置情報を取得する関数
            function getLocation() {
                return new Promise((resolve, reject) => {
                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(
                            position => resolve(position.coords),
                            error => reject(error)
                        );
                    } else {
                        reject(new Error("Geolocation is not supported by this browser."));
                    }
                });
            }

            // ファイル名を生成する関数
            async function generateFileName() {
                const now = new Date();
                const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);

                try {
                    const coords = await getLocation();
                    return `${dateStr}_${coords.latitude}_${coords.longitude}.jpg`;
                } catch (error) {
                    console.error("Error getting location:", error);
                    return `${dateStr}_unknown_location.jpg`;
                }
            }
        


        video.addEventListener('loadedmetadata', function () {
            console.log('ビデオメタデータがロードされました');
            video.play();
            video.style.display = 'block';
            console.log('ビデオを表示しました');
        });

        document.getElementById('cameraOn').addEventListener('click', async function () {
            try {
                console.log('カメラをオンにしています...');
                const constraints = {
                    video: { facingMode: currentFacingMode }
                };
                console.log('制約:', constraints);
                stream = await navigator.mediaDevices.getUserMedia(constraints);
                console.log('ストリームを取得しました:', stream);
                video.srcObject = stream;
                console.log('ビデオソースを設定しました');
                updateCameraFacingLabel();
            } catch (err) {
                console.error('カメラの起動に失敗しました:', err);
            }
        });

            document.getElementById('takePhoto').addEventListener('click', async function () {

            if (stream) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);

                const fileName = await generateFileName();


                canvas.toBlob(function (blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                }, 'image/jpeg');
            }
        });

        document.getElementById('cameraOff').addEventListener('click', function () {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                video.srcObject = null;
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
            const reader = new FileReader();
            reader.onload = function (e) {
                const formData = new FormData();
                formData.append('file', e.target.result);
                formData.append('filename', file.name);

                console.log('Sending file:', file.name);

                fetch(GAS_WEB_APP_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'cors'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log('Response data:', data);
                        try {
                            const jsonData = JSON.parse(data);
                            console.log('ファイルが正常に送信されました:', jsonData.url);
                            alert('ファイルがGoogle Driveに送信されました');
                        } catch (error) {
                            console.error('JSONのパースに失敗しました:', error);
                            alert('サーバーからの応答の解析に失敗しました');
                        }
                    })
                    .catch(error => {
                        console.error('ファイルの送信中にエラーが発生しました:', error);
                        alert('ファイルの送信に失敗しました: ' + error.message);
                    });
            };
            reader.readAsDataURL(file);
        }

        const switchCameraButton = document.createElement('button');
        switchCameraButton.textContent = 'Switch Camera';
        switchCameraButton.addEventListener('click', function () {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
            document.getElementById('cameraOn').click();
        });
        document.querySelector('.button-container').appendChild(switchCameraButton);
    </script>
</body>

</html>