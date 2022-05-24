import { ImgHTMLAttributes } from "react";

export interface Challenge{
  description: string,
}

export interface ChallengeRoomData{
  roomName: string,
  time?: number,
  delay?: number,
  challenges: Challenge[],
}

export interface ChallengeRoomJoin{
  userName: string,
  roomCode: string,
  userAvatar: number
}