import { Button, Dialog, Stack } from '@mui/material';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { SendFileResponse } from '../interfaces';
import LanguageContext from './Context/LanguageContext';

interface Props{
  taskNumber: number,
  onSubmit: () => void,
  open: boolean,
  close: () => void
}

/**
 * Component that will render video from users camera and button 
 * to take photo from the video feed's latest frame.
 * After user takes a photo the component will render the taken photo and
 * buttons to submit or decline the photo. 
 */
function ChallengeRoomCamera({taskNumber, onSubmit, open, close}:Props) {
  let stream = useRef<MediaStream | null>(null);
  let context = useRef<CanvasRenderingContext2D | null>(null);
  let videoElement = useRef<HTMLVideoElement | null>(null);
  const [allowed, setAllowed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [takenPhoto, setTakenPhoto] = useState(""); // photo as base64 string
  const translation = useContext(LanguageContext);

  let canvasHeight = 500;
  let canvasWidth = 0;
  window.innerWidth <= 768 ? canvasWidth = window.innerWidth : canvasWidth = 500
  
  /**
   * Updates camera image on video element
   */
  function updateCamera() {
    if(videoElement.current && context.current){
      // video's dimensions will be calculated so it will fit to the canvas
      if(videoElement.current.videoWidth > videoElement.current.videoHeight){
        let ratio = (canvasHeight / videoElement.current.videoHeight) * videoElement.current.videoWidth;
        context.current?.drawImage(videoElement.current, 0 , 0, ratio, canvasHeight);
      }
      else{
        let ratio = (canvasWidth / videoElement.current.videoWidth) * videoElement.current.videoHeight;
        context.current?.drawImage(videoElement.current, videoElement.current.width / 2 , videoElement.current.height / 2, canvasWidth, ratio);
      }
      window.requestAnimationFrame(updateCamera);
    }
  }

  useEffect(() => {
    if(navigator.mediaDevices === undefined){
      // MediaDevices will be undefined if the connection is not secure
      setAllowed(false);
      setLoading(false);
    }
    else{
      navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}})
      .then((_stream) => {
        stream.current = _stream;
        // Create video element for the camera image
        videoElement.current = document.createElement("video");
        videoElement.current.srcObject = stream.current;
        videoElement.current.play();
        
        let canvas = document.getElementById("camera-canvas") as HTMLCanvasElement;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        context.current = canvas?.getContext("2d");
  
        videoElement.current.onloadeddata = () => {
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
    }

    return() => {
      // Stop all tracks from the media devices so the camera will shut down when this component umounts
      let tracks = stream.current?.getTracks();
      tracks?.forEach((track) => {
        track.stop();
      });
      // set context undefined so this component could unmount
      context.current = null;
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
  <Dialog 
    hidden={loading}
    open={open}
    onClose={close}
    PaperProps={{sx: {width: canvasWidth, mr: 0, ml: 0}}}  
  >
    <Stack display={takenPhoto === "" && allowed ? "flex" : "none"} alignItems="center" spacing={1} p={1}>
      <canvas id="camera-canvas" />
      <Button id="take-photo-btn" onClick={takePhotoHandler}>{translation.inputs.buttons.takePicture}</Button>
    </Stack>
    <Stack display={takenPhoto !== "" && allowed ? "flex" : "none"} alignItems="center" spacing={1} p={1}>
      <img width={canvasWidth} height={canvasHeight} id="photo" src={takenPhoto} alt={translation.imageAlts.cameraScreen}/>
      <Button id="send-photo-btn" color="success" onClick={sendPhotoHandler}>{translation.inputs.buttons.send}</Button>
      <Button id="decline-photo-btn"  color="error" onClick={(e) => setTakenPhoto("")}>{translation.inputs.buttons.retake}</Button>
    </Stack>
    {!allowed && <div>{translation.texts.allowCameraAccess}</div>}
  </Dialog>
  );
}

export default ChallengeRoomCamera;