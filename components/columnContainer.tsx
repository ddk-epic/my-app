import React, { useMemo, useState } from "react";
import { Column, Id, Task } from "@/types";
import TrashIcon from "./trashIcon";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcon from "./plusIcon";
import TaskCard from "./card";

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Task[];
}

function ColumnContainer(props: ColumnContainerProps) {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    deleteTask,
    updateTask,
    tasks,
  } = props;
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-primary w-[350px] h-[600px] opacity-80 border-4 border-highlight rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-primary w-[350px] h-[600px] rounded-md flex flex-col"
    >
      {/* Column Title */}
      <div
        onClick={() => setEditMode(true)}
        className="bg-highlight h-[50px] min-h-[50px] flex items-center justify-between px-2 text-primary font-bold rounded-t-md"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-primary !text-secondary px-2 py-0.5 text-sm rounded-full">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              onBlur={() => setEditMode(false)}
              autoFocus
              className="bg-highlight w-3/4 border-rounded outline-none"
            />
          )}
        </div>
        <button
          className="cursor-pointer"
          onClick={() => deleteColumn(column.id)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            setEditMode(false);
          }}
        >
          <TrashIcon />
        </button>
      </div>
      {/* Column Content */}
      <div className="flex flex-grow flex-col gap-4 p-2 text-md overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column Footer */}
      <div>
        <button
          onClick={() => createTask(column.id)}
          className="h-[50px] min-w-[350px] flex items-center gap-2 p-2 text-md rounded-b-md hover:bg-highlight hover:text-primary"
        >
          <PlusIcon /> Add Task
        </button>
      </div>
    </div>
  );
}

export default ColumnContainer;
