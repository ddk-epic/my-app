import React, { useState } from "react";
import { Id, Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TrashIcon from "./trashIcon";

interface TaskCardProps {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard(props: TaskCardProps) {
  const { task, deleteTask, updateTask } = props;
  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  if (editMode)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative bg-white h-[100px] min-h-[100px] flex items-center p-2 text-left rounded hover:ring-2 hover:ring-inset hover:ring-highlight cursor-grab"
      >
        <textarea
          value={task.content}
          placeholder="Task content"
          onBlur={toggleEditMode}
          onChange={(e) => updateTask(task.id, e.target.value)}
          autoFocus
          className="bg-transparent h-[90%] w-full rounded border-none resize-none outline-none"
        ></textarea>
      </div>
    );

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative bg-white h-[100px] min-h-[100px] flex items-center opacity-80 p-2 text-left rounded ring-1 hover:ring-inset ring-highlight cursor-grab"
      ></div>
    );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="relative group bg-white h-[100px] min-h-[100px] flex items-center p-2 text-left rounded hover:ring-1 hover:ring-inset hover:ring-highlight cursor-grab"
    >
      <p className="h-[90%] w-full my-auto overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>

      <button
        onClick={() => deleteTask(task.id)}
        className="absolute right-2 p-0.5 rounded opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity duration-150"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

export default TaskCard;
