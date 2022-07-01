 type fileStatus =  "Not reviewed" | "Approved" | "Rejected" | "Not submitted";
 
 export interface Challenge{
  description: string,
  challengeNumber: number,
}

export interface ChallengeRoomData{
  roomName: string,
  time: number,
  delay: number,
  challenges: Challenge[],
}

export interface ChallengeRoomJoin{
  userName: string,
  roomCode: string,
  userAvatar: number
}

/**
 * JSON response from successful challenge room creation API call
 */
export interface NewChallengeRoomSuccessResponse{
  statusCode: number,
  message: string,
  details: {
    userid: string,
    challengeRoomId: string, 
    challengeRoomCode: string,
    challengeRoomName: string,
    challengeStartDate: string,
    challengeEndDate: string,
    challengeTasks: Challenge[],
    token: string
  }
}

export interface JoinChallengeSuccessResponse{
  statusCode: number,
  message: string,
  details: {
    userid: string,
    challengeRoomId: string, 
    challengeRoomName: string,
    challengeStartDate: string,
    challengeEndDate: string,
    challengeTasks: Challenge[],
    token: string,
    username: string,
    userAvatar: number,
    challengeRoomCode: string
  }
}

export interface challengeModifyResponse {
  challengeRoomName: string,
  challengeStartDate: string,
  challengeEndDate: string,
  challengeTasks: Challenge[],
}

export interface WaitingRoomList{  
    name: string,
    avatar: number,
    userId: string
}

export interface WaitingRoomNewPlayer{  
  players: WaitingRoomList[]
}

/**
 * Response from "fileStatusPlayer" socket
 */
export interface FileStatusPlayerResponse {
  fileStatus: fileStatus,
  challengeNumber: number,
}

/**
 * Response from "sendFile" socket
 */
export interface SendFileResponse{
  statusCode: number,
  message: string,
  error?: "unauthorized" | "Image in review/approved" | "File type invalid" | "Payload too large",
  details?: {
    fileId: string,
    challengeNumber: number
  },
}

/**
 * Response from "newFile" socket
 */
export interface NewFileResponse {
  statusCode: number,
  message: string,
  challengeFiles: ChallengeFile[],
}

export interface ChallengeFile {
  fileId: string,
  fileName: string,
  fileStatus: fileStatus,
  challengeNumber: number,
  description: string,
}

/**
 * Response from "fetchfile" API call
 */
export interface FetchFileResponse {
  FILE: string,
  statusCode: number,
  error?: string,
  message: string
}

/**
 * Player data for "finalScore_update" socket response
 */
export interface PlayerData{
  playerAvatar: string,
  playerFileIds: [{
    CreatedAt: string,
    challengeNumber: number,
    fileId: string,
  }],
  playerName: string,
  totalScore: number,
  totalTime: number,
}

export interface YouWereRemovedResponse {
  statusCode: number,
  message: string
}

export interface PlayerFileStatusesResponse{
  statusCode: number,
  files: {
    fileId: string,
    fileName: string,
    fileStatus: fileStatus,
    challengeNumber: number,
  }[]
}
