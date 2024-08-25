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

    </div>

<form id="myForm">
    <input type="file" id="fileInput" />
    <input type="button" value="Upload File" onclick="uploadFile()" />
</form>
<div id="output"></div>


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


        function uploadFile() {
            var fileInput = document.getElementById('fileInput');
            var file = fileInput.files[0];
            var reader = new FileReader();
            var appurl = 'https://script.google.com/macros/s/AKfycbz4ZFHBemGkc6ieQOQCzqI0R16y2cS_tAoc5WVReNBI1jIU7dgp8XdYaObuIwEbQfsxBg/exec';

            reader.onload = function (e) {
                var data = e.target.result;
                fetch(appurl, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: data, fileName: file.name })
                }).then(response => {
                    document.getElementById('output').innerHTML = 'File uploaded successfully';
                }).catch(error => {
                    console.error('Error:', error);
                    document.getElementById('output').innerHTML = 'Error uploading file';
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