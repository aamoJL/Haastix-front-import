import socketIOClient from "socket.io-client";

//const websocketEndpoint = `${process.env.REACT_APP_API_URL}`;
const websocketEndpoint = "https://test.haastix.wimmalab.org:8000";


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

