export type Language = "fi" | "en";

/**
 * Interface for translated languages
 */
export interface Languages{
  fi: Translation,
  en: Translation,
}

/**
 * Interface for translated text values
 */
export interface Translation{
  titles:{
    createGame: string,
    challenges: string,
    settings: string, 
    theme: string,
    joinAGame: string,
    avatar: string,
    waitingRoom: string,
    gameRoom: string,
  },
  inputs:{
    buttons:{
      createAChallenge: string,
      joinAChallenge: string,
      addNewChallenge: string,
      createGame: string,
      join: string,
      players: string,
      challenges: string,
      edit: string,
      openCamera: string,
      closeCamera: string,
      accept: string,
      decline: string,
      takePicture: string,
      send: string,
      retake: string,
    },
    texts:{
      roomName: string,
      description: string,
      delayBeforeGameStarts: string,
      gameDuration: string,
      darkmode: string,
      sound: string,
      roomCode: string,
      roomCodeDesc: string,
      userName: string,
      userNameDesc: string,
    }
  },
  texts:{
    askCode: string,
    roomName: string,
    challengeBeginsIn: string,
    roomCode: string,
    firstChallenge: string,
    noJoinedPlayers: string,
    challenge: string,
    description: string,
    timeRemaining: string,
    userName: string,
    acceptSubmission: string,
    waitingSubmissions: string,
    challengeIsOver: string,
    allowCameraAccess: string,
  },
  tables:{
    name: string,
    description: string,
  },
  errors: {
    nameLength: string,
    delayAmount: string,
    durationAmount: string,
    taskCount: string,
    taskDescriptionLength: string,
    roomCodeInvalid: string,
  },
  imageAlts:{
    reviewingPhoto: string,
    cameraScreen: string,
  }
}

const finnish: Translation = {
  titles:{
    createGame: "Luo peli",
    challenges: "Haasteet",
    settings: "Asetukset",
    theme: "Teema",
    joinAGame: "Liity haasteeseen",
    avatar: "Hahmo",
    waitingRoom: "Odotushuone",
    gameRoom: "Pelihuone",
  },
  inputs:{
    buttons:{
      createAChallenge: "Luo haaste",
      joinAChallenge: "Liity haasteeseen",
      addNewChallenge: "Lisää uusi haaste",
      createGame: "Luo peli",
      join: "Liity peliin",
      players: "Pelaajat",
      challenges: "Haasteet",
      edit: "Muokkaa",
      openCamera: "Avaa kamera",
      closeCamera: "Sulje kamera",
      accept: "Hyväksy",
      decline: "Hylkää",
      takePicture: "Ota kuva",
      send: "Lähetä",
      retake: "Ota uusi kuva",
    },
    texts:{
      roomName: "Huoneen nimi",
      description: "Kuvaus",
      delayBeforeGameStarts: "Odotusaika",
      gameDuration: "Pelin kesto",
      darkmode: "Tumma tila",
      sound: "Ääni",
      roomCode: "Huoneen koodi",
      roomCodeDesc: "Huoneen koodi on 4 merkkiä",
      userName: "Käyttäjänimi",
      userNameDesc: "Käyttäjänimen tulee olla 3-30 merkkiä pitkä",
    }
  },
  texts:{
    askCode: "Kysy huoneen koodia pelin luojalta",
    roomName: "Huoneen nimi",
    challengeBeginsIn: "Haasteen alkuun",
    roomCode: "Huoneen koodi",
    firstChallenge: "Aloitushaaste",
    noJoinedPlayers: "Ei liittyneitä pelaajia",
    challenge: "Haaste",
    description: "Kuvaus",
    timeRemaining: "Aikaa jäljellä",
    userName: "Käyttäjänimi",
    acceptSubmission: "Hyväksy kuva?",
    waitingSubmissions: "Odotetaan kuvia...",
    challengeIsOver: "Haaste on päättynyt!",
    allowCameraAccess: "Ei oikeuksia kameraan!"
  },
  tables:{
    name: "Nimi",
    description: "Kuvaus",
  },
  errors:{
    nameLength: "Huoneen nimi tulee olla 3-30 merkkiä pitkä.",
    delayAmount: "Odotusajan tulee olla 0-60 minuuttia.",
    durationAmount: "Pelin keston tulee olla 1-240 minuuttia.",
    taskCount: "Pelissä tulee olla 1-20 haastetta.",
    taskDescriptionLength: "Haasteen kuvauksen tulee olla 3-256 merkkiä pitkä.",
    roomCodeInvalid: "Huoneen koodi on väärin!",
  },
  imageAlts:{
    reviewingPhoto: "Arvioitava kuva",
    cameraScreen: "Kameranäkymä"
  }
}

const english: Translation = {
  titles:{
    createGame: "Create game",
    challenges: "Challenges",
    settings: "Settings",
    theme: "Theme",
    joinAGame: "Join a Game",
    avatar: "Avatar",
    waitingRoom: "Waiting room",
    gameRoom: "Game room",
  },
  inputs:{
    buttons:{
      createAChallenge: "Create a Challenge",
      joinAChallenge: "Join a Challenge",
      addNewChallenge: "Add new challenge",
      createGame: "Create game",
      join: "Join",
      players: "Players",
      challenges: "Challenges",
      edit: "Edit",
      openCamera: "Open camera",
      closeCamera: "Close camera",
      accept: "Accept",
      decline: "Decline",
      takePicture: "Take a picture",
      send: "Send",
      retake: "Retake",
    },
    texts:{
      roomName: "Room name",
      description: "Description",
      delayBeforeGameStarts: "Delay before game starts",
      gameDuration: "Game duration",
      darkmode: "Darkmode",
      sound: "Sound",
      roomCode: "Room code",
      roomCodeDesc: "Code must be 4 characters",
      userName: "User name",
      userNameDesc: "Name must me between 3 and 30 characters",
    }
  },
  texts:{
    askCode: "Ask the gamemaster for the code",
    roomName: "Room name",
    challengeBeginsIn: "Challenge begins in",
    roomCode: "Room code",
    firstChallenge: "First challenge",
    noJoinedPlayers: "No joined players",
    challenge: "Challenge",
    description: "Description",
    timeRemaining: "Time remaining",
    userName: "Username",
    acceptSubmission: "Accept submission?",
    waitingSubmissions: "Waiting photo to be accepted...",
    challengeIsOver: "Challenge is over!",
    allowCameraAccess: "Allow camera access!",
  },
  tables:{
    name: "Name",
    description: "Description",
  },
  errors: {
    nameLength: "Room name must be 3-30 characters long.",
    delayAmount: "Delay must be between 0-60 minutes.",
    durationAmount: "Duration must be between 1-240 minutes.",
    taskCount: "Room must have between 1-20 tasks.",
    taskDescriptionLength: "Task description must be 3-256 characters long.",
    roomCodeInvalid: "Room code was invalid!",
  },
  imageAlts:{
    reviewingPhoto: "Photo to review",
    cameraScreen: "Camera screen",
  }
}

/**
 * Object that contains all translations for all translated languages
 */
export const translations : Languages = {
  fi: finnish,
  en: english,
}

/**
 * Returns object with all translation strings
 * @param lang Language code
 * @returns translation object
 */
export const getTranslation = (lang: keyof Languages) => {
  return translations[lang as keyof Languages];
}

