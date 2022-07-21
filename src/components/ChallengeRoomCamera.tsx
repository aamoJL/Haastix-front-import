import { Box, Button, Dialog, IconButton, Stack, TextField } from "@mui/material"
import React, { useEffect, useState, useContext, useRef } from "react"
import { SendFileResponse } from "../interfaces"
import LanguageContext from "./Context/LanguageContext"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import CloseIcon from "@mui/icons-material/Close"

interface Props {
  taskId: string
  onSubmit: () => void
  open: boolean
  close: () => void
}

/**
 * Component that will render video from users camera and button
 * to take photo from the video feed's latest frame.
 * After user takes a photo the component will render the taken photo and
 * buttons to submit or decline the photo.
 */
function ChallengeRoomCamera({ taskId, onSubmit, open, close }: Props) {
  let stream = useRef<MediaStream | null>(null)
  let context = useRef<CanvasRenderingContext2D | null>(null)
  let videoElement = useRef<HTMLVideoElement | null>(null)
  const [allowed, setAllowed] = useState(true)
  const [loading, setLoading] = useState(true)
  const [takenPhoto, setTakenPhoto] = useState("") // photo as base64 string
  const [submissionDesc, setSubmissionDesc] = useState("")
  const translation = useContext(LanguageContext)

  let canvasHeight = window.innerHeight
  let canvasWidth = window.innerWidth

  /**
   * Updates camera image on video element
   */
  function updateCamera() {
    if (videoElement.current && context.current) {
      // video's dimensions will be calculated so it will fit to the canvas
      if (videoElement.current.videoWidth > videoElement.current.videoHeight) {
        let ratio = (canvasHeight / videoElement.current.videoHeight) * videoElement.current.videoWidth
        let widthOffset = (canvasWidth - ratio) / 2
        context.current?.drawImage(videoElement.current, widthOffset, 0, ratio, canvasHeight)
      } else {
        let ratio = (canvasWidth / videoElement.current.videoWidth) * videoElement.current.videoHeight
        let heightOffset = (canvasHeight - ratio) / 2
        context.current?.drawImage(videoElement.current, 0, heightOffset, canvasWidth, ratio)
      }
      window.requestAnimationFrame(updateCamera)
    }
  }

  useEffect(() => {
    if (navigator.mediaDevices === undefined) {
      // MediaDevices will be undefined if the connection is not secure
      setAllowed(false)
      setLoading(false)
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((_stream) => {
          stream.current = _stream
          // Create video element for the camera image
          videoElement.current = document.createElement("video")
          videoElement.current.srcObject = stream.current
          videoElement.current.play()

          let canvas = document.getElementById("camera-canvas") as HTMLCanvasElement
          canvas.width = canvasWidth
          canvas.height = canvasHeight

          context.current = canvas?.getContext("2d")

          videoElement.current.onloadeddata = () => {
            updateCamera()
          }
          setAllowed(true)
          setLoading(false)
        })
        .catch((error: DOMException) => {
          console.log(error)
          setAllowed(false)
          setLoading(false)
        })
    }

    return () => {
      // Stop all tracks from the media devices so the camera will shut down when this component umounts
      let tracks = stream.current?.getTracks()
      tracks?.forEach((track) => {
        track.stop()
      })
      // set context undefined so this component could unmount
      context.current = null
    }
  }, [])

  const takePhotoHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let canvas = document.getElementById("camera-canvas") as HTMLCanvasElement
    if (canvas) {
      // Convert current frame from the video canvas to png
      var photoData = canvas.toDataURL("image/png")
      setTakenPhoto(photoData)
    }
  }

  const sendPhotoHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (takenPhoto !== "") {
      fetch(`${process.env.REACT_APP_API_URL}/challenge/sendfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          challengeFile: takenPhoto.split(";base64,")[1],
          taskId: taskId,
          submissionDescription: submissionDesc,
        }),
      })
        .then((res) => res.json())
        .then((res: SendFileResponse) => {
          if (res.statusCode === 200) {
            onSubmit()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  return (
    <Dialog fullScreen hidden={loading} open={open} onClose={close} PaperProps={{ sx: { mr: 0, ml: 0 } }}>
      <Box position="absolute" top={0} right={0}>
        <Button sx={{ opacity: "70%" }} color="info" onClick={close} style={{ borderRadius: "50%", height: "5em", width: "5em", margin: "1em", padding: 0 }}>
          <CloseIcon />
        </Button>
      </Box>
      {!allowed && <div>{translation.texts.allowCameraAccess}</div>}
      {allowed && (
        <>
          <Box display={takenPhoto !== "" ? "none" : "flex"} width="100%" height="100%">
            <canvas width={canvasWidth} height={canvasHeight} id="camera-canvas" />
            <Stack height={130} direction="row" position="absolute" bottom="0" width="100%" px={3} py={2} bgcolor="rgba(0,0,0,0.5)" justifyContent="space-around">
              <Button variant="outlined" id="take-photo-btn" onClick={takePhotoHandler} style={{ borderRadius: "50%", height: "80px", width: "80px" }}>
                <CameraAltIcon sx={{ width: 64, height: 64 }} />
              </Button>
            </Stack>
          </Box>
          <Box display={takenPhoto === "" ? "none" : "flex"}>
            <img width={canvasWidth} height={canvasHeight} id="photo" src={takenPhoto} alt={translation.imageAlts.cameraScreen} />
            <Stack height={130} direction="column" position="absolute" bottom="0" width="100%" px={3} py={2} bgcolor="rgba(0,0,0,0.5)" justifyContent="space-between" alignItems="center" gap={2}>
              <TextField size="small" id="submission-description" label={translation.inputs.texts.description} value={submissionDesc} onChange={(e) => setSubmissionDesc(e.target.value)}></TextField>
              <Stack direction="row" width="100%" gap={2}>
                <Button id="send-photo-btn" color="success" onClick={sendPhotoHandler}>
                  {translation.inputs.buttons.send}
                </Button>
                <Button id="decline-photo-btn" color="error" onClick={(e) => setTakenPhoto("")}>
                  {translation.inputs.buttons.retake}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </>
      )}
    </Dialog>
  )
}

export default ChallengeRoomCamera
