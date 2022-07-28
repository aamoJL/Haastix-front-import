import { PaletteMode } from "@mui/material"

/**
 * Type for different status strings for file submissions.
 */
type fileStatus = "Not reviewed" | "Approved" | "Rejected" | "Not submitted"

export interface Challenge {
  description: string
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

/**
 * Interface for information used to joining rooms
 */
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

/**
 * Interface for successfull response for joining room
 */
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
    isActive: boolean
  }
}

/**
 * Interface for response when challenge has been modified
 */
export interface challengeModifyResponse {
  challengeRoomName: string
  challengeStartDate: string
  challengeEndDate: string
  challengeTasks: ChallengeTask[]
  isRandom: boolean
}

/**
 * Interface for response when game has been started manually by gamemaster
 */
export interface startGameResponse {
  challengeStartDate: string
  challengeEndDate: string
}

/**
 * Interface for waiting room player
 */
export interface WaitingRoomList {
  name: string
  avatar: number
  userId: string
}

/**
 * Interface for waiting room playerlist
 */
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

/**
 * Interface for {@link NewFileResponse}'s challengeFiles object
 */
export interface ChallengeFile {
  submissionId: string
  fileName: string
  fileStatus: fileStatus
  challengeNumber: number
  taskDescription: string
  submissionDescription: string
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

/**
 * Response from "youWereRemoved" socket
 */
export interface YouWereRemovedResponse {
  statusCode: number
  message: string
}

/**
 * Response from "playerFileStatuses" socket
 */
export interface PlayerFileStatusesResponse {
  statusCode: number
  submissions: {
    taskNumber: number
      submissions: {
        fileName: string
        status: fileStatus
    }[]
  }[]
}

/**
 * Response from "gmLeft" socket
 */
export interface GameEndResponce {
  message: string
  isActive: boolean
}

/**
 * Interface for MaterialUI theme variables
 */
export interface ThemeVariables {
  color: string
  mode: PaletteMode
  style: string
}

/**
 * Response from "gamePauseChanged" socket
 */
export interface GamePausedChangedResponse {
  statusCode: number
  message: string
  isPaused: boolean
  challengeStartDate: string
  challengeEndDate: string
}
