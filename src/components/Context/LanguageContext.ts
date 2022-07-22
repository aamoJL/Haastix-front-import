import React from "react"
import { getTranslation, Translation } from "../../translations"

/**
 * React context that is used to provide translation object to every component with App.tsx's
 * LanguageContext.Provider component.
 */
const LanguageContext = React.createContext<Translation>(getTranslation("en"))

export default LanguageContext
