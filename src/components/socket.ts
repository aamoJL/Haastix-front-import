import socketIOClient from "socket.io-client";

const websocketEndpoint = `${process.env.REACT_APP_API_URL}`;

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

