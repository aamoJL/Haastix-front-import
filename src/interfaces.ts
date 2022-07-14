import { PaletteMode } from "@mui/material"

type fileStatus = "Not reviewed" | "Approved" | "Rejected" | "Not submitted"

export interface Challenge {
  description: string
  // challengeNumber?: number,
}

export interface ChallengeTask {
  taskNumber: number
  taskDescription: string
  taskId: string
}

export interface ChallengeRoomData {
  roomName: string
  time: number
  delay: number
  challenges: Challenge[]
  isRandom: boolean
}

export interface ChallengeRoomJoin {
  userName: string
  roomCode: string
  userAvatar: number
}

/**
 * JSON response from successful challenge room creation API call
 */
export interface NewChallengeRoomSuccessResponse {
  statusCode: number
  message: string
  details: {
    userid: string
    isGameMaster: boolean
    challengeRoomId: string
    challengeRoomCode: string
    challengeRoomName: string
    challengeStartDate: string
    challengeEndDate: string
    challengeTasks: ChallengeTask[]
    token: string
  }
}

export interface JoinChallengeSuccessResponse {
  statusCode: number
  message: string
  details: {
    userid: string
    isGameMaster: boolean
    challengeRoomId: string
    challengeRoomName: string
    challengeStartDate: string
    challengeEndDate: string
    challengeTasks: ChallengeTask[]
    token: string
    isRandom: boolean
    userName: string
    userAvatar: number
    challengeRoomCode: string
    isPaused: boolean
  }
}

export interface challengeModifyResponse {
  challengeRoomName: string
  challengeStartDate: string
  challengeEndDate: string
  challengeTasks: ChallengeTask[]
  isRandom: boolean
}

export interface startGameResponse {
  challengeStartDate: string
  challengeEndDate: string
}

export interface WaitingRoomList {
  name: string
  avatar: number
  userId: string
}

export interface WaitingRoomNewPlayer {
  players: WaitingRoomList[]
}

/**
 * Response from "fileStatusPlayer" socket
 */
export interface FileStatusPlayerResponse {
  status: fileStatus
  taskNumber: number
  reviewDescription: string
}

/**
 * Response from "sendFile" socket
 */
export interface SendFileResponse {
  statusCode: number
  message: string
  error?: "unauthorized" | "Image in review/approved" | "File type invalid" | "Payload too large"
  details?: {
    fileId: string
    challengeNumber: number
  }
}

/**
 * Response from "newFile" socket
 */
export interface NewFileResponse {
  statusCode: number
  message: string
  challengeFiles: ChallengeFile[]
}

export interface ChallengeFile {
  submissionId: string
  fileName: string
  fileStatus: fileStatus
  challengeNumber: number
  taskDescription: string
  submissionDescription: string
}

/**
 * Response from "fetchfile" API call
 */
export interface FetchFileResponse {
  FILE: string
  statusCode: number
  error?: string
  message: string
}

/**
 * Player data for "finalScore_update" socket response
 */
export interface PlayerData {
  playerName: string
  playerAvatar: string
  submissions: {
    submissionId: string
    status: fileStatus
    fileName: string
    mimeType?: string
    createdAt: string
    updatedAt: string
    taskTaskId: string
    userUserId: string
    taskDescription: string
    taskNumber: number
  }[]
  playerResult: {
    time: number
    score?: number
  }
  totalScore: number
  totalTime: number
}

export interface YouWereRemovedResponse {
  statusCode: number
  message: string
}

export interface PlayerFileStatusesResponse {
  statusCode: number
  submissions: {
    fileName: string
    status: fileStatus
    taskNumber: number
  }[]
}

export interface ThemeVariables {
  color: string
  mode: PaletteMode
  style: string
}

export interface GamePausedChangedResponse {
  statusCode: number
  message: string
  isPaused: boolean
  challengeStartDate: string
  challengeEndDate: string
}
