import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';

export default function TrashCan() {
  const { setNodeRef, isOver } = useDroppable({ id: 'trash' });
  return (
    <div ref={setNodeRef} style={{
      position: 'absolute', bottom: 20, right: 20,
      width: 65, height: 65, borderRadius: '50%',
      backgroundColor: isOver ? '#ef4444' : '#fee2e2',
      color: isOver ? 'white' : '#ef4444',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'all 0.2s',
      zIndex: 50
    }}>
        <Trash2 size={32} />
    </div>
  );
}
