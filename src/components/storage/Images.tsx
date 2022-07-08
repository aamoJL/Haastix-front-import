export var emojiArray = [
  require("../../assets/player_emojies/002-cool-5.png"),
  require("../../assets/player_emojies/003-happy-17.png"),
  require("../../assets/player_emojies/013-tongue-6.png"),
  require("../../assets/player_emojies/028-happy-13.png"),
  require("../../assets/player_emojies/039-cyclops-1.png"),
  require("../../assets/player_emojies/054-ugly-3.png"),
  require("../../assets/player_emojies/084-thief.png"),
  require("../../assets/player_emojies/089-angel-1.png"),
  require("../../assets/player_emojies/098-nerd-9.png"),
]

export const getEmojiImage = (playerAvatar: number) => {
  try {
    return emojiArray[playerAvatar]
  } catch (e) {
    console.log(e)
  }
}
