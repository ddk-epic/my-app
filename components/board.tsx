"use client";

import React, { useMemo, useState } from "react";
import { Column, Id, Task } from "@/types";
import PlusIcon from "./plusIcon";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import ColumnContainer from "./columnContainer";
import { ColumnContainerOverlay, TaskCardOverlay } from "./overlay";

function generateId() {
  return Math.floor(Math.random() * 10000) + 1;
}

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      },
    })
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }
  function deleteTask(id: Id) {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  }
  function updateTask(id: Id, content: string) {
    const updatedTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(updatedTasks);
  }

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
    const filteredTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(filteredTasks);
  }
  function updateColumn(id: Id, title: string) {
    const updatedColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(updatedColumns);
  }

  function onDragStart(e: DragStartEvent) {
    console.log("DRAG START", e);
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }
    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  }
  function onDragEnd(e: DragEndEvent) {
    console.log("DRAG END", e);

    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = e;
    if (!over || active.id === over.id) return;

    setColumns((prev) => {
      const activeColumnIndex = prev.findIndex((col) => col.id === active.id);
      const overColumnIndex = prev.findIndex((col) => col.id === over.id);
      if (activeColumnIndex === -1 || overColumnIndex === -1) return prev;

      return arrayMove(prev, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(e: DragOverEvent) {
    console.log("DRAG OVER", e);
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const isActiveTask = active.data.current?.type === "Task";
    if (!isActiveTask) return;
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    // task over task
    if (isOverTask) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((task) => task.id === active.id);
        const overIndex = prev.findIndex((task) => task.id === over.id);
        if (activeIndex === -1 || overIndex === -1) return prev;

        const updatedTasks = [...prev];
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          columnId: updatedTasks[overIndex].columnId,
        };

        return arrayMove(updatedTasks, activeIndex, overIndex);
      });
    }
    // task over column
    else if (isOverColumn) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((task) => task.id === active.id);
        if (activeIndex === -1) return prev;

        const updatedTasks = [...prev];
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          columnId: over.id,
        };

        return updatedTasks;
      });
    }
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-2">
          <SortableContext items={columnsId}>
            <div className="flex gap-2">
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
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
        {/* --------------- Overlay --------------- */}
        {
          <DragOverlay>
            {activeColumn && (
              <ColumnContainerOverlay
                column={activeColumn}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && <TaskCardOverlay task={activeTask} />}
          </DragOverlay>
        }
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
