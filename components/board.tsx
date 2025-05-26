"use client";

import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Column, Id } from "@/types";
import PlusIcon from "./plusIcon";
import ColumnContainer from "./columnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

function generateId() {
  return Math.floor(Math.random() * 10000) + 1;
}

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      },
    })
  );

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  }

  function onDragStart(e: DragStartEvent) {
    console.log("DRAG START", e);
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }
  }
  function onDragEnd(e: DragEndEvent) {
    console.log("DRAG START", e);
    const { active, over } = e;
    if (!over) return;
    if (active.id === over.id) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === active.id
      );
      const overColumnIndex = columns.findIndex((col) => col.id === over.id);
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="m-auto flex gap-2">
          <SortableContext items={columnsId}>
            <div className="flex gap-2">
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                />
              ))}
            </div>
          </SortableContext>
          <button
            className="h-[50px] min-w-[350px] flex items-center pl-2 gap-2 bg-highlight text-primary rounded hover:ring-2 cursor-pointer"
            onClick={createNewColumn}
          >
            <PlusIcon /> Add Column
          </button>
        </div>
        {/* create Portal renders this Overlay into a different part of the DOM */}
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
