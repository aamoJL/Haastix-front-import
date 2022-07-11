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
}

/**
 * Components that will render player avatars bouncing inside a square
 */
function Bouncyfeeling({ players }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>()
  //const gravity = useRef({ x: 0, y: 0 })
  const lastUpdate = useRef<number>(Date.now())
  const playerObjects = useRef<playerObject[]>([])

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

  useEffect(() => {
    // Add new players
    for (let i = 0; i < players.length; i++) {
      const player = players[i]
      if (!playerObjects.current.some((x) => x.userId === player.userId)) {
        // Player does not have bouncy feeling yet
        let img = new Image()
        img.src = getEmojiImage(player.avatar)
        playerObjects.current.push({
          userId: player.userId,
          ballPos: { x: Math.random() * 501, y: Math.random() * 501 },
          direction: { x: Math.random() * 501, y: Math.random() * 501 },
          userAvatar: img,
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
  }, [players])

  function update() {
    if (!context.current) {
      context.current = canvasRef.current?.getContext("2d")
    }
    if (context.current) {
      const size = 48
      const speed = 200
      let deltaTime = (Date.now() - lastUpdate.current) / 1000
      lastUpdate.current = Date.now()

      context.current.clearRect(0, 0, context.current.canvas.width, context.current.canvas.height)

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

      // Balls
      for (let i = 0; i < playerObjects.current.length; i++) {
        const player = playerObjects.current[i]

        player.ballPos.x = clamp(player.ballPos.x + player.direction.x * deltaTime * speed, 0, 500)
        player.ballPos.y = clamp(player.ballPos.y + player.direction.y * deltaTime * speed, 0, 500)

        // Wall collision
        if (player.ballPos.x <= size / 2 || player.ballPos.x >= 500 - size / 2 || player.ballPos.y <= size / 2 || player.ballPos.y >= 500 - size / 2) {
          // New direction
          let targetPos = { x: Math.random() * 501, y: Math.random() * 501 }
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

        // Render
        context.current.drawImage(player.userAvatar, player.ballPos.x - size / 2, player.ballPos.y - size / 2, size, size)

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
      }

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
    }
    window.requestAnimationFrame(update)
  }

  // function Orientation(e: DeviceOrientationEvent) {
  //   if (e.gamma && e.beta) {
  //     // gravity.current = { x: e.gamma / 90, y: clamp(e.beta, -90, 90) / 90 }
  //     gravity.current = { x: e.gamma, y: e.beta }
  //   }
  // }

  // function MouseMovement(e: MouseEvent) {
  //   //gravity.current = { x: e.clientX, y: e.clientY }
  // }

  useEffect(() => {
    //let canvas = canvasRef.current
    update()

    // window.addEventListener("deviceorientation", Orientation, true)
    // canvas?.addEventListener("mousemove", MouseMovement, false)

    // return () => {
    //   window.removeEventListener("deviceorientation", Orientation, true)
    //   canvas?.removeEventListener("mousemove", MouseMovement, false)
    // }
  }, [])

  return <canvas style={{ backgroundColor: "white" }} width={500} height={500} ref={canvasRef}></canvas>
}

export default Bouncyfeeling
