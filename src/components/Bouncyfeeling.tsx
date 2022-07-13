import { Box, Theme, useTheme } from "@mui/material"
import React from "react"
import { useEffect, useRef } from "react"
import { WaitingRoomList } from "../interfaces"
import { getEmojiImage } from "./storage/Images"

interface Props {
  players: WaitingRoomList[]
}

interface playerObject {
  userId: string
  ballPos: { x: number; y: number }
  direction: { x: number; y: number }
  userAvatar: HTMLImageElement
  userName: string
}

/**
 * Components that will render player avatars bouncing inside a square
 */
const Bouncyfeeling = React.memo(({ players }: Props) => {
  // Memo is used to optimize performance by reducing render calls from the parent component
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>()
  //const gravity = useRef({ x: 0, y: 0 })
  const lastUpdate = useRef<number>(Date.now())
  const playerObjects = useRef<playerObject[]>([])
  const canvasDimensions = useRef({ height: 500, width: 500 })
  const requestRef = useRef<number>()

  const theme = useTheme()

  const containerStyle: React.CSSProperties = {
    zIndex: -1,
    position: "fixed",
    width: "100%",
    height: "100%",
    maxWidth: "500px",
    maxHeight: "500px",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
  }
  const gradientStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: `linear-gradient(${theme.palette.background.default} 1%, rgba(0, 0, 0, 0) 45.8%)`,
  }
  const canvasStyle: React.CSSProperties = { width: "100%", height: "100%" }

  const avatarSize = 48
  const avatarSpeed = 150

  /**
   * Clamps current value between min and max and returns the new value.
   * @param value current value
   * @param min min value
   * @param max max value
   * @returns
   */
  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max))
  }

  function windowResize() {
    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current?.offsetWidth
      canvasRef.current.height = canvasRef.current?.offsetHeight
      canvasDimensions.current.height = canvasRef.current.height
      canvasDimensions.current.width = canvasRef.current.width
    }
  }

  function updatePlayerObjects() {
    // Add new players
    for (let i = 0; i < players.length; i++) {
      const player = players[i]
      if (!playerObjects.current.some((x) => x.userId === player.userId)) {
        // Player does not have bouncy feeling yet
        let x = canvasDimensions.current.width
        let y = canvasDimensions.current.height
        let img = new Image(48, 48)
        img.src = getEmojiImage(player.avatar)
        img.width = 24
        img.height = 24
        playerObjects.current.push({
          userId: player.userId,
          ballPos: { x: Math.random() * x, y: Math.random() * y },
          direction: { x: Math.random() * x, y: Math.random() * y },
          userAvatar: img,
          userName: player.name,
        })
      }
    }
    let newObjectArray = []
    // Remove players that has left the game
    for (let i = 0; i < playerObjects.current.length; i++) {
      const obj = playerObjects.current[i]
      if (players.some((x) => x.userId === obj.userId)) {
        newObjectArray.push(obj)
      }
    }
    playerObjects.current = newObjectArray
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update)
    window.addEventListener("resize", windowResize, false)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      window.removeEventListener("resize", windowResize, false)
    }
  }, [])

  useEffect(() => {
    if (context.current) {
      updatePlayerObjects()
    }
  }, [players])

  useEffect(() => {
    if (!context.current) {
      context.current = canvasRef.current?.getContext("2d", { alpha: false })
    }
    windowResize()
    updatePlayerObjects()
  }, [canvasRef.current])

  const update = () => {
    let deltaTime = (Date.now() - lastUpdate.current) * 0.001 // same as divided by 1000
    lastUpdate.current = Date.now()
    if (context.current && document.hasFocus()) {
      // Clear canvas
      context.current.clearRect(0, 0, canvasDimensions.current.width, canvasDimensions.current.height)

      // Avatars
      for (let i = 0; i < playerObjects.current.length; i++) {
        const player = playerObjects.current[i]

        player.ballPos.x = clamp(player.ballPos.x + player.direction.x * deltaTime * avatarSpeed, 0, canvasDimensions.current.width)
        player.ballPos.y = clamp(player.ballPos.y + player.direction.y * deltaTime * avatarSpeed, 0, canvasDimensions.current.height)

        // Wall collision
        if (player.ballPos.x <= avatarSize * 0.5 || player.ballPos.x >= canvasDimensions.current.width - avatarSize * 0.5 || player.ballPos.y <= avatarSize * 0.5 || player.ballPos.y >= canvasDimensions.current.height - avatarSize * 0.5) {
          // New direction
          let targetPos = { x: Math.random() * canvasDimensions.current.width, y: Math.random() * canvasDimensions.current.height }
          let direction = {
            x: targetPos.x - player.ballPos.x,
            y: targetPos.y - player.ballPos.y,
          }
          let dirMagnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y)
          player.direction = {
            x: direction.x / dirMagnitude,
            y: direction.y / dirMagnitude,
          }
        }

        // Render Avatar
        // position will be rounded to nearest integer to improve performance
        let xPos = Math.round(player.ballPos.x - avatarSize * 0.5)
        let yPos = Math.round(player.ballPos.y - avatarSize * 0.5)
        context.current.drawImage(player.userAvatar, xPos, yPos, avatarSize, avatarSize)
        // Render Text
        context.current.font = "1em Sans-serif"
        context.current.textAlign = "center"
        context.current.strokeStyle = "black"
        context.current.lineWidth = 3
        context.current.strokeText(player.userName, xPos + avatarSize * 0.5, yPos - avatarSize * 0.2)
        context.current.fillStyle = "white"
        context.current.fillText(player.userName, xPos + avatarSize * 0.5, yPos - avatarSize * 0.2)
      }
    }
    requestRef.current = window.requestAnimationFrame(update)
  }

  return (
    <Box style={containerStyle}>
      <Box style={gradientStyle}></Box>
      <canvas style={canvasStyle} width={500} height={500} ref={canvasRef}></canvas>
    </Box>
  )
})

export default Bouncyfeeling

/* Gravity and velocity things that could be useful for some minigame things in the future
// -------------
// window.addEventListener("deviceorientation", Orientation, true)
    // canvas?.addEventListener("mousemove", MouseMovement, false)

    // return () => {
    //   window.removeEventListener("deviceorientation", Orientation, true)
    //   canvas?.removeEventListener("mousemove", MouseMovement, false)
    // }

 // function Orientation(e: DeviceOrientationEvent) {
  //   if (e.gamma && e.beta) {
  //     // gravity.current = { x: e.gamma / 90, y: clamp(e.beta, -90, 90) / 90 }
  //     gravity.current = { x: e.gamma, y: e.beta }
  //   }
  // }

  // function MouseMovement(e: MouseEvent) {
  //   //gravity.current = { x: e.clientX, y: e.clientY }
  // }

  // // X Gravity
      // context.current.beginPath()
      // context.current.moveTo(start.x, start.y)
      // context.current.lineTo(start.x + gravity.current.x, start.y)
      // context.current.lineWidth = 5
      // context.current.stroke()

      // // Y Gravity
      // context.current.beginPath()
      // context.current.moveTo(start.x, start.y)
      // context.current.lineTo(start.x, start.y + gravity.current.y)
      // context.current.lineWidth = 5
      // context.current.stroke()

      // context.current.beginPath()
        // context.current.arc(player.ballPos.x, player.ballPos.y, 10, 0, 2 * Math.PI)
        // context.current.fillStyle = "green"
        // context.current.fill()
        // context.current.stroke()

        ////// Velocity and gravity things
        //////
        // velocity.current.x = clamp(velocity.current.x + (gravity.current.x * deltaTime) / 5, -5, 5)
        // velocity.current.y = clamp(velocity.current.y + (gravity.current.y * deltaTime) / 5, -5, 5)
        // ballPos.current.x = clamp(ballPos.current.x + velocity.current.x, 0, 500)
        // ballPos.current.y = clamp(ballPos.current.y + velocity.current.y, 0, 500)
        // if (ballPos.current.x === 0 || ballPos.current.x === 500) {
        //   velocity.current.x = 0
        // }
        // if (ballPos.current.y === 0 || ballPos.current.y === 500) {
        //   velocity.current.y = 0
        // }
        // context.current.beginPath()
        // context.current.arc(ballPos.current.x, ballPos.current.y, 10, 0, 2 * Math.PI)
        // context.current.fillStyle = "green"
        // context.current.fill()
        // context.current.stroke()

        // // Circle
      // context.current.beginPath()
      // context.current.arc(250, 250, 40, 0, 2 * Math.PI)
      // context.current.lineWidth = 1
      // context.current.stroke()

      // let start = { x: 250, y: 250 }
      // let magnitude = Math.sqrt(gravity.current.x * gravity.current.x + gravity.current.y * gravity.current.y)
      // let normalizedVector = { x: gravity.current.x / magnitude, y: gravity.current.y / magnitude }

      // // Normalized Line
      // context.current.beginPath()
      // context.current.moveTo(start.x, start.y)
      // context.current.lineTo(start.x + normalizedVector.x * 40, start.y + normalizedVector.y * 40)
      // context.current.stroke()
 */
