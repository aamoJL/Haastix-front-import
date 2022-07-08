import React from "react"
import { getTranslation, Translation } from "../../translations"

const LanguageContext = React.createContext<Translation>(getTranslation("en"))

export default LanguageContext
