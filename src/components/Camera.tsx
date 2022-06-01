import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

/**
 * Component that will render video from users camera and button to take photo from the video feed's latest frame
 */
function Camera() {
  let stream: MediaStream | undefined = undefined;
  let context: CanvasRenderingContext2D | null | undefined = undefined;
  let videoElement: HTMLVideoElement | undefined = undefined;
  let [allowed, setAllowed] = useState(true);
  let [loading, setLoading] = useState(true);

  let canvasHeight = 200;
  let canvasWidth = 200;

  /**
   * Updates camera image on video element
   */
  function updateCamera() {
    if(videoElement && context){
      // video's dimensions will be calculated so it will fit to the canvas
      if(videoElement.videoWidth > videoElement.videoHeight){
        let ratio = (canvasHeight / videoElement.videoHeight) * videoElement.videoWidth;
        context?.drawImage(videoElement, 0 , 0, ratio, canvasHeight);
      }
      else{
        let ratio = (canvasWidth / videoElement.videoWidth) * videoElement.videoHeight;
        context?.drawImage(videoElement, videoElement.width / 2 , videoElement.height / 2, canvasWidth, ratio);
      }
      window.requestAnimationFrame(updateCamera);
    }
  }

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true})
    .then((_stream) => {
      stream = _stream;
      // Create video element for the camera image
      videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();
      
      let canvas = document.getElementById("camera-canvas") as HTMLCanvasElement;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      context = canvas?.getContext("2d");

      videoElement.onloadeddata = () => {
        updateCamera();
      }
      setAllowed(true);
      setLoading(false);
    })
    .catch((error: DOMException) => {
      console.log(error);
      setAllowed(false);
      setLoading(false);
    });

    return() => {
      // Stop all tracks from the media devices so the camera will shut down when this component umounts
      let tracks = stream?.getTracks();
      tracks?.forEach((track) => {
        track.stop();
      });
      // set context undefined so this component could unmount
      context = undefined;
    }
  }, [])

  const takePhotoHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let canvas = document.getElementById("camera-canvas") as HTMLCanvasElement;
    if(canvas){
      // Convert current frame from the video canvas to png
      var photoData = canvas.toDataURL('image/png');
      // Set test img element source to the taken frame
      var photo = document.getElementById("photo");
      photo?.setAttribute('src', photoData);
    }
  }

  return (
    <div>
      <canvas id="camera-canvas" />
      {loading && <></>}
      {allowed && !loading && (
        <div>
          <div>
            <Button id="take-photo-btn" variant='contained' onClick={takePhotoHandler}>Ota kuva</Button>
          </div>
          <div>
            <img id="photo" src="" alt="" />
          </div>
        </div>
      )}
      {!allowed && !loading && <div>Ei oikeuksia kameraan!</div>}
    </div>
  );
}

export default Camera;