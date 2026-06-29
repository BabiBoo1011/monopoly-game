import React from 'react';
import { useGameStore } from './store/gameStore';
import { SetupScreen } from './components/Screens/SetupScreen';
import { GameScreen } from './components/Screens/GameScreen';
import { ResultScreen } from './components/Screens/ResultScreen';

export const App: React.FC = () => {
  const { gameStatus } = useGameStore();

  switch (gameStatus) {
    case 'playing':
      return <GameScreen />;
    case 'finished':
      return <ResultScreen />;
    case 'setup':
    default:
      return <SetupScreen />;
  }
};

export default App;
