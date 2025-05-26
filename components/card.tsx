import React from "react";
import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white h-[100px] min-h-[100px] flex items-center p-2 text-left hover:ring-2 hover:ring-inset hover:ring-highlight cursor-grabs">
      {task.content}
    </div>
  );
}

export default TaskCard;
