import React from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import Aquarium from './components/Aquarium';
import GameSetup from './game/GameSetup';
import { RootState } from './store';

const App: React.FC = () => {
  const gameState = useSelector((state: RootState) => state.game);

  return (
    <div className="app">
      <GameSetup />
      <main className="app-main">
        <Aquarium />
      </main>
      <footer className="app-footer">
        <p>Ikan-kan v{gameState.version}</p>
      </footer>
    </div>
  );
};

export default App; 