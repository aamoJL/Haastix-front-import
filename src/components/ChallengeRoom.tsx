import { Box, Button, ButtonGroup, Collapse, Stack, Tooltip, Typography, Alert, AlertTitle, Dialog } from "@mui/material"
import { useEffect, useState, useRef, useContext } from "react"
import { Socket } from "socket.io-client"
import { ChallengeFile, FileStatusPlayerResponse, JoinChallengeSuccessResponse, NewFileResponse, PlayerData, PlayerFileStatusesResponse, WaitingRoomList } from "../interfaces"
import ChallengeRoomCamera from "./ChallengeRoomCamera"
import Scoreboard from "./Scoreboard"
import RemovePlayer from "./RemovePlayer"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import LanguageContext from "./Context/LanguageContext"

interface Props {
  roomInfo: JoinChallengeSuccessResponse
  socket?: Socket
  playerArray: WaitingRoomList[]
}

interface SegmentedTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Component that renders game view for given room information.
 * Room's scoreboard will be rendered if the room's game time is up.
 * Players and Game master will have different views.
 * @param roomInfo reJoin API response
 */
function ChallengeRoom({ roomInfo, socket, playerArray }: Props) {
  /**
   * Returns object with segmented time between now and end date
   * @param delayTime end date
   * @returns segmentedTime object
   */
  const calculateTimeLeft = (milliseconds: number) => {
    let time: SegmentedTime = {
      days: Math.floor(milliseconds / (1000 * 60 * 60 * 24)),
      hours: Math.floor((milliseconds / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((milliseconds / 1000 / 60) % 60),
      seconds: Math.floor((milliseconds / 1000) % 60),
    }
    return time
  }

  /**
   * Returns date string in "(-)HH:MM:SS" format
   * @param time segmentedTime object
   * @returns formatted time string
   */
  const getFormattedTime = (time: SegmentedTime) => {
    let timeString = time.days + time.hours + time.minutes + time.seconds < 0 ? "-" : ""
    timeString = timeString + (Math.abs(time.hours) < 10 ? "0" : "") + Math.abs(time.hours) + ":"
    timeString = timeString + (Math.abs(time.minutes) < 10 ? "0" : "") + Math.abs(time.minutes) + ":"
    timeString = timeString + (Math.abs(time.seconds) < 10 ? "0" : "") + Math.abs(time.seconds)
    return timeString
  }

  /**
   * Shuffles given array of numbers using Durstenfeld shuffle
   * @param array array you want to shuffle
   */

  const shuffle = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  }

  const getTaskOrder = () => {
    let taskNumbers = roomInfo.details.challengeTasks.map((task) => {
      return task.taskNumber
    })
    if (roomInfo.details.isRandom) {
      shuffle(taskNumbers)
    }
    sessionStorage.setItem("taskOrder", JSON.stringify(taskNumbers))
    return taskNumbers
  }

  const isGameMaster = roomInfo?.details.userName === undefined
  const millisecondsLeft = new Date(roomInfo?.details.challengeEndDate as string).getTime() - new Date().getTime()

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(millisecondsLeft))
  const [currentTaskNumber, setCurrentTaskNumber] = useState<number>(0)
  const [randomTasks, setRandomTasks] = useState<number[]>(sessionStorage.getItem("taskOrder") !== null ? JSON.parse(sessionStorage.getItem("taskOrder")!) : getTaskOrder)
  const [timeIsUp, setTimeIsUp] = useState(millisecondsLeft <= 0)
  const [showCamera, setShowCamera] = useState(false)
  const [playerWaitingReview, setPlayerWaitingReview] = useState(false)
  const [unReviewedSubmissions, setUnReviewedSubmissions] = useState<ChallengeFile[]>([])
  const [currentSubmissionPhoto, setCurrentSubmissionPhoto] = useState("")
  const [showPlayers, setShowPlayers] = useState(false)
  const [showScoreboard, setShowScoreboard] = useState(false)
  const [showRejectAlert, setShowRejectAlert] = useState(false)
  const [showApproveAlert, setShowApproveAlert] = useState(false)
  const [showCompletedAlert, setShowCompletedAlert] = useState(false)
  const [scores, setScores] = useState<PlayerData[]>([])
  const translation = useContext(LanguageContext)

  const initTasks = useRef(true) // Used to not show task alerts on page refresh
  const currentSubmissionFileName = useRef<ChallengeFile>()
  // const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket?.emit("fetchScoreBoard", {
      token: sessionStorage.getItem("token"),
    })
    socket?.on("finalScore_update", (res: PlayerData[]) => {
      // setPlayersDoneCount(res.length);
      let tasksDoneCounter = 0

      if (res.length !== 0) {
        res.map((value) => (tasksDoneCounter = +value.submissions.length + tasksDoneCounter))

        //Game end when everyone done all tasks
        if (tasksDoneCounter === roomInfo.details.challengeTasks.length * playerArray.length) {
          setTimeIsUp(true)
        }
      }

      let players = res
      // Sort players by time
      players.sort((a, b) => {
        if (a.submissions.length === b.submissions.length) {
          // If players have same amount of tasks completed
          return a.totalTime < b.totalTime ? -1 : a.totalTime > b.totalTime ? 1 : 0
        } else {
          // If players other player have more tasks completed
          return a.submissions.length > b.submissions.length ? -1 : 1
        }
      })
      setScores(players)
    })
    return () => {
      // Clear socket.io Listeners
      socket?.off("finalScore_update")
    }
  }, [playerArray])

  useEffect(() => {
    if (unReviewedSubmissions.length === 0) {
      setCurrentSubmissionPhoto("")
      currentSubmissionFileName.current = undefined
    } else if (unReviewedSubmissions[0].fileName !== currentSubmissionFileName.current?.fileName) {
      fetch(`${process.env.REACT_APP_API_URL}/challenge/fetchfile/${unReviewedSubmissions[0].submissionId}`, {
        method: "GET",
        headers: {
          Authorization: "bearer " + sessionStorage.getItem("token"),
        },
      })
        .then(async (res) => {
          currentSubmissionFileName.current = unReviewedSubmissions[0]
          let file = await res.blob()
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onloadend = () => {
            // Show currently reviewed photo
            setCurrentSubmissionPhoto(reader.result as string)
          }
        })
        .catch((error) => console.log(error))
    }
  }, [unReviewedSubmissions])

  // Game time timer
  useEffect(() => {
    // Game time timer
    const interval = setInterval(() => {
      const endDate = new Date(roomInfo?.details.challengeEndDate as string)
      const milliseconds = endDate.getTime() - new Date().getTime()
      const segmentedTime = calculateTimeLeft(milliseconds)
      setTimeLeft(segmentedTime)
      if (milliseconds <= 0) {
        setTimeIsUp(true)
        clearInterval(interval)
      }
    }, 1000)

    // Player
    if (!isGameMaster) {
      // Get file status response when currentTaskNumber changes or file status changes
      socket?.on("fileStatusPlayer", (dataResponse: FileStatusPlayerResponse) => {
        console.log(roomInfo.details.challengeTasks.length)
        switch (dataResponse.status) {
          case "Approved":
            if (randomTasks.findIndex((x) => x === dataResponse.taskNumber) + 1 >= roomInfo.details.challengeTasks.length) {
              // No more tasks
              setShowCompletedAlert(true)
              setTimeIsUp(true)
            } else {
              // Go next
              setShowApproveAlert(true)
              setCurrentTaskNumber(randomTasks[randomTasks.findIndex((x) => x === dataResponse.taskNumber) + 1])
            }
            setPlayerWaitingReview(false)
            break
          case "Rejected":
            // Stay
            setShowRejectAlert(true)
            setPlayerWaitingReview(false)
            break
          case "Not reviewed":
            // Wait
            setPlayerWaitingReview(true)
            break
          case "Not submitted":
          default:
            // Stay
            break
        }
      })

      socket?.on("playerFileStatuses", (dataResponse: PlayerFileStatusesResponse) => {
        if (dataResponse.statusCode === 200) {
          if (dataResponse.submissions.length === 0) {
            setCurrentTaskNumber(1)
          } else {
            let lastFile = dataResponse.submissions[dataResponse.submissions.length - 1]
            switch (lastFile.status) {
              case "Approved":
                if (randomTasks.findIndex((x) => x === lastFile.taskNumber) === roomInfo.details.challengeTasks.length - 1) {
                  // No more tasks
                  setTimeIsUp(true)
                } else {
                  setCurrentTaskNumber(randomTasks[randomTasks.findIndex((x) => x === lastFile.taskNumber) + 1])
                }
                break
              case "Not reviewed":
                setPlayerWaitingReview(true)
                break
              case "Rejected":
              case "Not submitted":
              default:
                setCurrentTaskNumber(randomTasks[randomTasks.findIndex((x) => x === lastFile.taskNumber)])
                break
            }
          }
        }
      })

      socket?.emit("fetchPlayerFileStatuses", {
        token: roomInfo?.details.token,
      })
    }

    // Gamemaster
    if (isGameMaster) {
      // Add new submissions to this component's state
      socket?.on("newFile", (dataResponse: NewFileResponse) => {
        if (dataResponse.statusCode === 200) {
          setUnReviewedSubmissions([...dataResponse.challengeFiles])
        }
      })

      // Request submissions that have not been reviewed
      socket?.emit("listFiles", {
        token: roomInfo?.details.token,
      })
    }

    return () => {
      clearInterval(interval)
      socket?.off("fileStatusPlayer")
      socket?.off("newFile")
    }
  }, [])

  const handleReview = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, isAccepted: boolean) => {
    if (unReviewedSubmissions[0] !== undefined) {
      socket?.emit("approveFile", {
        token: roomInfo?.details.token,
        payload: {
          submissionId: unReviewedSubmissions[0].submissionId,
          fileStatus: isAccepted,
        },
      })
    }
    socket?.emit("listFiles", {
      token: roomInfo?.details.token,
    })
  }

  return (
    <Stack alignItems="center" justifyContent="center" spacing={1}>
      {/* Room info */}
      {!timeIsUp && (
        <>
          <Typography variant="h3" component="h3">
            {translation.titles.gameRoom}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", maxWidth: 380 }} textAlign="left" columnGap={3} pl={8}>
            <Typography variant="body1" component="p">
              {translation.texts.roomName}
            </Typography>
            <Typography variant="body1" component="p">
              {roomInfo?.details.challengeRoomName}
            </Typography>
            <Typography variant="body1" component="p">
              {translation.texts.userName}
            </Typography>
            {isGameMaster && (
              <>
                <Typography id="user-title-gm" variant="body1" component="p">
                  GameMaster
                </Typography>
                <Typography id="room-code-title-gm" variant="body1" component="p">
                  {translation.texts.roomCode}
                </Typography>
                <Typography id="room-code-title-gm-value" variant="body1" component="p">
                  {roomInfo?.details.challengeRoomCode}
                </Typography>
              </>
            )}
            {!isGameMaster && (
              <>
                <Typography variant="body1" component="p">
                  {roomInfo.details.userName}
                </Typography>
                <Typography variant="body1" component="p">
                  {translation.texts.challenge}
                </Typography>
                <Typography variant="body1" component="p">
                  <span id="current-task-number-player">{currentTaskNumber as number}</span> / <span id="challenge-count-number-player">{roomInfo?.details.challengeTasks.length}</span>
                </Typography>
                <Typography variant="body1" component="p">
                  {translation.texts.description}
                </Typography>
                <Typography variant="body1" component="p">
                  {roomInfo.details.challengeTasks[currentTaskNumber - 1].taskDescription}
                </Typography>
              </>
            )}
            <Typography variant="body1" component="p">
              {translation.texts.timeRemaining}
            </Typography>
            <Typography variant="body1" component="p">
              {getFormattedTime(timeLeft)}
            </Typography>
          </Box>
        </>
      )}
      {/* GameMaster */}
      {isGameMaster && !timeIsUp && (
        <>
          <ButtonGroup>
            <Button
              onClick={() => {
                setShowPlayers(!showPlayers)
                setShowScoreboard(false)
              }}
            >
              {translation.inputs.buttons.players} ({playerArray.length})
            </Button>
            <Button
              onClick={() => {
                setShowPlayers(false)
                setShowScoreboard(!showScoreboard)
              }}
            >
              {translation.titles.scoreboard}
            </Button>
          </ButtonGroup>
          <Collapse in={showScoreboard}>
            <Scoreboard socket={socket} scores={scores} />
          </Collapse>
          <RemovePlayer socket={socket} roomInfo={roomInfo} playerArray={playerArray} open={showPlayers} />
          {unReviewedSubmissions.length > 0 && (
            <Dialog open={unReviewedSubmissions.length > 0 ? true : false}>
              <Stack alignItems="center" spacing={1} p={1}>
                <Typography variant="h5" component="p">
                  {translation.texts.acceptSubmission}
                </Typography>
                <Typography variant="body1" component="p">
                  {translation.texts.challenge}: {unReviewedSubmissions[0].taskDescription}
                </Typography>
                <img src={currentSubmissionPhoto} alt={translation.imageAlts.reviewingPhoto} />
                <Button id="accept-photo-btn-gm" color="success" onClick={(e) => handleReview(e, true)}>
                  {translation.inputs.buttons.accept}
                </Button>
                <Button id="reject-photo-btn-gm" color="error" onClick={(e) => handleReview(e, false)}>
                  {translation.inputs.buttons.decline}
                </Button>
              </Stack>
            </Dialog>
          )}
        </>
      )}
      {/* Player */}
      {!isGameMaster && !timeIsUp && (
        <>
          <Tooltip enterDelay={0} title={showCamera ? translation.tooltips.closeCamera : translation.tooltips.openCamera}>
            <span>
              <Button
                id="show-close-camera-btn"
                color={showCamera ? "error" : "primary"}
                style={{ borderRadius: "50%", width: 64, height: 64 }}
                disabled={playerWaitingReview}
                onClick={() => {
                  setShowCamera(!showCamera)
                  setShowScoreboard(false)
                }}
              >
                <CameraAltIcon />
              </Button>
            </span>
          </Tooltip>
          {playerWaitingReview && <div>{translation.texts.waitingReview}</div>}
          {showCamera && (
            <ChallengeRoomCamera
              taskId={roomInfo.details.challengeTasks[currentTaskNumber - 1].taskId}
              onSubmit={() => {
                setPlayerWaitingReview(true)
                setShowCamera(false)
              }}
              open={showCamera}
              close={() => setShowCamera(false)}
            />
          )}
          <Scoreboard socket={socket} scores={scores} />
        </>
      )}
      {/* Time is up, scoreboard */}
      {timeIsUp && (
        <>
          <Typography id="times-up-title" variant="h2" component="h2">
            {translation.texts.challengeIsOver}
          </Typography>
          <Typography id="room-title" variant="body1" component="p">
            {translation.texts.roomName}: {roomInfo?.details.challengeRoomName}
          </Typography>
          <Scoreboard socket={socket} scores={scores} />
        </>
      )}
      {/* Alerts */}
      <Stack style={{ position: "absolute", top: "50px", left: "50%", transform: "translate(-50%, 0%)" }} sx={{ width: "auto", textAlign: "left" }} spacing={1}>
        {showRejectAlert && (
          <Alert onClick={() => setShowRejectAlert(false)} severity="error">
            <AlertTitle>{translation.alerts.title.rejected}</AlertTitle>
            {translation.alerts.alert.submissionRejected}
          </Alert>
        )}
        {showApproveAlert && (
          <Alert onClick={() => setShowApproveAlert(false)} severity="success">
            <AlertTitle>{translation.alerts.title.approved}</AlertTitle>
            {translation.alerts.success.submissionApproved}
          </Alert>
        )}
        {showCompletedAlert && (
          <Alert onClick={() => setShowCompletedAlert(false)} severity="info">
            <AlertTitle>{translation.alerts.title.tasksCompleted}</AlertTitle>
            {translation.alerts.info.tasksCompleted}
          </Alert>
        )}
      </Stack>
    </Stack>
  )
}

export default ChallengeRoom
