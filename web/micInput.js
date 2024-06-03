// Create object to create the audio stream
// Use startRecording() to start recording
// Use stopRecording() to end recording
export class MicInput {
    constructor() {
        this.audioStream = null;
        this.audioRecorder = null;
        this.audioChunks = [];

        this.recognition = new window.webkitSpeechRecognition(); // Chrome
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.transcript;
    }

    startRecording() {
        this.transcriptReady = false;
        this.recognition.start();
    }

    // Returns speech transcript
    stopRecording() {
        
        this.transcript = new Promise((resolve, reject) => {
            let transcriptText = "";
            this.recognition.onresult = (event) => {
                transcriptText = event.results[event.results.length - 1][0].transcript;
                console.log("result: " + transcriptText);
            };

            this.recognition.onend = () => {
                resolve(transcriptText);
            }

            this.recognition.onerror = (error) => {
                reject(error);
            };
        });

        this.recognition.stop();
    }

    // Returns promise for the transcript
    getSpeechTranscript() {
        return this.transcript;
    }
}
  