import React, { useContext, useEffect, useState } from "react"
import { Button, Collapse, Stack, Typography, TableBody, TableRow, Table, TableCell, TextField, ButtonGroup, IconButton, Box, TableContainer, TableHead, FormControlLabel, Switch } from "@mui/material"
import { ChallengeTask, JoinChallengeSuccessResponse, WaitingRoomList, WaitingRoomNewPlayer, YouWereRemovedResponse } from "../interfaces"
import { Socket } from "socket.io-client"
import ChallengeRoom from "./ChallengeRoom"
import RemovePlayer from "./RemovePlayer"
import AlertWindow from "./AlertWindow"
import CloseIcon from "@mui/icons-material/Close"
import LanguageContext from "./Context/LanguageContext"
import Bouncyfeeling from "./Bouncyfeeling"

interface Props {
  roomInfo: JoinChallengeSuccessResponse
  socket?: Socket
}

interface SegmentedTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function WaitingRoom({ roomInfo, socket }: Props) {
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

  const isGameMaster = roomInfo.details.isGameMaster
  const millisecondsLeft = new Date(roomInfo.details.challengeStartDate as string).getTime() - new Date().getTime()

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(millisecondsLeft))
  const [timeIsUp, setTimeIsUp] = useState(millisecondsLeft <= 0)
  const [playerArray, setPlayerArray] = useState<WaitingRoomList[]>([])
  const [alertMessage, setAlertMessage] = useState("")
  const [alertWindow, setAlertWindow] = useState(false)
  const [showPlayers, setShowPlayers] = useState(false)
  const [showChallenges, setShowChallenges] = useState(false)
  const [edit, setEdit] = useState(false)
  const [challengeArray, setChallengeArray] = useState<ChallengeTask[]>(roomInfo.details.challengeTasks)
  const [startGame, setStartGame] = useState(false)
  const [timer, setTimer] = useState(10)
  const [randomOrder, setRandomOrder] = useState(roomInfo.details.isRandom)
  const translation = useContext(LanguageContext)

  useEffect(() => {
    const interval = setInterval(() => {
      const startDate = new Date(roomInfo.details.challengeStartDate as string)
      const milliseconds = startDate.getTime() - new Date().getTime()
      const segmentedTime = calculateTimeLeft(milliseconds)
      setTimeLeft(segmentedTime)
      if (milliseconds <= 0) {
        setTimeIsUp(true)
        clearInterval(interval)
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [roomInfo.details.challengeStartDate])

  useEffect(() => {
    // Set Socket.io Listeners | newPlayer listener
    socket?.on("newPlayer", (data: WaitingRoomNewPlayer) => {
      // set players from data to players
      setPlayerArray(data.players)
      // set loading false
      // setLoading(false);
    })

    socket?.on("youWereRemoved", (data: YouWereRemovedResponse) => {
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("taskOrder")
      setAlertMessage(data.message)
      setAlertWindow(true)
    })

    socket?.on("playerWasRemoved", (data: WaitingRoomNewPlayer) => {
      setPlayerArray(data.players)
    })

    // get token
    // getToken();
    // toggle loadingscreen
    // setLoading(false);
    return () => {
      // Clear socket.io Listeners , newPlayer
      socket?.off("newPlayer")
      socket?.off("playerWasRemoved")
      socket?.off("youWereRemoved")
    }
  })

  const handleShowPlayers = () => {
    setShowChallenges(false)
    setShowPlayers(!showPlayers)
  }

  const handleShowChallenges = () => {
    setShowPlayers(false)
    setShowChallenges(!showChallenges)
    setEdit(false)
  }

  const handleEditView = () => {
    setChallengeArray(roomInfo.details.challengeTasks)
    setEdit(true)
  }

  const handleEditChallenge = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newArray = challengeArray.map((challenge) => {
      if (challenge.taskNumber === index + 1) {
        return { ...challenge, taskDescription: e.target.value }
      }
      return challenge
    })
    setChallengeArray(newArray)
  }

  const handleAddChallenge = () => {
    const newArr = challengeArray.concat({ taskNumber: challengeArray.length + 1, taskDescription: "", taskId: "taskId" })
    const fixedArr = changeChallengeNumbers(newArr)
    setChallengeArray(fixedArr)
  }

  const handleRemoveChallenge = (i: number) => {
    const newArr = challengeArray.filter((challenge) => challenge.taskNumber !== i + 1)
    if (challengeArray.length < 1) setChallengeArray(challengeArray)
    else {
      const fixedArr = changeChallengeNumbers(newArr)
      setChallengeArray(fixedArr)
    }
  }

  const changeChallengeNumbers = (arr: ChallengeTask[]) => {
    const newArr = arr.map((challenge, index) => {
      return { ...challenge, taskNumber: index + 1 }
    })
    return newArr
  }

  const handleSaveChallenges = () => {
    const filteredArr = challengeArray.filter((challenge) => challenge.taskDescription !== "")
    setChallengeArray(filteredArr)
    socket?.emit("modifyChallenge", {
      token: roomInfo.details.token,
      payload: {
        challengeName: roomInfo.details.challengeRoomName,
        challengeTasks: filteredArr,
        isRandom: randomOrder,
      },
    })

    setEdit(false)
  }

  const handleStartGame = () => {
    setStartGame(!startGame)
    setTimer(10)
  }

  useEffect(() => {
    if (startGame && timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1)
      }, 1000)

      return () => clearInterval(interval)
    }
    if (timer === 0) {
      socket?.emit("startGame", {
        token: roomInfo.details.token,
      })
    }
  }, [timer, startGame])

  return (
    <Stack alignItems="center" justifyContent="center" spacing={1}>
      {!timeIsUp && !alertWindow && (
        <>
          <Typography variant="h3" component="h3">
            {translation.titles.waitingRoom}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", maxWidth: 380 }} textAlign="left" columnGap={3} pl={8}>
            <Typography variant="body1" component="p">
              {translation.texts.roomName}
            </Typography>
            <Typography id="room-name" variant="body1" component="p" sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
              {roomInfo.details.challengeRoomName}
            </Typography>
            <Typography variant="body1" component="p">
              {translation.texts.challengeBeginsIn}
            </Typography>
            <Typography id="timer-gm" variant="body1" component="p">
              {getFormattedTime(timeLeft)}
            </Typography>
            {isGameMaster && (
              <>
                <Typography id="room-code" variant="body1" component="p">
                  {translation.texts.roomCode}
                </Typography>
                <Typography id="room-code-value" variant="body1" component="p">
                  <b>{roomInfo.details.challengeRoomCode}</b>
                </Typography>
                <Typography id="task" variant="body1" component="p">
                  {translation.texts.firstChallenge}
                </Typography>
                <Typography id="taskDescription" variant="body1" component="p" sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                  {roomInfo.details.challengeTasks[0].taskDescription}
                </Typography>
              </>
            )}
          </Box>
          {isGameMaster && (
            <>
              <Button id="start-game-btn" onClick={handleStartGame}>
                {startGame ? `${translation.inputs.buttons.cancel} (${timer})` : `${translation.inputs.buttons.start}`}
              </Button>
              <ButtonGroup>
                <Button id="show-players-btn" onClick={handleShowPlayers}>
                  {translation.inputs.buttons.players} ({playerArray.length})
                </Button>
                <Button id="show-challenges-btn" onClick={handleShowChallenges}>
                  {translation.inputs.buttons.challenges} ({roomInfo.details.challengeTasks.length})
                </Button>
              </ButtonGroup>
              <RemovePlayer socket={socket} roomInfo={roomInfo} playerArray={playerArray} open={showPlayers} />
              <Collapse in={showChallenges} unmountOnExit>
                {!edit && (
                  <Stack alignItems="center">
                    {
                      <TableContainer sx={{ maxWidth: 300, overflow: "hidden" }}>
                        <Table size="small" stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell>{translation.tables.description}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {roomInfo.details.challengeTasks.map((value, i) => (
                              <TableRow key={i}>
                                <TableCell align="left">
                                  <Typography variant="body1" component="p">
                                    {value.taskNumber}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">{value.taskDescription}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    }
                    <Button id="edit-btn" variant="text" onClick={handleEditView}>
                      {translation.inputs.buttons.edit}
                    </Button>
                  </Stack>
                )}
                {edit && (
                  <Stack alignItems="center" spacing={1}>
                    <FormControlLabel control={<Switch id="edit-randomOrder-switch" checked={randomOrder} onChange={() => setRandomOrder(!randomOrder)} />} labelPlacement="start" label={translation.texts.randomTasks}></FormControlLabel>
                    <Box sx={{ maxHeight: 255, overflow: "auto", maxWidth: 300 }}>
                      {challengeArray.map((value, i) => (
                        <TextField
                          key={i}
                          autoFocus
                          id={`challenge-edit-input-${i}`}
                          sx={{ mb: 1 }}
                          value={value.taskDescription}
                          size="small"
                          multiline
                          onChange={(e) => handleEditChallenge(e, i)}
                          inputProps={{ maxLength: 256 }}
                          InputProps={{
                            endAdornment: (
                              <IconButton color="error" onClick={() => handleRemoveChallenge(i)}>
                                <CloseIcon />
                              </IconButton>
                            ),
                          }}
                        ></TextField>
                      ))}
                    </Box>
                    <ButtonGroup variant="text">
                      <Button id="add-challenge-btn" onClick={handleAddChallenge}>
                        {translation.inputs.buttons.add}
                      </Button>
                      <Button id="save-challenges-btn" onClick={handleSaveChallenges}>
                        {translation.inputs.buttons.save}
                      </Button>
                    </ButtonGroup>
                  </Stack>
                )}
              </Collapse>
            </>
          )}
          {!isGameMaster && playerArray.length > 0 && <Bouncyfeeling players={playerArray} />}
        </>
      )}
      {timeIsUp && <ChallengeRoom socket={socket} roomInfo={roomInfo} playerArray={playerArray} />}
      {alertWindow && <AlertWindow message={alertMessage} />}
    </Stack>
  )
}

export default WaitingRoom
