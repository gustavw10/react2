import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";

const initialMembers = [{name : "Peter", age: 18},
                          {name : "Hanne", age: 35},
                          {name : "Janne", age: 25},
                          {name : "Holger", age: 22}];


function App() {
  const [members,setMembers] = useState(initialMembers)

  return (
    <div className="App">
      <IncreaseCount initialCount = {5} increment = {2}/>
      <GetJoke />
      <MakeTable list ={members}/>
      <ControlledForm />
      <Calculator />
    </div>
  );
}

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}

function MakeTable(props){
  const table = props.list.map((data, index) => {
    return <tr key={index}><td>{data.name}</td> <td> {data.age}</td></tr>;
  })

  return (
    <div>
      <table>
        <tr>
          <th>Name</th>
          <th>Age</th>
        </tr>
        {table}
      </table>
    </div>
  );
}

function ControlledForm(){
  const [writeValue, setWriteValue] = useState("");

  function change(event){
    setWriteValue(event.target.value)
  }

  return <h3> Skriv:   
      <br></br><input type="text" id="myInput" placeholder="Insert here" value ={writeValue} onChange={(event) => setWriteValue(event.target.value)}/>
      <br></br>
      {writeValue} 
      </h3>
}

function IncreaseCount(props) {
  const [count, setCount] = useState(parseInt(localStorage.getItem("count")) || props.initialCount);

  useEffect(() => {
    localStorage.setItem("count", count);
    
  })

  return (
    <div>
      <button onClick={() => setCount(count + props.increment)}>
        Click to increase
      </button>
      <br></br>
      <button onClick={() => setCount(count - props.increment)}>
        Click to decrease
      </button>
     <h2>{count}</h2> 
    </div>
  );
}

const GetJoke = () => {
  const [joke, setJoke] = useState("");
  const [otherJoke, setOtherJoke] = useState(0);

  useEffect(() => {
    fetch('https://api.chucknorris.io/jokes/random').then(res=>res.json()).then(data=>{
      setJoke(data.value)
    })

    const interval = setInterval(() => {
      fetch('https://api.chucknorris.io/jokes/random').then(res=>res.json()).then(data=>{
      setOtherJoke(data.value)
    })
    }, 2000000)

    return () => clearInterval(interval)
  }, []);

  return (
    <div>
      <button onClick={() => fetch('https://api.chucknorris.io/jokes/random').then(res=>res.json()).then(data=>{
      setJoke(data.value)
    })}>
        Click for new joke
      </button> 
      <br></br>
      Her er en joke:
      <br></br> 
      {joke}
      <br></br>
      <br></br>
      Her er en Chuck Norris joke der bliver fetched hvert 20 sekund: 
      <br></br>{otherJoke}
    </div>
  );
}

export default App;
