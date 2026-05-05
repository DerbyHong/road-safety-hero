import React from 'react';
import styles from './BlockEditor.module.css';
import { useGame } from '../../logic/GameContext';
import IfElseBlock from './IfElseBlock';

export function BlockCard({ block, isDragging, isNested = false }) {
  const { activeBlockId } = useGame();
  const isActive = activeBlockId === block.id;

  if ((block.type === 'IF_ELSE' || block.type === 'IF_THEN') && !isNested) {
    return <IfElseBlock block={block} isToolbox={!block.id} />;
  }

  return (
    <div 
      className={styles.blockItem} 
      style={{ 
        backgroundColor: block.color,
        boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.2)' : 
                   isActive ? '0 0 15px 5px rgba(255, 255, 0, 0.7)' : undefined,
        transform: isDragging ? 'scale(1.05)' : 
                   isActive ? 'scale(1.02)' : 'none',
        border: isActive ? '2px solid yellow' : '2px solid transparent',
        margin: isNested ? '0' : undefined
      }}
    >
      {block.label}
    </div>
  );
}
