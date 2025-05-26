import React, { useState } from "react";
import { Column, Id } from "@/types";
import TrashIcon from "./trashIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
}

function ColumnContainer(props: ColumnContainerProps) {
  const { column, deleteColumn, updateColumn } = props;
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
        className="bg-primary min-w-[350px] h-[600px] opacity-80 border-4 border-highlight rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-primary min-w-[350px] h-[600px] rounded-md flex flex-col"
    >
      {/* Column Title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-highlight h-[50px] flex items-center justify-between px-2 text-primary font-bold rounded-t-md"
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
      <div className="flex flex-grow pl-2 text-md">Content</div>
      {/* Column Footer */}
      <div className="flex items-center pl-2 pb-1 text-md">Footer</div>
    </div>
  );
}

export default ColumnContainer;
