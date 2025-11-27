import { useState } from 'react'
import './BMICalculator.css'

function BMICalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState(null)
  const [category, setCategory] = useState('')

  const calculateBMI = () => {
    const h = parseFloat(height) / 100
    const w = parseFloat(weight)

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      alert('Пожалуйста, введите корректные значения роста и веса.')
      return
    }

    const calculatedBMI = w / (h * h)
    setBmi(calculatedBMI.toFixed(1))

    if (calculatedBMI < 18.5) {
      setCategory('Недостаточный вес')
    } else if (calculatedBMI < 25) {
      setCategory('Нормальный вес')
    } else if (calculatedBMI < 30) {
      setCategory('Избыточный вес')
    } else {
      setCategory('Ожирение')
    }
  }

  const resetFields = () => {
    setHeight('')
    setWeight('')
    setBmi(null)
    setCategory('')
  }

  return (
    <div className="bmi-calculator">
      <h1>Калькулятор ИМТ</h1>
      <div className="input-group">
        <label>
          Рост (см):
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Введите рост"
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Вес (кг):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Введите вес"
          />
        </label>
      </div>
      <div className="buttons">
        <button onClick={calculateBMI}>Рассчитать ИМТ</button>
        <button onClick={resetFields}>Сбросить</button>
      </div>

      {bmi && (
        <div className="result">
          <h2>Ваш ИМТ: {bmi}</h2>
          <p>Категория: <strong>{category}</strong></p>
        </div>
      )}
    </div>
  )
}

export default BMICalculator