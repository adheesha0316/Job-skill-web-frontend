import { useState } from 'react'
import LoginForm from './Pages/Login/Login'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LoginForm />
    </>
  )
}

export default App
