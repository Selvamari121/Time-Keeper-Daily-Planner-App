import { Clock, AlertCircle } from 'lucide-react';
import type { Task } from '../lib/database.types';

interface DailyScheduleProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function DailySchedule({ tasks, onTaskClick }: DailyScheduleProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getTasksForHour = (hour: number) => {
    return tasks.filter((task) => {
      if (!task.start_time) return false;
      const taskHour = new Date(task.start_time).getHours();
      return taskHour === hour;
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const isOverdue = (task: Task) => {
    return task.end_time && new Date(task.end_time) < new Date() && task.status !== 'completed' && task.status !== 'cancelled';
  };

  const statusColors = {
    pending: 'bg-gray-100 border-gray-300 text-gray-800',
    'in-progress': 'bg-blue-100 border-blue-300 text-blue-800',
    completed: 'bg-green-100 border-green-300 text-green-800',
    cancelled: 'bg-red-100 border-red-300 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border-2 border-gray-100">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Clock size={20} />
          Daily Schedule
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[600px]">
        {hours.map((hour) => {
          const hourTasks = getTasksForHour(hour);
          const hasOverdue = hourTasks.some(isOverdue);

          return (
            <div
              key={hour}
              className={`border-b last:border-b-0 ${hasOverdue ? 'bg-red-50' : 'hover:bg-gray-50'} transition-colors`}
            >
              <div className="flex">
                <div className="w-20 p-3 border-r bg-gray-50 text-center">
                  <div className="text-sm font-medium text-gray-700">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                </div>

                <div className="flex-1 p-3">
                  {hourTasks.length > 0 ? (
                    <div className="space-y-2">
                      {hourTasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                            isOverdue(task)
                              ? 'bg-red-100 border-red-300'
                              : statusColors[task.status as keyof typeof statusColors] || statusColors.pending
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="font-medium text-sm">{task.title}</div>
                            {isOverdue(task) && (
                              <span className="flex items-center gap-1 text-xs text-red-600">
                                <AlertCircle size={12} />
                                Overdue
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">
                            {formatTime(task.start_time!)}
                            {task.end_time && ` - ${formatTime(task.end_time)}`}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 bg-white bg-opacity-50 rounded">
                              {task.category}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-white bg-opacity-50 rounded">
                              {task.priority}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-2">
                      No tasks scheduled
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
