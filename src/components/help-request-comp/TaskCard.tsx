'use client'

import React, { useState } from 'react';

type TaskCardProps = {
  task: {
    card_name: string;
    product_description?: string;
    tags: string[];
    issues: {
      id: number;
      title: string;
      description: string;
      link: string;
      images: string[];
    }[];
  };
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0);

  const prevIssue = () => {
    setCurrentIssueIndex((prev) => (prev === 0 ? task.issues.length - 1 : prev - 1));
  };

  const nextIssue = () => {
    setCurrentIssueIndex((prev) => (prev === task.issues.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col border p-4 rounded shadow w-[400px]">
      <h2 className="text-xl font-bold mb-2">{task.card_name}</h2>

      <div className="flex flex-wrap gap-2 mb-2 overflow-y-auto max-h-14">
        {task.tags.map((tag, i) => (
          <span key={i} className="inline-flex text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="font-semibold mb-1">Issues:</h3>

        {task.issues.length > 0 ? (
          <div className="relative border border-gray-200 rounded p-2">
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={prevIssue}
                className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                ◀
              </button>
              <span className="text-xs text-gray-500">
                {currentIssueIndex + 1} / {task.issues.length}
              </span>
              <button
                onClick={nextIssue}
                className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                ▶
              </button>
            </div>

            {/* Current issue display */}
            <a
              href={task.issues[currentIssueIndex].link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              {task.issues[currentIssueIndex].title}
            </a>
            <p className="text-sm text-gray-600 mt-1">
              {task.issues[currentIssueIndex].description.slice(0, 100)}...
            </p>

            {Array.isArray(task.issues[currentIssueIndex].images) &&
              task.issues[currentIssueIndex].images.length > 0 && (
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {task.issues[currentIssueIndex].images.map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt="Issue"
                      className="h-20 w-20 object-cover border rounded"
                    />
                  ))}
                </div>
              )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No issues found</p>
        )}
      </div>
    </div>
  );
};

export default TaskCard;