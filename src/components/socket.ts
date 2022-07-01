import socketIOClient from "socket.io-client";

const websocketEndpoint = "https://test.haastix.wimmalab.org";

export const setConnection = (token: string) => {
  try {
    var socket = socketIOClient(websocketEndpoint, {
      withCredentials: true,
      auth: {
        token: token
      }
    })
    return socket

  } catch (error) {
    throw error
  }
}

