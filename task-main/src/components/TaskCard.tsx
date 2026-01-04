import { Clock, AlertCircle, Play, Edit2, Trash2, ExternalLink } from 'lucide-react';
import type { Task } from '../lib/database.types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStartTimer: (task: Task) => void;
  actualTime?: number;
}

export default function TaskCard({ task, onEdit, onDelete, onStartTimer, actualTime }: TaskCardProps) {
  const priorityColors = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200',
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const categoryColors: Record<string, string> = {
    Work: 'bg-blue-50 text-blue-700',
    Personal: 'bg-purple-50 text-purple-700',
    Health: 'bg-green-50 text-green-700',
    Learning: 'bg-orange-50 text-orange-700',
    Shopping: 'bg-pink-50 text-pink-700',
    General: 'bg-gray-50 text-gray-700',
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const isOverdue = task.end_time && new Date(task.end_time) < new Date() && task.status !== 'completed' && task.status !== 'cancelled';

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 p-4 hover:shadow-md transition-all ${isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            {isOverdue && (
              <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                <AlertCircle size={14} />
                Overdue
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[task.status as keyof typeof statusColors] || statusColors.pending}`}>
              {task.status}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full border font-medium ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.Medium}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${categoryColors[task.category] || categoryColors.General}`}>
              {task.category}
            </span>
          </div>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        {task.start_time && (
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {formatTime(task.start_time)}
            {task.end_time && ` - ${formatTime(task.end_time)}`}
          </span>
        )}
        <span className="flex items-center gap-1">
          Est: {task.estimated_duration}m
        </span>
        {actualTime !== undefined && (
          <span className="flex items-center gap-1 font-medium text-blue-600">
            Actual: {formatDuration(actualTime)}
          </span>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-3 border-t">
        <button
          onClick={() => onStartTimer(task)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play size={14} />
          Start
        </button>
        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Edit2 size={14} />
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
        >
          <Trash2 size={14} />
          Delete
        </button>
        {task.attachment_url && (
          <a
            href={task.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
