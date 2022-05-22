export interface Challenge{
  description: string,
}

export interface ChallengeRoomData{
  roomName: string,
  time?: number,
  delay?: number,
  challenges: Challenge[],
}