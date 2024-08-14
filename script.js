let mediaRecorder;
let recordedChunks = [];

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const recordedVideo = document.getElementById('recordedVideo');

startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);

async function startRecording() {
    try {
        // Request the screen to be captured
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });

        // Request the microphone to be captured
        const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        // Combine screen and microphone audio tracks
        const combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...screenStream.getAudioTracks(),
            ...audioStream.getAudioTracks()
        ]);

        // Initialize MediaRecorder with combined stream
        mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: 'video/webm; codecs=vp9,opus'
        });

        // Store the recorded video data
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        // Stop the recording when the stream ends
        mediaRecorder.onstop = () => {
            const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
            recordedVideo.src = URL.createObjectURL(recordedBlob);
            recordedChunks = [];
        };

        // Start recording
        mediaRecorder.start();
        startBtn.disabled = true;
        stopBtn.disabled = false;
    } catch (error) {
        console.error('Error starting screen recording:', error);
    }
}

function stopRecording() {
    // Stop the media recorder
    mediaRecorder.stop();

    // Disable/enable buttons
    startBtn.disabled = false;
    stopBtn.disabled = true;
}
