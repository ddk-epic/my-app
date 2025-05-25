import React from 'react'

type TaskCardProps = {
  title: string;
  id: number;
};

function TaskCard({title, id}: TaskCardProps) {
  return (
    <div>
      <div>{title}</div>
      <div>{id}</div>
    </div>

  )
}

export default TaskCard