import { Box, useTheme } from "@mui/material"
import React from "react"
import { useEffect, useRef } from "react"
import { WaitingRoomList } from "../interfaces"
import { getEmojiImage } from "./storage/Images"

interface Props {
  players: WaitingRoomList[]
}

/**
 * Interface for player avatar object that is used on canvas
 */
interface playerObject {
  userId: string
  ballPos: { x: number; y: number }
  direction: { x: number; y: number }
  userAvatar: HTMLImageElement
  userName: string
}

/**
 * Component that will render player avatars bouncing inside a square
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

  const avatarSize = 48 // Avatar's size on canvas
  const avatarSpeed = 150 // Avatar movement speed on canvas

  /**
   * Clamps current value between min and max and returns the new value.
   * @param value current value
   * @param min min value
   * @param max max value
   * @returns clamped value
   */
  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max))
  }

  function windowResize() {
    if (canvasRef.current) {
      // Resize canvas when the window resizes
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
        // Player does not have bouncy feeling yet, make a new player object
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
    // Start update function loop
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
      // Update player objects when players array changes
      updatePlayerObjects()
    }
  }, [players])

  useEffect(() => {
    // Update context ref when available
    if (!context.current) {
      context.current = canvasRef.current?.getContext("2d")
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

        // Wall collision check
        if (player.ballPos.x <= avatarSize * 0.5 || player.ballPos.x >= canvasDimensions.current.width - avatarSize * 0.5 || player.ballPos.y <= avatarSize * 0.5 || player.ballPos.y >= canvasDimensions.current.height - avatarSize * 0.5) {
          // Give avatar a new direction
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
      {/* render gradient overlay to make the texts easier to read */}
      <Box style={gradientStyle}></Box>
      <canvas style={canvasStyle} width={500} height={500} ref={canvasRef}></canvas>
    </Box>
  )
})

export default Bouncyfeeling
