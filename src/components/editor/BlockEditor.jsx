import React, { useState } from 'react';
import {
  DndContext,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import Toolbox from './Toolbox';
import Workspace from './Workspace';
import TrashCan from './TrashCan';
import { BlockCard } from './BlockItem';
import { generateId } from '../../logic/blocks';
import { useGame } from '../../logic/GameContext';
import styles from './BlockEditor.module.css';

export default function BlockEditor() {
  const { blocks: items, setBlocks: setItems, gameStatus } = useGame();
  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    if (gameStatus === 'RUNNING') return;

    const { active } = event;
    if (active.data.current?.isTemplate) {
      setActiveItem(active.data.current.block);
    } else if (active.data.current?.isNestedChild) {
      // It's a child being dragged out of a slot
      setActiveItem(active.data.current.block);
    } else {
      setActiveItem(items.find((item) => item.id === active.id) || null);
    }
  };

  const updateBlockNested = (itemsList, parentId, slotName, newBlock) => {
    return itemsList.map(item => {
      if (item.id === parentId) {
        return { ...item, [slotName]: newBlock };
      }
      return item;
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveItem(null);

    if (gameStatus === 'RUNNING') return;

    const isTemplate = active.data.current?.isTemplate;
    const isNestedChild = active.data.current?.isNestedChild;
    const activeBlock = isTemplate 
      ? { ...active.data.current.block, id: generateId() } 
      : (isNestedChild ? active.data.current.block : items.find(i => i.id === active.id));

    if (!activeBlock) return;

    // 清空原本的嵌套如果它是從槽裡抓出來的
    let preState = items;
    if (isNestedChild) {
        preState = updateBlockNested(items, active.data.current.parentId, active.data.current.slotName, null);
    }

    if (!over) {
        // Drop outside workspace => delete
        if (!isTemplate && !isNestedChild) {
            setItems(prev => prev.filter(i => i.id !== active.id));
        } else if (isNestedChild) {
            setItems(preState); // It was already removed from parent in preState
        }
        return; 
    }

    const overId = over.id;

    if (overId === 'trash') {
        if (!isTemplate && !isNestedChild) {
            setItems(prev => prev.filter(i => i.id !== active.id));
        } else if (isNestedChild) {
            setItems(preState);
        }
        return;
    }

    if (typeof overId === 'string' && (overId.includes('-condition') || overId.includes('-thenAction') || overId.includes('-elseAction'))) {
        const [parentId, slotName] = overId.split('-');
        
        const accept = over.data.current?.accept;
        if (activeBlock.category !== accept) return; // 類型不符不處理

        setItems(() => {
            let nextState = preState;
            if (!isTemplate && !isNestedChild) {
                nextState = nextState.filter(i => i.id !== active.id);
            }
            return updateBlockNested(nextState, parentId, slotName, activeBlock);
        });
        return;
    }

    if (isTemplate || isNestedChild) {
      setItems(() => {
        if (overId === 'workspace-droppable') {
           return [...preState, activeBlock];
        } else {
           const overIndex = preState.findIndex((i) => i.id === overId);
           if (overIndex !== -1) {
             const newItems = [...preState];
             newItems.splice(overIndex + 1, 0, activeBlock);
             return newItems;
           }
           return [...preState, activeBlock];
        }
      });
    } else {
      if (active.id !== over.id && overId !== 'workspace-droppable') {
        setItems((itemsList) => {
          const oldIndex = itemsList.findIndex((i) => i.id === active.id);
          const newIndex = itemsList.findIndex((i) => i.id === over.id);
          return arrayMove(itemsList, oldIndex, newIndex);
        });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.editorContainer} style={{ position: 'relative' }}>
        <Toolbox />
        <Workspace items={items} />
        <TrashCan />
      </div>

      <DragOverlay>
        {activeItem ? <BlockCard block={activeItem} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
