import './App.css';
import GameContainer from './components/GameContainer';
import AnimatedFeedback from './components/AnimatedFeedback';

function App() {
  return (
    <div className="app">
      <main>
        <GameContainer />
        <AnimatedFeedback />
      </main>
    </div>
  );
}

export default App; 