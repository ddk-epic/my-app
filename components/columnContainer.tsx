import React from "react";
import { Column, Id } from "@/types";
import TrashIcon from "./trashIcon";

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => void;
}

function ColumnContainer(props: ColumnContainerProps) {
  const { column, deleteColumn } = props;

  return (
    <div className="bg-primary min-w-[350px] h-[600px] rounded-md flex flex-col">
      <div className="bg-highlight h-[50px] flex items-center justify-between px-2 text-primary font-bold rounded-t-md">
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-primary !text-secondary px-2 py-0.5 text-sm rounded-full">
            0
          </div>
          {column.title}
        </div>
        <button
          className="cursor-pointer"
          onClick={() => deleteColumn(column.id)}
        >
          <TrashIcon />
        </button>
      </div>
      <div className="flex flex-grow pl-2 text-md">Content</div>
      <div className="flex items-center pl-2 pb-1 text-md">Footer</div>
    </div>
  );
}

export default ColumnContainer;
