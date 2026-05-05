import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [blocks, setBlocks] = useState([]);
  
  // 遊戲狀態：WAITING, RUNNING, SUCCESS, FAILED
  const [gameStatus, setGameStatus] = useState('WAITING');
  const [failReason, setFailReason] = useState('');
  const [selectedHero, setSelectedHero] = useState('hero'); 
  const [currentLevel, setCurrentLevel] = useState(1);
  
  // 動畫與位置狀態
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [characterPos, setCharacterPos] = useState(0);
  const [hasLooked, setHasLooked] = useState(false);
  const [hasCrash, setHasCrash] = useState(false);
  
  // 環境變數 
  const [lightState, setLightState] = useState('GREEN'); 

  // 用途：給非同步不斷迴圈的 interpreter 讀取最新狀態
  const stateRefs = useRef({
      lightState: 'GREEN',
      characterPos: 0,
      hasLooked: false,
      blocks: [],
      currentLevel: 1
  });

  useEffect(() => {
     stateRefs.current.lightState = lightState;
     stateRefs.current.characterPos = characterPos;
     stateRefs.current.hasLooked = hasLooked;
     stateRefs.current.blocks = blocks;
     stateRefs.current.currentLevel = currentLevel;
  }, [lightState, characterPos, hasLooked, blocks, currentLevel]);

  const resetGame = (explicitLevel) => {
    setGameStatus('WAITING');
    setFailReason('');
    setActiveBlockId(null);
    setCharacterPos(0);
    setHasLooked(false);
    setHasCrash(false);
    
    // 初始化燈號
    const lv = explicitLevel !== undefined ? explicitLevel : currentLevel;
    if (lv === 1) setLightState('GREEN');
    if (lv === 2) setLightState('RED');
    if (lv === 3) setLightState('BLINK');
  };

  const changeLevel = (level) => {
    setCurrentLevel(level);
    setBlocks([]);
    setTimeout(() => resetGame(level), 0); 
  }

  // 自動燈號控制腳本 (執行後觸發)
  useEffect(() => {
    let t1, t2;
    if (gameStatus === 'RUNNING') {
        if (currentLevel === 2) {
            setLightState('RED');
            t1 = setTimeout(() => setLightState('GREEN'), 3000);
        } else if (currentLevel === 3) {
            setLightState('BLINK');
            t1 = setTimeout(() => {
                setLightState('RED');
                t2 = setTimeout(() => {
                    setLightState('GREEN');
                }, 3000);
            }, 2000);
        }
    }
    return () => {
        clearTimeout(t1);
        clearTimeout(t2);
    };
  }, [gameStatus, currentLevel]);

  return (
    <GameContext.Provider value={{
      blocks, setBlocks,
      gameStatus, setGameStatus,
      failReason, setFailReason,
      activeBlockId, setActiveBlockId,
      characterPos, setCharacterPos,
      hasLooked, setHasLooked,
      hasCrash, setHasCrash,
      lightState, setLightState,
      selectedHero, setSelectedHero,
      currentLevel, changeLevel,
      resetGame,
      stateRefs // 傳給 interpreter
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
