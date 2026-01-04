import { Clock, Calendar } from 'lucide-react';
import type { TimeSession } from '../lib/database.types';

interface SessionHistoryProps {
  sessions: TimeSession[];
  taskTitles: Map<string, string>;
}

export default function SessionHistory({ sessions, taskTitles }: SessionHistoryProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalTime = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border-2 border-gray-100">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={20} />
            Session History
          </h2>
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">{formatDuration(totalTime)}</span>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        {sessions.length > 0 ? (
          <div className="divide-y">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900 mb-1">
                      {taskTitles.get(session.task_id || '') || 'Unknown Task'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDateTime(session.start_time)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">
                      {formatDuration(session.duration)}
                    </div>
                    {session.break_duration > 0 && (
                      <div className="text-xs text-gray-500">
                        Break: {formatDuration(session.break_duration)}
                      </div>
                    )}
                  </div>
                </div>
                {session.notes && (
                  <p className="text-sm text-gray-600 mt-2">{session.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <Clock size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No session history yet</p>
            <p className="text-xs mt-1">Start tracking time on tasks to see your history</p>
          </div>
        )}
      </div>
    </div>
  );
}
