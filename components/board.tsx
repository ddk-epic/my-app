"use client";

import React, { useState } from "react";
import PlusIcon from "./plusIcon";
import { Column, Id } from "@/types";
import ColumnContainer from "./columnContainer";

function generateId() {
  return Math.floor(Math.random() * 10000) + 1;
}

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);

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

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden">
      <div className="m-auto flex gap-2">
        <div className="flex gap-2">
          {columns.map((col) => (
            <ColumnContainer column={col} deleteColumn={deleteColumn} />
          ))}
        </div>
        <button
          className="h-[50px] min-w-[350px] flex items-center pl-2 gap-2 bg-highlight text-primary rounded hover:ring-2 cursor-pointer"
          onClick={createNewColumn}
        >
          <PlusIcon /> Add Column
        </button>
      </div>
    </div>
  );
}

export default KanbanBoard;
