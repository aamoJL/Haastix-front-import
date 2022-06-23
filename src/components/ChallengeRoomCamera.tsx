import { Button, Stack } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { SendFileResponse } from '../interfaces';
import LanguageContext from './Context/LanguageContext';

interface Props{
  taskNumber: number,
  onSubmit: () => void,
}

/**
 * Component that will render video from users camera and button 
 * to take photo from the video feed's latest frame.
 * After user takes a photo the component will render the taken photo and
 * buttons to submit or decline the photo. 
 */
function ChallengeRoomCamera({taskNumber, onSubmit}:Props) {
  let stream: MediaStream | undefined = undefined;
  let context: CanvasRenderingContext2D | null | undefined = undefined;
  let videoElement: HTMLVideoElement | undefined = undefined;
  const [allowed, setAllowed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [takenPhoto, setTakenPhoto] = useState(""); // photo as base64 string
  const translation = useContext(LanguageContext);

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
      setTakenPhoto(photoData);
    }
  }

  const sendPhotoHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(takenPhoto !== ""){
      // Convert current frame from the video canvas to png
      fetch(`${process.env.REACT_APP_API_URL}/challenge/sendfile`,
      {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          challengeFile: takenPhoto.split(';base64,')[1],
          challengeNumber: taskNumber,
        })
      })
      .then(res => res.json())
      .then((res: SendFileResponse) => {
        console.log(res);
        if(res.statusCode === 200){
          onSubmit();
        }
      })
      .catch(error => {
        console.log(error);
      })
    }
  }

  return (
    <div hidden={loading}>
      <div hidden={takenPhoto !== "" || !allowed}>
        <canvas id="camera-canvas" />
        <div>
          <Button id="take-photo-btn" variant='contained' onClick={takePhotoHandler}>{translation.inputs.buttons.takePicture}</Button>
        </div>
      </div>
      <div hidden={takenPhoto === "" || !allowed}>
        <div>
          <img width={canvasWidth} height={canvasHeight} id="photo" src={takenPhoto} alt={translation.imageAlts.cameraScreen}/>
          <Stack spacing={1}>
            <Button id="send-photo-btn" variant='contained' color="success" onClick={sendPhotoHandler}>{translation.inputs.buttons.send}</Button>
            <Button id="decline-photo-btn" variant='outlined' color="error" onClick={(e) => setTakenPhoto("")}>{translation.inputs.buttons.retake}</Button>
          </Stack>
        </div>
      </div>
      {!allowed && <div>{translation.texts.allowCameraAccess}</div>}
    </div>
  );
}

export default ChallengeRoomCamera;