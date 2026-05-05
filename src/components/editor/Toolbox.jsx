import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { AVAILABLE_BLOCKS, LEVEL_AVAILABLE_BLOCKS } from '../../logic/blocks';
import { useGame } from '../../logic/GameContext';
import { BlockCard } from './BlockItem';
import styles from './BlockEditor.module.css';

function ToolboxItem({ block }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${block.type}`,
    data: {
      isTemplate: true,
      block,
    },
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <BlockCard block={block} isDragging={isDragging} />
    </div>
  );
}

export default function Toolbox() {
  const { currentLevel } = useGame();
  
  const allowedTypes = LEVEL_AVAILABLE_BLOCKS[currentLevel] || [];
  const activeBlocks = AVAILABLE_BLOCKS.filter(b => allowedTypes.includes(b.type));

  const actionBlocks = activeBlocks.filter(b => b.category === 'action');
  const conditionBlocks = activeBlocks.filter(b => b.category === 'condition');
  const judgeBlocks = activeBlocks.filter(b => b.category === 'judge');

  return (
    <div className={styles.toolboxContainer}>
      <h3 style={{ marginTop: 0 }}>工具箱</h3>
      
      {actionBlocks.length > 0 && (
        <div className={styles.toolboxCategory}>
            <h4>動作</h4>
            {actionBlocks.map(block => (
            <ToolboxItem key={block.type} block={block} />
            ))}
        </div>
      )}

      {conditionBlocks.length > 0 && (
        <div className={styles.toolboxCategory}>
            <h4>條件</h4>
            {conditionBlocks.map(block => (
            <ToolboxItem key={block.type} block={block} />
            ))}
        </div>
      )}

      {judgeBlocks.length > 0 && (
        <div className={styles.toolboxCategory}>
            <h4>判斷</h4>
            {judgeBlocks.map(block => (
            <ToolboxItem key={block.type} block={block} />
            ))}
        </div>
      )}
    </div>
  );
}
