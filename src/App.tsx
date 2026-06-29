import React from 'react';
import { useGameStore } from './store/gameStore';
import { HomeScreen } from './components/Screens/HomeScreen';
import { SetupScreen } from './components/Screens/SetupScreen';
import { PlayerSetupScreen } from './components/Screens/PlayerSetupScreen';
import { GameScreen } from './components/Screens/GameScreen';
import { ResultScreen } from './components/Screens/ResultScreen';

export const App: React.FC = () => {
  const { screen } = useGameStore();

  switch (screen) {
    case 'setup':
      return <SetupScreen />;
    case 'player_setup':
      return <PlayerSetupScreen />;
    case 'playing':
      return <GameScreen />;
    case 'finished':
      return <ResultScreen />;
    case 'home':
    default:
      return <HomeScreen />;
  }
};

export default App;
