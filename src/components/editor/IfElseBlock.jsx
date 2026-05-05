import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { BlockCard } from './BlockItem';
import styles from './IfElseBlock.module.css';

function NestedDraggableBlock({ block, parentId, slotName }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `nested-${block.id}`,
        data: { isNestedChild: true, block, parentId, slotName }
    });
    
    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={{ width: '100%', margin: 0, opacity: isDragging ? 0.5 : 1 }}>
            <BlockCard block={block} isNested={true} />
        </div>
    );
}

function Slot({ id, label, block, accept, disabled, parentId, slotName }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: { accept },
        disabled: disabled || block // disable dropping if already occupied
    });
    
    return (
        <div ref={setNodeRef} className={`${styles.slot} ${isOver ? styles.slotOver : ''}`}>
            {block ? (
                <NestedDraggableBlock block={block} parentId={parentId} slotName={slotName} />
            ) : (
                <span>{label}</span>
            )}
        </div>
    );
}

export default function IfElseBlock({ block, isToolbox }) {
    const slotProps = (slotName, label, accept) => ({
        id: isToolbox ? `template-ifelse-${slotName}` : `${block.id}-${slotName}`,
        parentId: block.id,
        slotName: slotName,
        label,
        block: block[slotName],
        accept,
        disabled: isToolbox
    });

    return (
        <div className={styles.container}>
            {block.type === 'IF_ELSE' || block.type === 'IF_THEN' ? (
              <div className={styles.row}>
                  如果 <Slot {...slotProps('condition', '[ 需為判斷積木 ]', 'judge')} />
              </div>
            ) : null}
            <div className={styles.row}>
                執行 <Slot {...slotProps('thenAction', '[ 需為動作積木 ]', 'action')} />
            </div>
            {block.type === 'IF_ELSE' && (
                <div className={styles.row}>
                    否則 <Slot {...slotProps('elseAction', '[ 需為動作積木 ]', 'action')} />
                </div>
            )}
        </div>
    );
}
