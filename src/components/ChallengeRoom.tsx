import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ChallengeFile, FileStatusPlayerResponse, JoinChallengeSuccessResponse, NewFileResponse } from '../interfaces';
import ChallengeRoomCamera from './ChallengeRoomCamera';

interface Props {
    roomInfo: JoinChallengeSuccessResponse,
    socket?: Socket
}

interface SegmentedTime{
  days: number,
  hours: number,
  minutes: number,
  seconds: number
}

/**
 * Component that renders game view for given room information.
 * Room's scoreboard will be rendered if the room's game time is up.
 * Players and Game master will have different views.
 * @param roomInfo reJoin API response
 */
function ChallengeRoom({roomInfo, socket} : Props) {
  /**
   * Returns object with segmented time between now and end date
   * @param delayTime end date
   * @returns segmentedTime object
   */
   const calculateTimeLeft = (milliseconds: number) => {
    let time : SegmentedTime = {
      days: Math.floor(milliseconds / (1000 * 60 * 60 * 24)),
      hours: Math.floor((milliseconds / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((milliseconds / 1000 / 60) % 60),
      seconds: Math.floor((milliseconds / 1000) % 60),
    };
    return time;
  }

  /**
   * Returns date string in "(-)HH:MM:SS" format
   * @param time segmentedTime object
   * @returns formatted time string
   */
  const getFormattedTime = (time: SegmentedTime) => {
    let timeString = (time.days + time.hours + time.minutes + time.seconds < 0) ? "-" : "";
    timeString = timeString + (Math.abs(time.hours) < 10 ? "0" : "") + Math.abs(time.hours) + ":";
    timeString = timeString + (Math.abs(time.minutes) < 10 ? "0" : "") + Math.abs(time.minutes) + ":";
    timeString = timeString + (Math.abs(time.seconds) < 10 ? "0" : "") + Math.abs(time.seconds);
    return timeString;
  }
  
  const isGameMaster = roomInfo?.details.username === undefined;
  const millisecondsLeft = new Date(roomInfo?.details.challengeEndDate as string).getTime() - new Date().getTime();
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(millisecondsLeft));
  const [currentTaskNumber, setCurrentTaskNumber] = useState(0);
  const [timeIsUp, setTimeIsUp] = useState(millisecondsLeft <= 0);
  const [showCamera, setShowCamera] = useState(false);
  const [playerWaitingReview, setPlayerWaitingReview] = useState(false);
  const [waitingSubmissions, setWaitingSubmissions] = useState<ChallengeFile[]>([])
  const [waitingSubmissionPhoto, setWaitingSubmissionPhoto] = useState("");

  useEffect(() => {
    // Player
    if(!isGameMaster){
      // Check the state of the current task
      socket?.emit('playerCheckFile', {
        token: roomInfo?.details.token,
        payload: {
            challengeNumber: currentTaskNumber
        }
      })
    }
  }, [currentTaskNumber])

  // Game time timer
  useEffect(() => {
    const interval = setInterval(() => {
      const endDate = new Date(roomInfo?.details.challengeEndDate as string);
      const milliseconds = endDate.getTime() - new Date().getTime();
      const segmentedTime = calculateTimeLeft(milliseconds);
      setTimeLeft(segmentedTime);
      if(milliseconds <= 0){
        setTimeIsUp(true);
        clearInterval(interval);
      }
    }, 1000);

    // Player
    if(!isGameMaster){
      socket?.on("fileStatusPlayer", (dataResponse: FileStatusPlayerResponse) => {
        if(dataResponse.fileStatus === "Approved"){
          // If current submission has been approved, move to the next challenge if possible
          let nextTaskNum = dataResponse.challengeNumber + 1;
          if(nextTaskNum >= roomInfo.details.challengeTasks.length){
            setTimeIsUp(true);
            alert("Kaikki haasteet suoritettu!");
          }
          else{
            setCurrentTaskNumber(nextTaskNum);
            setPlayerWaitingReview(false);
          }
        }
        else if(dataResponse.fileStatus === "Rejected"){
          // If the current submission has been rejected, 
          // alert the user and allow the user to take another photo
          alert("Kuvasi on hylätty! Ota uusi kuva.");
          setPlayerWaitingReview(false);
        }
        else if(dataResponse.fileStatus === "Not reviewed"){
          setPlayerWaitingReview(true);
        }
      })
    }

    // Gamemaster
    if(isGameMaster){
      // Add new submissions to this component's state
      socket?.on("newFile", (dataResponse: NewFileResponse) => {
        if(dataResponse.statusCode === 200){
          setWaitingSubmissions(dataResponse.challengeFiles);
          if(dataResponse.challengeFiles.length > 0){
            fetch(`${process.env.REACT_APP_API_URL}/challenge/fetchfile/${dataResponse.challengeFiles[0].fileId}`, {
              method: "GET",
              headers: {
                "Authorization": "bearer " + sessionStorage.getItem("token"),
              }
            })
            .then(async res => {
              let file = await res.blob();
              let reader = new FileReader();
              reader.readAsDataURL(file);

              reader.onloadend = () => {
                // Show currently reviewed photo
                setWaitingSubmissionPhoto(reader.result as string);
              }
            })
            .catch(error => console.log(error))
          }
        }
      })
      
      // Request submissions that have not been reviewed
      socket?.emit('listFiles', {
        token: roomInfo?.details.token,
      })
    }
    
    return () => {
      clearInterval(interval);
      socket?.off("fileStatusPlayer")
      socket?.off("newFile");
    }
  }, [roomInfo?.details.challengeEndDate]);

  const handleReview = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>, isAccepted:boolean) => {
    socket?.emit('approveFile', {
      token: roomInfo?.details.token,
      payload: {
          fileId: waitingSubmissions[0].fileId,
          fileStatus: isAccepted
      }
    })
  }

  return (
    <div>
      <Typography id="room-title" variant="body1" component="p">Huone: {roomInfo?.details.challengeRoomName}</Typography>
      {/* GameMaster */}
      {isGameMaster && !timeIsUp &&
        <>
          <Typography id="user-title-gm" variant="body1" component="p">Käyttäjä: GameMaster</Typography>
          <Typography id="room-code-title-gm" variant="body1" component="p">Huoneen koodi:<br/><b>{roomInfo?.details.challengeRoomCode}</b></Typography>
          <Typography id="timer-gm" variant="body1" component="p">Aikaa jäljellä: {getFormattedTime(timeLeft)}</Typography>
          {waitingSubmissions.length > 0 && 
            <div>
              <p>Arvioi suoritus:</p>
              <p>{waitingSubmissions[0].description}</p>
              <img src={waitingSubmissionPhoto} alt="Arvioitava kuva" />
              <div>
                <Button id="accept-photo-btn-gm" variant="contained" color="success" onClick={(e) => handleReview(e,true)}>Hyväksy</Button>
                <Button id="reject-photo-btn-gm" variant='outlined' color="warning" onClick={(e) => handleReview(e,false)}>Hylkää</Button>
              </div>
            </div>}
        </>}
      {/* Player */}
      {!isGameMaster && !timeIsUp &&
        <>
          <Typography id="user-title-player" variant="body1" component="p">Käyttäjä: {roomInfo.details.username}</Typography>
          <Typography id="task-title-player" variant="body1" component="p">Haaste: <span id="current-task-number-player">{(currentTaskNumber as number) + 1}</span> / <span id="challenge-count-number-player">{roomInfo?.details.challengeTasks.length}</span></Typography>
          <Typography id="task-description-player" variant="body1" component="p">Haasteen kuvaus:<br/>{roomInfo.details.challengeTasks[currentTaskNumber].description}</Typography>
          <Typography id="timer-player" variant="body1" component="p">Aikaa jäljellä: {getFormattedTime(timeLeft)}</Typography>
            <>
              <Button disabled={playerWaitingReview} onClick={(e) => setShowCamera(!showCamera)}>{showCamera ? "Sulje kamera" : "Näytä kamera"}</Button>
              {playerWaitingReview && <div>Odotetaan kuvan arviointia...</div>}
              {showCamera && <ChallengeRoomCamera taskNumber={currentTaskNumber} onSubmit={() => {setPlayerWaitingReview(true); setShowCamera(false)}}/>}
            </>
        </>}
      {/* Time is up, scoreboard */}
      {timeIsUp && 
        <>
          <Typography id="times-up-title" variant="h2" component="h2">Haaste on päättynyt!</Typography>
        </>}
    </div>
  );
}

export default ChallengeRoom;