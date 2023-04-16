import React from 'react';
import './App.scss';
import { useNavigate } from 'react-router-dom';
import { PlayerType } from './types';

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
        <h1>PRACTICAL 1's GAME</h1>
        <div className="middle-box">
          <h2>Who start the game ?</h2>
          <div className="underline"/>

          <div className="choice-box-container">
            <div className="box">
              <img onClick={() => navigate("/start", { state:  { firstPlayer: PlayerType.USER }})} src="/pictures/user.png" alt="user icon" />
              <p>me</p>
            </div>
            <p className="or">OR</p>
            <div className="box">
              <img onClick={() => navigate("/start", { state:  { firstPlayer: PlayerType.COMPUTER }})} src="/pictures/ai.png" alt="AI icon" />
              <p>AI</p>
            </div>
          </div>
        </div>
    </div>
  );
}

export default App;
