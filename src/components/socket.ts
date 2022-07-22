/**
 * This file is used to initialize socket.io connection settings.
 */

import socketIOClient from "socket.io-client"

const websocketEndpoint = `${process.env.REACT_APP_WEBSOCKET_ENDPOINT}`

export const setConnection = (token: string) => {
  try {
    var socket = socketIOClient(websocketEndpoint, {
      withCredentials: false,
      auth: {
        token: token,
      },
    })
    return socket
  } catch (error) {
    throw error
  }
}
