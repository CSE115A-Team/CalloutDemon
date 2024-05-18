// Create object to create the audio stream
// Use startRecording() to start recording
// Use stopRecording() to end recording
class micInput {
    constructor() {
        this.audioStream = null;
        this.audioRecorder = null;
        this.audioChunks = [];
        this.transcript = '';

        this.recognition = new window.webkitSpeechRecognition(); // Chrome
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => {
            this.transcript = event.results[event.results.length - 1][0].transcript;
        };

        this.recognition.onend = () => {
            console.log('Final Transcript: ', this.transcript);
        };
    }

    startRecording() {
        this.transcript = '';
        this.recognition.start();
        console.log('Recording started.');
    }

    stopRecording() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}
  