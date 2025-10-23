import { useState } from 'react'
import smileyFace from './assets/smiley-face.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://www.geeksforgeeks.org/reactjs/react/" target="_blank">
          <img src={smileyFace} className="logo react" alt="Smiley Face" />
        </a>
      </div>
      <h1>Tu będzie na pewno bardzo ładna strona</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
