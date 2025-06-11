// components/TaskCard.tsx

import Link from 'next/link';

type Task = {
  id?: number;
  card_name: string;
  tags: string[];
};

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => (
  <div className="flex-shrink-0 w-64 h-48 rounded bg-gray-200 p-2 flex flex-col">
    <div className="flex-1">{task.card_name}</div>

    <div className="flex items-center justify-center mt-1">
      <Link href={`/yard/${task.id}`}>
        <button className="bg-blue-300 cursor-pointer hover:bg-blue-600 px-4 py-2 rounded">
          View
        </button>
      </Link>
    </div>

    <div className="space-x-4 mt-1.5">
      <button className="p-2 bg-gray-600 rounded hover:bg-gray-300 transition">Edit</button>
      <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
    </div>

    <div className="overflow-y-auto flex flex-wrap gap-2 items-start mt-1">
      {task.tags.map((tag) => (
        <span key={tag} className="rounded bg-red-300 px-2 py-1 text-xs text-white">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default TaskCard;
