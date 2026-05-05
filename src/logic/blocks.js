// src/logic/blocks.js
export const BLOCK_TYPES = {
  // 動作 (action)
  FORWARD: 'FORWARD',
  STOP: 'STOP',
  LOOK_AROUND: 'LOOK_AROUND',
  LOOK_AND_FORWARD: 'LOOK_AND_FORWARD',
  
  // 條件 (condition - 原 logic)
  IF_ELSE: 'IF_ELSE',
  IF_THEN: 'IF_THEN',
  
  // 判斷 (judge - 原 sensor)
  SENSOR_LIGHT_RED: 'SENSOR_LIGHT_RED',
  SENSOR_LIGHT_GREEN: 'SENSOR_LIGHT_GREEN',
  SENSOR_LIGHT_BLINK: 'SENSOR_LIGHT_BLINK'
};

export const AVAILABLE_BLOCKS = [
  { type: BLOCK_TYPES.FORWARD, label: '往前走一步', category: 'action', color: '#4ade80' },
  { type: BLOCK_TYPES.STOP, label: '停下不動', category: 'action', color: '#f87171' },
  { type: BLOCK_TYPES.LOOK_AROUND, label: '四周看', category: 'action', color: '#fbbf24' },
  { type: BLOCK_TYPES.LOOK_AND_FORWARD, label: '四周看再往前走', category: 'action', color: '#34d399' },
  
  { type: BLOCK_TYPES.IF_THEN, label: '如果 [判斷] 執行...', category: 'condition', color: '#60a5fa' },
  { type: BLOCK_TYPES.IF_ELSE, label: '如果 [判斷] 執行... 否則...', category: 'condition', color: '#60a5fa' },
  
  { type: BLOCK_TYPES.SENSOR_LIGHT_RED, label: '紅綠燈是 紅燈', category: 'judge', color: '#a78bfa' },
  { type: BLOCK_TYPES.SENSOR_LIGHT_GREEN, label: '紅綠燈是 綠燈', category: 'judge', color: '#a78bfa' },
  { type: BLOCK_TYPES.SENSOR_LIGHT_BLINK, label: '紅綠燈是 閃爍綠燈', category: 'judge', color: '#a78bfa' },
];

export const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

// 定義各關卡可以取用的積木類型清單
export const LEVEL_AVAILABLE_BLOCKS = {
  0: [BLOCK_TYPES.LOOK_AND_FORWARD], 
  1: [BLOCK_TYPES.LOOK_AROUND, BLOCK_TYPES.FORWARD, BLOCK_TYPES.LOOK_AND_FORWARD],
  2: [
    BLOCK_TYPES.LOOK_AROUND, BLOCK_TYPES.FORWARD, BLOCK_TYPES.LOOK_AND_FORWARD, 
    BLOCK_TYPES.STOP, BLOCK_TYPES.IF_THEN, 
    BLOCK_TYPES.SENSOR_LIGHT_GREEN, BLOCK_TYPES.SENSOR_LIGHT_RED
  ],
  3: [
    BLOCK_TYPES.LOOK_AROUND, BLOCK_TYPES.FORWARD, BLOCK_TYPES.LOOK_AND_FORWARD,
    BLOCK_TYPES.STOP, BLOCK_TYPES.IF_THEN, BLOCK_TYPES.IF_ELSE,
    BLOCK_TYPES.SENSOR_LIGHT_GREEN, BLOCK_TYPES.SENSOR_LIGHT_RED, BLOCK_TYPES.SENSOR_LIGHT_BLINK
  ]
};
