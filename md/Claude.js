video.addEventListener('loadedmetadata', function () {
    video.play();
    video.style.display = 'block';
});

document.getElementById('cameraOn').addEventListener('click', async function () {
    try {
        const constraints = {
            video: { facingMode: currentFacingMode }
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        // video.style.display = 'block'; をここから削除
    } catch (err) {
        console.error('カメラの起動に失敗しました:', err);
    }
});