export type Language = "fi" | "en"

/**
 * Interface for translated languages
 */
export interface Languages {
  fi: Translation
  en: Translation
}

/**
 * Interface for translated text values
 */
export interface Translation {
  titles: {
    createGame: string
    challenges: string
    settings: string
    theme: string
    style: string
    joinAGame: string
    avatar: string
    waitingRoom: string
    gameRoom: string
    scoreboard: string
    feedbackForm: string
  }
  inputs: {
    buttons: {
      createAChallenge: string
      joinAChallenge: string
      addNewChallenge: string
      createGame: string
      join: string
      players: string
      challenges: string
      edit: string
      openCamera: string
      closeCamera: string
      accept: string
      decline: string
      takePicture: string
      send: string
      retake: string
      add: string
      save: string
      feedback: string
      start: string
      cancel: string
      submissions: string
    }
    texts: {
      roomName: string
      description: string
      delayBeforeGameStarts: string
      gameDuration: string
      darkmode: string
      sound: string
      roomCode: string
      roomCodeDesc: string
      userName: string
      userNameDesc: string
      roomNameLengthHelper: string
      taskCountHelper: string
      taskDescriptionLengthHelper: string
    }
  }
  texts: {
    askCode: string
    roomName: string
    challengeBeginsIn: string
    roomCode: string
    firstChallenge: string
    noJoinedPlayers: string
    challenge: string
    description: string
    timeRemaining: string
    userName: string
    acceptSubmission: string
    waitingReview: string
    challengeIsOver: string
    allowCameraAccess: string
    allTasksCompleted: string
    submissionDeclined: string
    taskNumber: string
    message: string
    randomTasks: string
    gameIsPaused: string
  }
  tables: {
    name: string
    description: string
    avatar: string
    time: string
    tasks: string
  }
  errors: {
    nameLength: string
    delayAmount: string
    durationAmount: string
    taskCount: string
    taskDescriptionLength: string
    roomCodeInvalid: string
    gameMasterLeft: string
    userNameUsed: string
  }
  alerts: {
    title: {
      approved: string
      rejected: string
      tasksCompleted: string
    }
    alert: {
      submissionRejected: string
      feedbackTooShort: string
    }
    success: {
      submissionApproved: string
    }
    info: {
      tasksCompleted: string
    }
  }
  imageAlts: {
    reviewingPhoto: string
    cameraScreen: string
  }
  tooltips: {
    openCamera: string
    closeCamera: string
    joinGame: string
    createGame: string
  }
  tutorial: {
    title: string
    titles: {
      gameMaster: string
      player: string
    }
    descriptions: {
      gameMaster: string[]
      player: string[]
    }
  }
}

const finnish: Translation = {
  titles: {
    createGame: "Luo peli",
    challenges: "Haasteet",
    settings: "Asetukset",
    theme: "Teema",
    style: "Tyyli",
    joinAGame: "Liity haasteeseen",
    avatar: "Hahmo",
    waitingRoom: "Odotushuone",
    gameRoom: "Pelihuone",
    scoreboard: "Tulokset",
    feedbackForm: "Lähetä palautetta",
  },
  inputs: {
    buttons: {
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
      add: "Lisää",
      save: "Tallenna",
      feedback: "Palaute",
      start: "Aloita peli",
      cancel: "Peruuta",
      submissions: "Suoritukset",
    },
    texts: {
      roomName: "Huoneen nimi",
      description: "Kuvaus",
      delayBeforeGameStarts: "Odotusaika (0-60)",
      gameDuration: "Pelin kesto (1-240)",
      darkmode: "Tumma tila",
      sound: "Ääni",
      roomCode: "Huoneen koodi",
      roomCodeDesc: "Huoneen koodi on 4 merkkiä",
      userName: "Käyttäjänimi",
      userNameDesc: "Käyttäjänimen tulee olla 3-30 merkkiä pitkä",
      roomNameLengthHelper: "Huoneen nimi on 3-30 merkkiä",
      taskCountHelper: "Huoneessa voi olla 1-20 haastetta",
      taskDescriptionLengthHelper: "Haasteen kuvaus on 3-256 merkkiä",
    },
  },
  texts: {
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
    waitingReview: "Odotetaan hyväksyntää...",
    challengeIsOver: "Haaste on päättynyt!",
    allowCameraAccess: "Ei oikeuksia kameraan!",
    allTasksCompleted: "Kaikki haasteet suoritettu!",
    submissionDeclined: "Kuvasi on hylätty! Ota uusi kuva.",
    taskNumber: "Haasteen numero",
    message: "Viesti",
    randomTasks: "Sekoita haasteiden järjestys",
    gameIsPaused: "Peli on pysäytetty",
  },
  tables: {
    name: "Nimi",
    description: "Kuvaus",
    avatar: "Hahmo",
    time: "Aika",
    tasks: "Haasteet",
  },
  errors: {
    nameLength: "Huoneen nimi tulee olla 3-30 merkkiä pitkä.",
    delayAmount: "Odotusajan tulee olla 0-60 minuuttia.",
    durationAmount: "Pelin keston tulee olla 1-240 minuuttia.",
    taskCount: "Pelissä tulee olla 1-20 haastetta.",
    taskDescriptionLength: "Haasteen kuvauksen tulee olla 3-256 merkkiä pitkä.",
    roomCodeInvalid: "Huoneen koodi on väärin!",
    gameMasterLeft: "Pelin vetäjä on poistunut pelistä",
    userNameUsed: "Käyttäjänimi on jo käytössä.",
  },
  alerts: {
    title: {
      approved: "Hyväksytty",
      rejected: "Hylätty",
      tasksCompleted: "Kaikki haasteet suoritettu!",
    },
    alert: {
      submissionRejected: "Lähettämäsi kuva on hylätty. Ota uusi kuva.",
      feedbackTooShort: "Palaute on liian lyhyt.",
    },
    success: {
      submissionApproved: "Lähettämäsi kuva on hyväksytty.",
    },
    info: {
      tasksCompleted: "Olet suorittanut kaikki haasteet.",
    },
  },
  imageAlts: {
    reviewingPhoto: "Arvioitava kuva",
    cameraScreen: "Kameranäkymä",
  },
  tooltips: {
    openCamera: "Avaa kamera",
    closeCamera: "Sulje kamera",
    joinGame: "Huoneen koodi tai käyttäjänimi on väärin",
    createGame: "Osa tiedoista on väärin",
  },
  tutorial: {
    title: "Peli ohjeet",
    titles: {
      gameMaster: "Pelimestari",
      player: "Pelaaja",
    },
    descriptions: {
      gameMaster: [
        "Paina luo peli painiketta kotisivulla.",
        "Täytä Luo peli sivun tiedot ja luo peli.",
        "Anna odotushuoneessa oleva avain iconin vieressä oleva koodi pelaajille.",
        "Odota, että pelaajat liittyvät peliin",
        "Odotellessa haasteet painiketta painamalla pääset näkemään ja muokkaamaan haasteita.",
        "Peli alkaa kun aika loppuu tai aloita peli painiketta painamalla",
        "Pelihuoneessa odota, että pelaajat alkavat lähettää kuvia hyväksyttäväksi",
        "Hyväksy tai hylkää pelaajien kuvat. Halutessasi voit antaa kommentin miksi hylkäsit kuvan",
        "Arvostele pelaajien kuvia kunnes kaikki ovat suorittaneet haasteet tai kunnes aika loppuu",
      ],
      player: [
        "Paina liity peliin painiketta kotisivulla",
        "Pyydä pelimestarilta huoneen koodi",
        "Odota, että pelimestari aloittaa pelin tai odotus aika loppuu",
        "Ota kuva haasteen mukaisesta asiasta. Halutessasi voit antaa pelimestarille pelostuksen, mitä kuvassa on",
        "Odota, että pelimestari hyväksyy tai hylkää kuvan",
        "Jos kuva hylättiin ota uusi parempi kuva",
        "Jos kuva hyväksyttiin jatka seuraavaan haasteeseen",
        "Suorita haasteita kunnes kaikki haasteet on suoritettu tai aika loppuu",
        "Katso taulukosta tulokset pelin lopuksi",
      ],
    },
  },
}

const english: Translation = {
  titles: {
    createGame: "Create game",
    challenges: "Challenges",
    settings: "Settings",
    theme: "Theme",
    style: "Style",
    joinAGame: "Join a Game",
    avatar: "Avatar",
    waitingRoom: "Waiting room",
    gameRoom: "Game room",
    scoreboard: "Scoreboard",
    feedbackForm: "Send feedback",
  },
  inputs: {
    buttons: {
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
      add: "Add",
      save: "Save",
      feedback: "Feedback",
      start: "Start the game",
      cancel: "Cancel",
      submissions: "Submissions",
    },
    texts: {
      roomName: "Room name",
      description: "Description",
      delayBeforeGameStarts: "Delay before game starts (0-60)",
      gameDuration: "Game duration (1-240)",
      darkmode: "Darkmode",
      sound: "Sound",
      roomCode: "Room code",
      roomCodeDesc: "Code must be 4 characters",
      userName: "User name",
      userNameDesc: "Name must me between 3 and 30 characters",
      roomNameLengthHelper: "Room name is 3-30 characters",
      taskCountHelper: "Room can have 1-20 tasks",
      taskDescriptionLengthHelper: "Task description is 3-256 characters",
    },
  },
  texts: {
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
    waitingReview: "Waiting photo to be accepted...",
    challengeIsOver: "Challenge is over!",
    allowCameraAccess: "Allow camera access!",
    allTasksCompleted: "All tasks have been completed!",
    submissionDeclined: "Your submission has been rejected! Take a new photo.",
    taskNumber: "Task number",
    message: "Message",
    randomTasks: "Randomise task order",
    gameIsPaused: "The game has been paused",
  },
  tables: {
    name: "Name",
    description: "Description",
    avatar: "Avatar",
    time: "Time",
    tasks: "Tasks",
  },
  errors: {
    nameLength: "Room name must be 3-30 characters long.",
    delayAmount: "Delay must be between 0-60 minutes.",
    durationAmount: "Duration must be between 1-240 minutes.",
    taskCount: "Room must have between 1-20 tasks.",
    taskDescriptionLength: "Task description must be 3-256 characters long.",
    roomCodeInvalid: "Room code was invalid!",
    gameMasterLeft: "Gamemaster left the game",
    userNameUsed: "Username already in use",
  },
  alerts: {
    title: {
      approved: "Approved",
      rejected: "Declined",
      tasksCompleted: "All tasks completed!",
    },
    alert: {
      submissionRejected: "Your submission has been rejected. Take another photo.",
      feedbackTooShort: "Feedback is too short.",
    },
    success: {
      submissionApproved: "Your submission has been approved.",
    },
    info: {
      tasksCompleted: "You have completed all tasks.",
    },
  },
  imageAlts: {
    reviewingPhoto: "Photo to review",
    cameraScreen: "Camera screen",
  },
  tooltips: {
    openCamera: "Open camera",
    closeCamera: "Close camera",
    joinGame: "Room code or user name is invalid",
    createGame: "Some information is invalid",
  },
  tutorial: {
    title: "How to play",
    titles: {
      gameMaster: "Gamemaster",
      player: "Player",
    },
    descriptions: {
      gameMaster: [
        "Press create a challenge button on the homepage",
        "Fill the form in the create game page",
        "Give the code located next to a key icon to the players",
        "Wait that all the players join the room",
        "While waiting you can view and edit the challenges by pressing the challenges button",
        "Game starts when time runs out or you can start the game by pressing the start the game button",
        "In the challenge room wait that the players start sending in submissions",
        "Accept or decline the submission. You can comment why you declined a photo if you like",
        "Review the submissions until all players have done the challenges or until the time runs out",
      ],
      player: [
        "Press join a challenge button on the homepage",
        "Ask the gamemaster for the room code",
        "Wait that the gamemaster starts the game or the waiting time ends",
        "Take a photo of a thing that the challenge describes",
        "Wait that the gamemaster accepts or declines your submission",
        "If your photo was declined take a new better photo",
        "If your photo was accepted continue to the next challenge",
        "Complete challenges until all of them are done or the time runs out",
        "Checkout the scores from the scoreboard",
      ],
    },
  },
}

/**
 * Object that contains all translations for all translated languages
 */
export const translations: Languages = {
  fi: finnish,
  en: english,
}

/**
 * Returns object with all translation strings
 * @param lang Language code
 * @returns translation object
 */
export const getTranslation = (lang: keyof Languages) => {
  return translations[lang as keyof Languages]
}
