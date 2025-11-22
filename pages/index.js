import { useState, useEffect } from 'react'
import Head from 'next/head'

const currencies = {
  'DZD': 'Algerian Dinar',
  'EUR': 'Euro',
  'USD': 'US Dollar',
  'GBP': 'British Pound',
  'JPY': 'Japanese Yen',
  'CNY': 'Chinese Yuan',
  'CAD': 'Canadian Dollar',
  'AUD': 'Australian Dollar',
  'CHF': 'Swiss Franc',
  'SAR': 'Saudi Riyal',
  'AED': 'UAE Dirham',
  'TND': 'Tunisian Dinar',
  'MAD': 'Moroccan Dirham'
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('converter')
  const [fromCurrency, setFromCurrency] = useState('DZD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [amount, setAmount] = useState('1')
  const [result, setResult] = useState('')
  const [eurUsdRate, setEurUsdRate] = useState('1.09')
  const [dzdEurRate, setDzdEurRate] = useState('0.0067')
  const [customRates, setCustomRates] = useState({})

  useEffect(() => {
    const savedEurUsd = localStorage.getItem('eurUsdRate')
    const savedDzdEur = localStorage.getItem('dzdEurRate')
    const savedCustom = localStorage.getItem('customRates')

    if (savedEurUsd) setEurUsdRate(savedEurUsd)
    if (savedDzdEur) setDzdEurRate(savedDzdEur)
    if (savedCustom) setCustomRates(JSON.parse(savedCustom))
  }, [])

  const getRate = (from, to) => {
    if (from === to) return 1

    const customKey = `${from}_${to}`
    if (customRates[customKey]) return parseFloat(customRates[customKey])

    const reverseKey = `${to}_${from}`
    if (customRates[reverseKey]) return 1 / parseFloat(customRates[reverseKey])

    const eurUsd = parseFloat(eurUsdRate)
    const dzdEur = parseFloat(dzdEurRate)

    const toEur = {
      'DZD': dzdEur,
      'EUR': 1,
      'USD': 1 / eurUsd,
      'GBP': 1.17,
      'JPY': 0.0062,
      'CNY': 0.13,
      'CAD': 0.68,
      'AUD': 0.61,
      'CHF': 1.06,
      'SAR': 0.25,
      'AED': 0.25,
      'TND': 0.30,
      'MAD': 0.092
    }

    const fromToEur = toEur[from] || 1
    const toToEur = toEur[to] || 1

    return fromToEur / toToEur
  }

  const convert = () => {
    const amt = parseFloat(amount)
    if (isNaN(amt)) {
      setResult('Invalid amount')
      return
    }

    const rate = getRate(fromCurrency, toCurrency)
    const converted = amt * rate
    setResult(converted.toFixed(4))
  }

  const handleNumberClick = (num) => {
    if (amount === '0' || amount === '' || result) {
      setAmount(num)
      setResult('')
    } else {
      setAmount(amount + num)
    }
  }

  const handleDecimal = () => {
    if (!amount.includes('.')) {
      setAmount(amount + '.')
    }
  }

  const handleClear = () => {
    setAmount('1')
    setResult('')
  }

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1))
    } else {
      setAmount('0')
    }
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    if (result) {
      setAmount(result)
      setResult('')
    }
  }

  const saveRates = () => {
    localStorage.setItem('eurUsdRate', eurUsdRate)
    localStorage.setItem('dzdEurRate', dzdEurRate)
    localStorage.setItem('customRates', JSON.stringify(customRates))
    alert('Rates saved!')
  }

  const addCustomRate = () => {
    const from = prompt('From currency (e.g., DZD):')
    const to = prompt('To currency (e.g., EUR):')
    const rate = prompt('Exchange rate:')

    if (from && to && rate && !isNaN(parseFloat(rate))) {
      const key = `${from.toUpperCase()}_${to.toUpperCase()}`
      setCustomRates({...customRates, [key]: rate})
    }
  }

  return (
    <>
      <Head>
        <title>DZD Currency Converter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <div className="tabs">
          <button
            className={activeTab === 'converter' ? 'active' : ''}
            onClick={() => setActiveTab('converter')}
          >
            Converter
          </button>
          <button
            className={activeTab === 'rates' ? 'active' : ''}
            onClick={() => setActiveTab('rates')}
          >
            Rates
          </button>
        </div>

        {activeTab === 'converter' ? (
          <div className="calculator">
            <div className="display-section">
              <div className="currency-selector">
                <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                  {Object.keys(currencies).map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
                <button className="swap-btn" onClick={swapCurrencies}>⇅</button>
                <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                  {Object.keys(currencies).map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>

              <div className="display">
                <div className="amount">{amount}</div>
                {result && <div className="result">{result} {toCurrency}</div>}
              </div>
            </div>

            <div className="buttons">
              <button className="btn" onClick={() => handleNumberClick('7')}>7</button>
              <button className="btn" onClick={() => handleNumberClick('8')}>8</button>
              <button className="btn" onClick={() => handleNumberClick('9')}>9</button>
              <button className="btn operator" onClick={handleBackspace}>⌫</button>

              <button className="btn" onClick={() => handleNumberClick('4')}>4</button>
              <button className="btn" onClick={() => handleNumberClick('5')}>5</button>
              <button className="btn" onClick={() => handleNumberClick('6')}>6</button>
              <button className="btn operator" onClick={handleClear}>C</button>

              <button className="btn" onClick={() => handleNumberClick('1')}>1</button>
              <button className="btn" onClick={() => handleNumberClick('2')}>2</button>
              <button className="btn" onClick={() => handleNumberClick('3')}>3</button>
              <button className="btn convert" onClick={convert}>→</button>

              <button className="btn zero" onClick={() => handleNumberClick('0')}>0</button>
              <button className="btn" onClick={handleDecimal}>.</button>
              <button className="btn convert" onClick={convert}>=</button>
            </div>
          </div>
        ) : (
          <div className="rates-panel">
            <h2>Base Rates</h2>

            <div className="rate-input">
              <label>EUR/USD Rate</label>
              <input
                type="number"
                step="0.0001"
                value={eurUsdRate}
                onChange={(e) => setEurUsdRate(e.target.value)}
              />
            </div>

            <div className="rate-input">
              <label>DZD/EUR Rate</label>
              <input
                type="number"
                step="0.0001"
                value={dzdEurRate}
                onChange={(e) => setDzdEurRate(e.target.value)}
              />
            </div>

            <h3>Custom Rates</h3>
            <div className="custom-rates">
              {Object.entries(customRates).map(([pair, rate]) => (
                <div key={pair} className="custom-rate-item">
                  <span>{pair.replace('_', ' → ')}: {rate}</span>
                  <button onClick={() => {
                    const newRates = {...customRates}
                    delete newRates[pair]
                    setCustomRates(newRates)
                  }}>×</button>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={addCustomRate}>
              Add Custom Rate
            </button>

            <button className="btn-primary save" onClick={saveRates}>
              Save Rates
            </button>

            <div className="rate-info">
              <h3>Current Rate: {fromCurrency} → {toCurrency}</h3>
              <p className="rate-value">1 {fromCurrency} = {getRate(fromCurrency, toCurrency).toFixed(6)} {toCurrency}</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
