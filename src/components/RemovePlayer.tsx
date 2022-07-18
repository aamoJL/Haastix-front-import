import React, { useContext } from "react"
import CloseIcon from "@mui/icons-material/Close"
import { Collapse, CollapseProps, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { JoinChallengeSuccessResponse, WaitingRoomList } from "../interfaces"
import { Socket } from "socket.io-client"
import LanguageContext from "./Context/LanguageContext"

interface Props {
  socket?: Socket
  roomInfo: JoinChallengeSuccessResponse
  playerArray: WaitingRoomList[]
  open: boolean
  collapseProps?: CollapseProps
}

function RemovePlayer({ socket, roomInfo, playerArray, open, ...collapseProps }: Props) {
  const translation = useContext(LanguageContext)

  const handleRemovePlayer = (userName: string) => {
    socket?.emit("removePlayer", {
      token: roomInfo.details.token,
      payload: {
        userName: userName,
      },
    })
  }

  return (
    <Collapse {...collapseProps} in={open} unmountOnExit>
      <TableContainer sx={{ maxHeight: 300 }}>
        <Table size="small" sx={{ tableLayout: "auto", wordBreak: "break-all" }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{translation.tables.name}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          {playerArray.length === 0 && (
            <TableBody>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="center">
                  <Typography variant="body1" component="p">
                    {translation.texts.noJoinedPlayers}
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          )}
          {playerArray.length > 0 && (
            <TableBody>
              {playerArray.map((value, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{value.name}</TableCell>
                  <TableCell>
                    <IconButton id={`remove-challenge-btn-${i}`} size="small" color="error" onClick={(e) => handleRemovePlayer(value.name)}>
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Collapse>
  )
}

export default RemovePlayer
