import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const theme = ref<'light' | 'dark'>('light')
  const locale = ref<'zh' | 'en'>('zh')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  }

  const setLocale = (lang: 'zh' | 'en') => {
    locale.value = lang
    localStorage.setItem('locale', lang)
  }

  const initSettings = () => {
    const savedTheme = localStorage.getItem('theme')
    const savedLocale = localStorage.getItem('locale')
    
    if (savedTheme) {
      theme.value = savedTheme as 'light' | 'dark'
    }
    
    if (savedLocale) {
      locale.value = savedLocale as 'zh' | 'en'
    }
  }

  return {
    theme,
    locale,
    toggleTheme,
    setLocale,
    initSettings
  }
})