// Create object to create the audio stream
// Use startRecording() to start recording
// Use stopRecording() to end recording
class micInput {
  constructor() {
    this.audioStream = null;
    this.audioRecorder = null

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => this.audioStream = stream)
      .catch(error => {
        console.error("Error accessing microphone:", error);
      });
  }

  startRecording() {
    this.audioRecorder = new MediaRecorder(this.audioStream);
    this.audioRecorder.start();

    console.log("Started Recording");
  }

  stopRecording() {
    // Set up recorder to save data
    this.audioRecorder.ondataavailable = (event) => {
      const recordedChunks = event.data;
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result; // dataURL containing base64 encoded audio data
        eel.receive_audio_data(base64Data);  // Send base64 string to Python
      };
      reader.readAsDataURL(recordedChunks);
      console.log(recordedChunks);

    };

    if (this.audioRecorder && this.audioRecorder.state === "recording") {
      this.audioRecorder.stop();
      console.log("Recording stopped");
    }
  }

}
  