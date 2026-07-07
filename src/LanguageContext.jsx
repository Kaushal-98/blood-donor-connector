import { createContext, useContext, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))
  const t = (key) => translations[lang][key] || key

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}