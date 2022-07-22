import { Box, Button, ButtonGroup, Collapse, Stack, Tooltip, Typography, Alert, AlertTitle, Dialog, TextField, CollapseProps, StackProps } from "@mui/material"
import { useEffect, useState, useRef, useContext } from "react"
import { Socket } from "socket.io-client"
import { ChallengeFile, FileStatusPlayerResponse, JoinChallengeSuccessResponse, NewFileResponse, PlayerData, PlayerFileStatusesResponse, WaitingRoomList } from "../interfaces"
import ChallengeRoomCamera from "./ChallengeRoomCamera"
import Scoreboard from "./Scoreboard"
import RemovePlayer from "./RemovePlayer"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import LanguageContext from "./Context/LanguageContext"
import KeyIcon from "@mui/icons-material/Key"
import PersonIcon from "@mui/icons-material/Person"
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"
import CloseIcon from "@mui/icons-material/Close"

interface Props {
  roomInfo: JoinChallengeSuccessResponse
  socket?: Socket
  playerArray: WaitingRoomList[]
  playNotification: () => void
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
function ChallengeRoom({ roomInfo, socket, playerArray, playNotification }: Props) {
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

  /**
   * Returns player's tark order,
   * The order is randomized if the room is set to have random task order.
   * @returns Array of task numbers
   */
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
  const [currentTaskNumber, setCurrentTaskNumber] = useState<number>(1)
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
  const [showSubmissions, setShowSubmissions] = useState(false)
  const [reviewResponse, setReviewResponse] = useState("") // GM's review message
  const [reviewDescriptionInput, setReviewDescriptionInput] = useState("")
  const translation = useContext(LanguageContext)
  const [randomTasks] = useState<number[]>(sessionStorage.getItem("taskOrder") !== null ? JSON.parse(sessionStorage.getItem("taskOrder")!) : getTaskOrder)
  const currentSubmissionFileName = useRef<ChallengeFile>()
  const prevUnReviewedFiledLength = useRef<number>(0)

  useEffect(() => {
    prevUnReviewedFiledLength.current = unReviewedSubmissions.length
  }, [unReviewedSubmissions])

  useEffect(() => {
    socket?.emit("fetchScoreBoard", {
      token: sessionStorage.getItem("token"),
    })
    socket?.on("finalScore_update", (res: PlayerData[]) => {
      if (res != null) {
        let tasksDoneCounter = 0
        if (res.length !== 0) {
          res.map((value) => (tasksDoneCounter = +value.submissions.length + tasksDoneCounter))
          //Game end when everyone done all tasks
          if (tasksDoneCounter === roomInfo.details.challengeTasks.length * res.length) {
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
      }
    })
    return () => {
      // Clear socket.io Listeners
      socket?.off("finalScore_update")
    }
  }, [playerArray, timeIsUp])

  useEffect(() => {
    if (!roomInfo.details.isActive) {
      setTimeIsUp(true)
    }
  })

  useEffect(() => {
    // Get image file for submission that is currently in review.
    if (unReviewedSubmissions.length === 0) {
      setCurrentSubmissionPhoto("")
      setShowSubmissions(false)
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

    // Player sockets
    if (!isGameMaster) {
      // Get file status response when currentTaskNumber changes or file status changes
      socket?.on("fileStatusPlayer", (dataResponse: FileStatusPlayerResponse) => {
        setReviewResponse(dataResponse.reviewDescription)
        switch (dataResponse.status) {
          case "Approved":
            if (randomTasks.findIndex((x) => x === dataResponse.taskNumber) + 1 >= roomInfo.details.challengeTasks.length) {
              // No more tasks
              setShowCompletedAlert(true)
              setTimeIsUp(true)
            } else {
              // Go next
              playNotification()
              setShowApproveAlert(true)
              setCurrentTaskNumber(randomTasks[randomTasks.findIndex((x) => x === dataResponse.taskNumber) + 1])
            }
            setPlayerWaitingReview(false)
            break
          case "Rejected":
            // Stay
            playNotification()
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

      // Find what is the last task that the player has submitted photo to
      // and set current task to be the next task if the last task was accepted
      socket?.on("playerFileStatuses", (dataResponse: PlayerFileStatusesResponse) => {
        if (dataResponse.statusCode === 200) {
          if (dataResponse.submissions.length === 0) {
            setCurrentTaskNumber(randomTasks[0])
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

      // Request player task submission statuses
      socket?.emit("fetchPlayerFileStatuses", {
        token: roomInfo?.details.token,
      })
    }

    // Gamemaster sockets
    if (isGameMaster) {
      // Add new submissions to this component's state
      socket?.on("newFile", (dataResponse: NewFileResponse) => {
        if (dataResponse.challengeFiles.length > prevUnReviewedFiledLength.current) {
          playNotification()
        }
        if (dataResponse.statusCode === 200) {
          setUnReviewedSubmissions([...dataResponse.challengeFiles])
        }
      })

      //Request submissions that have not been reviewed
      socket?.emit("listFiles", {
        token: roomInfo?.details.token,
      })
    }

    return () => {
      clearInterval(interval)
      socket?.off("fileStatusPlayer")
      socket?.off("newFile")
    }
  }, [roomInfo])

  const handleReview = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, isAccepted: boolean) => {
    // Send submission review socket
    if (unReviewedSubmissions[0] !== undefined) {
      setReviewDescriptionInput("")
      socket?.emit("approveFile", {
        token: roomInfo?.details.token,
        payload: {
          submissionId: unReviewedSubmissions[0].submissionId,
          fileStatus: isAccepted,
          reviewDescription: reviewDescriptionInput,
        },
      })
    }
  }

  useEffect(() => {
    if (timeIsUp === true) {
      playNotification()
    }
  }, [timeIsUp, playNotification])

  return (
    <Stack style={{ width: "100%", margin: "0 auto", maxWidth: "480px" }} alignItems="center" justifyContent="center" spacing={1}>
      {/* Room and user name */}
      <Box display="flex" flexDirection="row" width="100%" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box width="50%" display="flex">
          <MeetingRoomIcon sx={{ mr: 1 }} />
          <Typography variant="body1" component="p" id="room-title" textOverflow="ellipsis" overflow="auto">
            {roomInfo.details.challengeRoomName}
          </Typography>
        </Box>
        <Box width="50%" display="flex" justifyContent="end">
          <Typography variant="body1" component="p" id="user-title" textOverflow="ellipsis" overflow="auto">
            {roomInfo.details.isGameMaster ? translation.texts.youAreGamemaster : roomInfo.details.userName}
          </Typography>
          <PersonIcon sx={{ ml: 1 }} />
        </Box>
      </Box>
      {/* Room info */}
      {!timeIsUp && (
        <>
          {isGameMaster && (
            // Room code
            <Box display="flex" width="100%" alignItems="center">
              <Box display="flex" flex="1 1 0px" justifyContent="end">
                <KeyIcon fontSize="large" sx={{ mr: 2 }}></KeyIcon>
              </Box>
              <Box display="flex" justifyContent="center" flex="1 1 0px">
                <Box display="flex" justifyContent="center" alignItems="center" borderRadius=".4em" sx={{ width: "8em", height: "4em" }} bgcolor="primary.main">
                  <Typography color="primary.contrastText" id="room-code-title-gm-value" variant="h3" component="h3">
                    <b>{roomInfo.details.challengeRoomCode}</b>
                  </Typography>
                </Box>
              </Box>
              <Box flex={"1 1 0px"}></Box>
            </Box>
          )}
          {/* Game Time */}
          <Typography id="room-status-label" textAlign="center" variant="h5" component="h5">
            {roomInfo.details.isPaused ? translation.texts.gameIsPaused : translation.texts.timeRemaining}
          </Typography>
          <Typography visibility={roomInfo.details.isPaused ? "hidden" : "visible"} id="current-time-left" variant="h3" component="h3">
            {getFormattedTime(timeLeft)}
          </Typography>
          {!isGameMaster && (
            <>
              {/* Task information */}
              <Typography variant="body1" component="p">
                {translation.texts.challenge}:{" "}
                <span id="current-task-number-player">
                  {randomTasks.findIndex((x) => x === currentTaskNumber) + 1} / {roomInfo.details.challengeTasks.length}
                </span>
              </Typography>
              <Typography variant="body1" component="p"></Typography>
              <Typography id="current-task-description" variant="body1" component="p" width="100%" textAlign="center" sx={{ wordBreak: "break-word" }}>
                <>
                  {translation.texts.description}:
                  <br />
                  {roomInfo.details.challengeTasks[currentTaskNumber - 1].taskDescription}
                </>
              </Typography>
            </>
          )}
        </>
      )}
      {/* GameMaster, Buttons */}
      {isGameMaster && !timeIsUp && (
        <>
          <Button
            id="gm-submissions-btn"
            size="large"
            sx={{ height: "4em" }}
            disabled={unReviewedSubmissions.length === 0}
            color="warning"
            onClick={() => {
              setShowSubmissions(true)
            }}
          >
            {`${translation.inputs.buttons.submissions} (${unReviewedSubmissions.length})`}
          </Button>
          <ButtonGroup fullWidth>
            <Button
              id="gm-playerlist-btn"
              onClick={() => {
                setShowPlayers(!showPlayers)
                setShowScoreboard(false)
              }}
            >
              {translation.inputs.buttons.players} ({playerArray.length})
            </Button>
            <Button
              id="gm-scoreboard-btn"
              onClick={() => {
                setShowPlayers(false)
                setShowScoreboard(!showScoreboard)
              }}
            >
              {translation.titles.scoreboard}
            </Button>
          </ButtonGroup>
          <Collapse sx={{ width: "100%" }} in={showScoreboard}>
            <Scoreboard {...({ sx: { width: "100%" } } as StackProps)} socket={socket} scores={scores} timeIsUp={timeIsUp} />
          </Collapse>
          <RemovePlayer {...({ sx: { width: "100%" } } as CollapseProps)} socket={socket} roomInfo={roomInfo} playerArray={playerArray} open={showPlayers} />
          {/* Submission modal */}
          {showSubmissions && unReviewedSubmissions.length > 0 && (
            <Dialog fullScreen open={showSubmissions} onClose={() => setShowSubmissions(false)} PaperProps={{ sx: { mr: 0, ml: 0 } }}>
              {/* Close Button */}
              <Box zIndex={2000} position="absolute" top={0} right={0}>
                <Button sx={{ opacity: "70%" }} color="info" onClick={() => setShowSubmissions(false)} style={{ borderRadius: "50%", height: "5em", width: "5em", margin: "1em", padding: 0 }}>
                  <CloseIcon />
                </Button>
              </Box>
              {/* Image */}
              <Stack sx={{ width: "100%", height: "100%", maxWidth: 500 }} position="absolute" spacing={1} alignSelf="center">
                <img style={{ objectPosition: "top center", objectFit: "contain", width: "100%", height: "100%" }} id="current-unreviewed-img" src={currentSubmissionPhoto} alt={translation.imageAlts.reviewingPhoto} />
              </Stack>
              {/* Bottom */}
              <Stack position="absolute" bottom={0} direction="column" width="100%" px={3} py={2} bgcolor="rgba(0,0,0,0.5)" alignItems="center">
                <Stack maxWidth={500} width="100%" direction="column" gap={2}>
                  <Typography variant="body1" component="p" overflow="auto" textOverflow="ellipsis">
                    <>
                      {translation.texts.challenge}: <span id="current-unreviewed-task-description">{unReviewedSubmissions[0].taskDescription}</span>
                      <br />
                      {translation.texts.description}: <span id="current-unreviewed-submission-description">{unReviewedSubmissions[0].submissionDescription}</span>
                    </>
                  </Typography>
                  <TextField size="small" id="review-description" label={translation.texts.message} value={reviewDescriptionInput} onChange={(e) => setReviewDescriptionInput(e.target.value)}></TextField>
                  <Stack direction="row" width="100%" gap={2}>
                    <Button id="accept-photo-btn-gm" color="success" onClick={(e) => handleReview(e, true)}>
                      {translation.inputs.buttons.accept}
                    </Button>
                    <Button id="reject-photo-btn-gm" color="error" onClick={(e) => handleReview(e, false)}>
                      {translation.inputs.buttons.decline}
                    </Button>
                  </Stack>
                </Stack>
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
          <Scoreboard {...({ sx: { width: "100%" } } as StackProps)} socket={socket} scores={scores} timeIsUp={timeIsUp} />
        </>
      )}
      {/* Time is up, scoreboard */}
      {timeIsUp && (
        <>
          <Typography id="times-up-title" variant="h2" component="h2">
            {translation.texts.challengeIsOver}
          </Typography>
          <Typography variant="body1" component="p">
            {translation.texts.roomName}: <span id="end-room-title">{roomInfo?.details.challengeRoomName}</span>
          </Typography>
          <Scoreboard {...({ sx: { width: "100%" } } as StackProps)} socket={socket} scores={scores} timeIsUp={timeIsUp} />
        </>
      )}
      {/* Alerts */}
      <Stack style={{ position: "absolute", top: "50px", left: "50%", transform: "translate(-50%, 0%)" }} sx={{ width: "90%", textAlign: "left" }} spacing={1}>
        {showRejectAlert && (
          <Alert onClick={() => setShowRejectAlert(false)} severity="error">
            <AlertTitle id="alert-title-rejected">{translation.alerts.title.rejected}</AlertTitle>
            {translation.alerts.alert.submissionRejected}
            {reviewResponse !== "" && (
              <p>
                {translation.texts.message}: <span id="rejected-message">{reviewResponse}</span>
              </p>
            )}
          </Alert>
        )}
        {showApproveAlert && (
          <Alert onClick={() => setShowApproveAlert(false)} severity="success">
            <AlertTitle id="alert-title-approved">{translation.alerts.title.approved}</AlertTitle>
            {translation.alerts.success.submissionApproved}
            {reviewResponse !== "" && (
              <p>
                {translation.texts.message}: <span id="approved-message">{reviewResponse}</span>
              </p>
            )}
          </Alert>
        )}
        {showCompletedAlert && (
          <Alert onClick={() => setShowCompletedAlert(false)} severity="info">
            <AlertTitle id="alert-title-completed">{translation.alerts.title.tasksCompleted}</AlertTitle>
            {translation.alerts.info.tasksCompleted}
            {reviewResponse !== "" && (
              <p>
                {translation.texts.message}: <span id="completed-message">{reviewResponse}</span>
              </p>
            )}
          </Alert>
        )}
      </Stack>
    </Stack>
  )
}

export default ChallengeRoom
