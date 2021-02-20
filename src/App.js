import React, { useEffect, useState }from 'react';
import './App.css';
import ValutaRad from './komponenter/valutaRad';
import Clock from './komponenter/Clock';

const BASE_URL = 'https://api.exchangeratesapi.io/latest'


function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  
  let toAmount, fromAmount
  if(amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }
  
  useEffect(() => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
      const firstCurrency = Object.keys(data.rates)[9]
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
          .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])


  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)

  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
    
  }
  
  
  setInterval(function() {
    localStorage.setItem('currency', "https://api.exchangeratesapi.io/latest");
  }, 1000 * 60 * 60);

  return (
    <>
    <h1>Valutaomvandlare</h1>
    <ValutaRad currencyOptions={currencyOptions} 
    selectedCurrency={fromCurrency} 
    onChangeCurrency={e => setFromCurrency(e.target.value)}
    onChangeAmount={handleFromAmountChange} 
    amount={fromAmount} />
    {/* <div className="likamed">=</div> */}
    <ValutaRad currencyOptions={currencyOptions} 
    selectedCurrency={toCurrency} 
    onChangeCurrency={e => setToCurrency(e.target.value)}
    onChangeAmount={handleToAmountChange} 
    amount={toAmount} />
    <Clock />
    </>
  );
}

export default App;
