import React from 'react';
import styles from './App.module.css';
import './index.css';
import BlockEditor from './components/editor/BlockEditor';
import GameView from './components/game/GameView';
import { GameProvider } from './logic/GameContext';

function App() {
  return (
    <GameProvider>
      <div className={styles.container}>
        {/* 左側：遊戲畫面區 */}
        <div className={styles.gameArea}>
          <GameView />
        </div>

        {/* 右側：積木編輯區 */}
        <div className={styles.editorArea}>
          <BlockEditor />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
