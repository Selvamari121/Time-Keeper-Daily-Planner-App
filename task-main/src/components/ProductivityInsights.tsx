import { TrendingUp, CheckCircle, Clock, Target, AlertCircle } from 'lucide-react';
import type { Task, TimeSession } from '../lib/database.types';

interface ProductivityInsightsProps {
  tasks: Task[];
  sessions: TimeSession[];
}

export default function ProductivityInsights({ tasks, sessions }: ProductivityInsightsProps) {
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in-progress').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalTimeSpent = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const totalTimeSpentHours = (totalTimeSpent / 3600).toFixed(1);

  const categoryTime = tasks.reduce((acc, task) => {
    const taskSessions = sessions.filter((s) => s.task_id === task.id);
    const time = taskSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    acc[task.category] = (acc[task.category] || 0) + time;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors: Record<string, string> = {
    Work: 'bg-blue-500',
    Personal: 'bg-purple-500',
    Health: 'bg-green-500',
    Learning: 'bg-orange-500',
    Shopping: 'bg-pink-500',
    General: 'bg-gray-500',
  };

  const maxCategoryTime = Math.max(...Object.values(categoryTime), 1);

  const plannedVsActual = tasks.map((task) => {
    const taskSessions = sessions.filter((s) => s.task_id === task.id);
    const actualTime = taskSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60;
    return {
      planned: task.estimated_duration,
      actual: actualTime,
      task: task.title,
    };
  }).filter((item) => item.actual > 0);

  const totalPlanned = plannedVsActual.reduce((sum, item) => sum + item.planned, 0);
  const totalActual = plannedVsActual.reduce((sum, item) => sum + item.actual, 0);
  const accuracyScore = totalPlanned > 0 ? Math.round((Math.min(totalPlanned, totalActual) / Math.max(totalPlanned, totalActual)) * 100) : 0;

  const overdueCount = tasks.filter(
    (t) => t.end_time && new Date(t.end_time) < new Date() && t.status !== 'completed' && t.status !== 'cancelled'
  ).length;

  const focusScore = Math.max(0, 100 - (overdueCount * 10) - ((100 - completionRate) / 2));

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-gray-900">{totalTimeSpentHours}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Focus Score</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(focusScore)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Task Status
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-gray-900">{completedTasks} tasks</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-gray-900">{pendingTasks} tasks</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${100 - completionRate}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Tasks</span>
                <span className="text-2xl font-bold text-gray-900">{totalTasks}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target size={20} />
            Time by Category
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryTime)
              .sort(([, a], [, b]) => b - a)
              .map(([category, time]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{category}</span>
                    <span className="font-semibold text-gray-900">{formatDuration(time)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${categoryColors[category] || 'bg-gray-500'} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${(time / maxCategoryTime) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            {Object.keys(categoryTime).length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">No time logged yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border-2 border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={20} />
          Planned vs Actual Time
        </h3>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Time Estimation Accuracy</p>
              <p className="text-3xl font-bold text-blue-600">{accuracyScore}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Planned: {totalPlanned.toFixed(0)}m</p>
              <p className="text-sm text-gray-600">Actual: {totalActual.toFixed(0)}m</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {plannedVsActual.map((item, index) => (
            <div key={index} className="border-b pb-3 last:border-b-0">
              <div className="text-sm font-medium text-gray-900 mb-2">{item.task}</div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Planned</span>
                    <span className="font-semibold">{item.planned}m</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-full rounded-full"
                      style={{ width: `${Math.min((item.planned / Math.max(item.planned, item.actual)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Actual</span>
                    <span className="font-semibold">{item.actual.toFixed(0)}m</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${item.actual > item.planned ? 'bg-red-400' : 'bg-green-400'}`}
                      style={{ width: `${Math.min((item.actual / Math.max(item.planned, item.actual)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {plannedVsActual.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-4">No completed tasks with time logs yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
