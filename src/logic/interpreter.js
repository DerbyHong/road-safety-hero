import { BLOCK_TYPES } from './blocks';

const wait = (ms) => new Promise(res => setTimeout(res, ms));

export async function runInterpreter(context) {
  const {
    blocks, setGameStatus, setFailReason, setActiveBlockId,
    setCharacterPos, setHasLooked, stateRefs, setLightState,
    setHasCrash
  } = context;

  const { currentLevel } = stateRefs.current;

  // 1. 關卡失敗預先判定
  if (currentLevel === 1) {
      const forwardCount = blocks.filter(b => b.type === BLOCK_TYPES.FORWARD || b.type === BLOCK_TYPES.LOOK_AND_FORWARD).length;
      if (forwardCount >= 5) {
          setLightState('RED');
          setGameStatus('FAILED');
          setFailReason('你看太久囉，綠燈都變成紅燈了！');
          return;
      }
  }

  setGameStatus('RUNNING');
  
  // 最多執行迴圈 10 次 (預防死迴圈或是使用者掛機過久)
  const MAX_TICKS = 15;
  let tick = 0;

  const executeBlock = async (block) => {
    setActiveBlockId(block.id);
    await wait(400);

    const liveLight = stateRefs.current.lightState;
    const didLook = stateRefs.current.hasLooked;

    if (block.type === BLOCK_TYPES.FORWARD) {
        if (liveLight === 'RED') {
          setHasCrash(true);
          throw new Error('不看燈號就過馬路是很危險的！不僅可能會被車撞到，還違反交通法規喔！');
        }
        if (liveLight === 'BLINK' && currentLevel === 3) {
          setLightState('RED'); // 強制變紅燈
          setHasCrash(true);
          throw new Error('綠燈在閃爍時代表即將轉為紅燈，建議等到下個綠燈再過馬路喔！差點被車撞！');
        }
        if ((currentLevel === 1 || currentLevel === 2) && !didLook) {
          setHasCrash(true);
          throw new Error('沒有先四周看就往前走，差點被車撞到！');
        }
        
        stateRefs.current.characterPos += 1;
        setCharacterPos(stateRefs.current.characterPos);
        await wait(600);
    } else if (block.type === BLOCK_TYPES.STOP) {
        await wait(400);
    } else if (block.type === BLOCK_TYPES.LOOK_AROUND) {
        setHasLooked(true);
        stateRefs.current.hasLooked = true;
        await wait(400); 
    } else if (block.type === BLOCK_TYPES.LOOK_AND_FORWARD) {
        setHasLooked(true);
        stateRefs.current.hasLooked = true;
        await wait(200);

        if (liveLight === 'RED') {
          setHasCrash(true);
          throw new Error('不看燈號就過馬路是很危險的！不僅可能會被車撞到，還違反交通法規喔！');
        }
        if (liveLight === 'BLINK' && currentLevel === 3) {
          setLightState('RED'); 
          setHasCrash(true);
          throw new Error('綠燈在閃爍時代表即將轉為紅燈，建議等到下個綠燈再過馬路喔！差點被車撞！');
        }

        stateRefs.current.characterPos += 1;
        setCharacterPos(stateRefs.current.characterPos);
        await wait(400);
    } else if (block.type === BLOCK_TYPES.IF_THEN || block.type === BLOCK_TYPES.IF_ELSE) {
        let conditionMet = false;
        if (block.condition) {
            setActiveBlockId(block.condition.id);
            await wait(200); 
            if (block.condition.type === BLOCK_TYPES.SENSOR_LIGHT_RED && liveLight === 'RED') conditionMet = true;
            if (block.condition.type === BLOCK_TYPES.SENSOR_LIGHT_GREEN && (liveLight === 'GREEN' || liveLight === 'BLINK')) conditionMet = true;
            if (block.condition.type === BLOCK_TYPES.SENSOR_LIGHT_BLINK && liveLight === 'BLINK') conditionMet = true;
        }
        
        if (conditionMet) {
            if (block.thenAction) await executeBlock(block.thenAction);
        } else {
            if (block.elseAction) await executeBlock(block.elseAction);
        }
    }
  };

  try {
      while(stateRefs.current.characterPos < 2 && tick < MAX_TICKS && stateRefs.current.gameStatus !== 'WAITING') {
          // 在每個大迴圈中，重新檢查所有的規則積木
          for (let i = 0; i < blocks.length; i++) {
              if (stateRefs.current.characterPos >= 2) break; // 已過斑馬線就中斷後續積木
              await executeBlock(blocks[i]);
          }
          tick++;
          await wait(300); // 避免過度密集的重啟
      }
  } catch (err) {
      setGameStatus('FAILED');
      setFailReason(err.message);
      setActiveBlockId(null);
      return;
  }

  setActiveBlockId(null);
  
  if (stateRefs.current.characterPos >= 2) {
    setGameStatus('SUCCESS');
  } else {
    setGameStatus('FAILED');
    setFailReason('程式執行到最後，小英雄沒有走到對面馬路！(執行時間過長或缺乏前進指令)');
  }
}
