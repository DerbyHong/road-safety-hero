import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockCard } from './BlockItem';
import styles from './BlockEditor.module.css';

function SortableBlock({ block }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BlockCard block={block} isDragging={isDragging} />
    </div>
  );
}

export default function Workspace({ items }) {
  const { setNodeRef } = useDroppable({
    id: 'workspace-droppable',
  });

  return (
    <div ref={setNodeRef} className={styles.workspace}>
      <h3 className={styles.sectionTitle}>您的過馬路指令：</h3>
      {items.length === 0 ? (
        <div className={styles.dropMessage}>請將左側的積木拖拉至此處</div>
      ) : (
        <SortableContext
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map(item => (
            <SortableBlock key={item.id} block={item} />
          ))}
        </SortableContext>
      )}
    </div>
  );
}
