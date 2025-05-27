import React from "react";
import { Column, Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcon from "./plusIcon";
import TrashIcon from "./trashIcon";
import TaskCard from "./card";

interface ColumnContainerOverlayProps {
  column: Column;
  tasks: Task[];
}

function ColumnContainerOverlay(props: ColumnContainerOverlayProps) {
  const { column, tasks } = props;
  const { setNodeRef, transform, transition } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-primary w-[350px] h-[600px] rounded-md flex flex-col"
    >
      {/* Column Title */}
      <div className="bg-highlight h-[50px] min-h-[50px] flex items-center justify-between px-2 text-primary font-bold rounded-t-md">
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-primary !text-secondary px-2 py-0.5 text-sm rounded-full">
            0
          </div>
          {column.title}
        </div>
        <button>
          <TrashIcon />
        </button>
      </div>
      {/* Column Content */}
      <div className="flex flex-grow flex-col gap-4 p-2 text-md overflow-x-hidden overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard task={task} />
        ))}
      </div>
      {/* Column Footer */}
      <div className="h-[50px] flex items-center gap-2 p-2 text-md rounded-b-md hover:bg-highlight hover:text-primary">
        <PlusIcon />
        <button>Add Task</button>
      </div>
    </div>
  );
}

export default ColumnContainerOverlay;
