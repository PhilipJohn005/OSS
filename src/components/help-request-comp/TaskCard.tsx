import React from 'react';

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
  return (
    <div className="border p-4 rounded shadow w-[400px] min-w-[300px]">
      <h2 className="text-xl font-bold">{task.card_name}</h2>
      <p className="text-sm text-gray-700 mb-2">{task.product_description}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {task.tags.map((tag, i) => (
          <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="font-semibold">Issues:</h3>
        {task.issues.length > 0 ? (
          task.issues.map((issue) => (
            <div key={issue.id} className="border border-gray-200 rounded p-2">
              <a
                href={issue.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {issue.title}
              </a>
              <p className="text-sm text-gray-600">{issue.description.slice(0, 100)}...</p>
              {Array.isArray(issue.images) && issue.images.length > 0 && (
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {issue.images.map((imgUrl, i) => (
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
          ))
        ) : (
          <p className="text-gray-500 text-sm">No issues found</p>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
