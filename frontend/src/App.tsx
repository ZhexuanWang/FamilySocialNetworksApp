import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api')
      .then((res) => res.text())
      .then(setMessage)
      .catch(() => setMessage('Backend not connected'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Family Social Network App
        </h1>
        <p className="text-lg text-gray-600 mb-2">家族社交网络平台</p>
        <p className="text-sm text-gray-400">
          {message || 'Connecting to API...'}
        </p>
      </div>
    </div>
  )
}

export default App
