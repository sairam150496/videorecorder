import React, { useState, useEffect } from "react";

export default function VideoRecord() {
  const [stream, setStream] = useState(null);
  //   const [blob, setBlob] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    if (!stream) {
      if (navigator.mediaDevices || navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then(stream => setStream(stream))
          .catch(error => console.error(error));
      } else {
        alert("Please give the camera and audio permissions");
      }
    } else {
      mediaRecorder.start();
      mediaRecorder.ondataavailable = event => {
        setChunks(chunk => chunk.push(event.data));
      };
    }
  }, [mediaRecorder]);

  const handleStart = event => {
    const video = document.querySelector("video");
    // const player = document.getElementById("player");
    video.srcObject = stream;
    video.onloadedmetadata = event => {
      video.play();
    };
    try {
      setMediaRecorder(new MediaRecorder(stream));
    } catch (exception) {
      console.log(exception);
      if (stream === null) {
        alert("Allow Permissions To Record The Video And Refresh the page");
      }
    }
  };
  const handlezoom = () => {
    const tracks = stream.getVideoTracks()[0];
    const capabilities = tracks.getCapabilities();
    const settings = tracks.getSettings();
    if (!("zoom" in capabilities)) {
      alert("Zoom is not supported in this camera!");
    } else {
      setZoom(zoom + 1);
      stream.applyConstraints({ advanced: [{ zoom: zoom }] });
    }
  };
  const handleStop = event => {
    const video = document.querySelector("video");
    video.pause();
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks);
      document.querySelector("#player").src = window.URL.createObjectURL(blob);
    };
  };
  return (
    <>
      <main>
        <div className="jumbotron">
          <video capture controls></video>
          <video id="player" autoPlay controls></video>
          <button
            type="button"
            onClick={handleStart}
            data-wml-speech-command="start"
          >
            Start
          </button>
          <button
            type="button"
            onClick={handleStop}
            data-wml-speech-command="stop"
          >
            Stop
          </button>
          <button
            type="button"
            onClick={handlezoom}
            data-wml-speech-command="zoom"
          >
            zoom
          </button>
        </div>
        
      </main>
    </>
  );
}