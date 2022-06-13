export type Language = "fi" | "en";

/**
 * Interface for translated languages
 */
export interface Languages{
  "fi": Translation,
  "en": Translation,
}

/**
 * Interface for translated text values
 */
export interface Translation{
  Settings: string,
  CreateAChallenge: string,
  JoinAChallenge: string
}

/**
 * Object that contains all translations for all translated languages
 */
export const translations : Languages = {
  fi: {
    Settings: "Asetukset",
    CreateAChallenge: "Luo haaste",
    JoinAChallenge: "Liity haasteeseen"
  },
  en: {
    Settings: "Settings",
    CreateAChallenge: "Create a Challenge",
    JoinAChallenge: "Join a Challenge"
  }
}

export const getTranslation = (lang: string, text: keyof Translation) => {
  return translations[lang as keyof Languages][text];
}

