import React from "react";
import { Column, Task } from "@/types";
import PlusIcon from "./plusIcon";
import TrashIcon from "./trashIcon";

interface ColumnContainerOverlayProps {
  column: Column;
  tasks: Task[];
}

export function ColumnContainerOverlay(props: ColumnContainerOverlayProps) {
  const { column, tasks } = props;

  return (
    <div className="bg-primary w-[350px] h-[600px] rounded-md flex flex-col">
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
          <TaskCardOverlay key={task.id} task={task} />
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

export function TaskCardOverlay({ task }: { task: Task }) {
  return (
    <div className="relative bg-white h-[100px] min-h-[100px] flex items-center p-2 text-left rounded hover:ring-1 hover:ring-inset hover:ring-highlight cursor-grab">
      <p className="h-[90%] w-full my-auto overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
    </div>
  );
}
