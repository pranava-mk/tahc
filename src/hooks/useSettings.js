import { useState, useEffect } from 'react'

const defaultSettings = {
  audioNotifications: true,
  desktopNotifications: false,
  showJoinLeave: true,
  enableLatex: true,
  enableSyntaxHighlight: true,
  showImages: true,
}

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    // Load from localStorage
    const stored = localStorage.getItem('tahc-chat-settings')
    return stored ? JSON.parse(stored) : defaultSettings
  })

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('tahc-chat-settings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return {
    settings,
    updateSetting,
  }
}
