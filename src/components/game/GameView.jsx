import React from 'react';
import { useGame } from '../../logic/GameContext';
import { runInterpreter } from '../../logic/interpreter';
import styles from './GameView.module.css';

// 匯入素材
import hero1 from '../../assets/hero.png';
import hero2 from '../../assets/hero2.png';
import lightRed from '../../assets/light_red.png';
import lightGreen from '../../assets/light_green.png';
import lightOff from '../../assets/light_off.png';
import carSide from '../../assets/car_side.png';

export default function GameView() {
  const context = useGame();
  const { 
    gameStatus, failReason, characterPos,
    lightState, resetGame, blocks,
    selectedHero, setSelectedHero,
    currentLevel, changeLevel,
    hasCrash
  } = context;

  const handleRun = () => {
    resetGame();
    setTimeout(() => {
        runInterpreter(context);
    }, 100);
  };

  const currentHeroImg = selectedHero === 'hero' ? hero1 : hero2;

  return (
    <div className={styles.gameViewContainer}>
      <div style={{ backgroundColor: currentLevel===1 ? '#fef9c3' : currentLevel===2 ? '#fee2e2' : '#e0e7ff', padding: '0.8rem 1rem', borderBottom: '2px solid #cbd5e1', color: '#1e293b', fontWeight: 'bold', zIndex: 15, fontSize: '0.95rem' }}>
        {currentLevel === 1 && '🚦 【第一關：停看聽】現在是綠燈！過馬路前不可直接走，一定要先「四周看」確認安全再往前！'}
        {currentLevel === 2 && '🚨 【第二關：紅燈停綠燈行】紅綠燈會隨時間變化！請排好紅燈與綠燈的判斷條件，程式會自動幫你反覆檢查。'}
        {currentLevel === 3 && '⚠️ 【第三關：閃爍勿闖】綠燈閃爍代表馬上要變紅燈了！絕對不能走，請等到下一次綠燈亮起再走。'}
      </div>
      
      <div className={styles.header}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
                className={styles.runButton} 
                onClick={handleRun}
                disabled={gameStatus === 'RUNNING' || blocks.length === 0}
            >
            {gameStatus === 'RUNNING' ? '執行中...' : '開始執行 ▶'}
            </button>
            <button className={styles.resetButton} onClick={resetGame}>重設</button>
            <button className={styles.resetButton} style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={() => context.setBlocks([])}>清除全部</button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>🏆 關卡：</span>
            <button className={`${styles.switcherBtn} ${currentLevel === 1 ? styles.activeHero : ''}`} onClick={() => changeLevel(1)}>1</button>
            <button className={`${styles.switcherBtn} ${currentLevel === 2 ? styles.activeHero : ''}`} onClick={() => changeLevel(2)}>2</button>
            <button className={`${styles.switcherBtn} ${currentLevel === 3 ? styles.activeHero : ''}`} onClick={() => changeLevel(3)}>3</button>
        </div>

        <div className={styles.heroSwitcher}>
            <span>選擇英雄：</span>
            <button 
                className={`${styles.switcherBtn} ${selectedHero === 'hero' ? styles.activeHero : ''}`}
                onClick={() => setSelectedHero('hero')}
            >主角 A</button>
            <button 
                className={`${styles.switcherBtn} ${selectedHero === 'hero2' ? styles.activeHero : ''}`}
                onClick={() => setSelectedHero('hero2')}
            >主角 B</button>
        </div>
      </div>

      <div className={styles.scene}>
        {/* 紅綠燈圖片 */}
        <div className={styles.trafficLight}>
          <img src={lightOff} alt="紅綠燈底圖" style={{ position: 'absolute', width: '100%', top: 0, left: 0 }} />
          <img 
            src={lightState === 'RED' ? lightRed : lightGreen} 
            className={(lightState === 'BLINK' && gameStatus === 'RUNNING') ? styles.blinkAnim : ''}
            style={{ position: 'relative', opacity: (lightState === 'BLINK' && gameStatus !== 'RUNNING') ? 0 : 1 }}
            alt="紅綠燈" 
          />
        </div>

        {/* 馬路 */}
        <div className={styles.road}>
            {/* 背景已透過 CSS 設定 */}
        </div>

        {/* 角色圖片 */}
        <div className={styles.character} style={{ transform: `translateY(-${characterPos * 200}px)` }}>
            <img src={currentHeroImg} alt="Hero" />
        </div>

        {/* 車輛 */}
        <div className={`${styles.car} ${hasCrash ? styles.carCrash : ''}`}>
            <img src={carSide} alt="Car" />
        </div>
      </div>

      {/* 回饋視窗 */}
      {gameStatus === 'SUCCESS' && (
        <div className={styles.successModal}>
          <h3>🎉 交通小達人！</h3>
          <p>成功安全走到對面！</p>
        </div>
      )}
      {gameStatus === 'FAILED' && (
        <div className={styles.failedModal}>
          <h3>⚠️ 驚險事件發生</h3>
          <p>{failReason}</p>
        </div>
      )}
    </div>
  );
}
