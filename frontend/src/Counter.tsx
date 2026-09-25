import { useState } from 'react'
import './App.css'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="counter-container">
        <p>Current count: {count}</p>
        <div className="button-container">
          <button
            type="button"
            className="counter"
            onClick={() => setCount((count) => count + 1)}
          >
            +1
          </button>

          <button
            type="button"
            className="counter"
            onClick={() => setCount(0)}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  )
}

export default Counter
