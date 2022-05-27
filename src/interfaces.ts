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
    challengeRemainingDuration: number,
    challengeRemainingDelay: number,
    challengeStartDate: string,
    challengeEndDate: string,
    challengeTasks: Challenge[],
    token: string
  }
}