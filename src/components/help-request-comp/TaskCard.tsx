'use client'

import React from 'react';

type TaskCardProps = {
  task: {
    card_name: string;
    product_description?: string;
    tags: string[];
  };
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="flex flex-col border p-4 rounded shadow w-[400px]">
      <h2 className="text-xl font-bold mb-2">{task.card_name}</h2>

      {task.product_description && (
        <p className="text-sm text-gray-700 mb-2">{task.product_description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-2 overflow-y-auto max-h-14">
        {task.tags.map((tag, i) => (
          <span key={i} className="inline-flex text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
