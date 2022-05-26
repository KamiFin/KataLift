import React, { useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
import { MovementSystem } from './types/Lift';
import { LiftContext, liftReducers } from './contexts/LiftContext';

function App() {
  const [state, dispatch] = useReducer(liftReducers, {} as MovementSystem);
  return (
    <LiftContext.Provider value={[state, dispatch]}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </LiftContext.Provider>
  );
}

export default App;
