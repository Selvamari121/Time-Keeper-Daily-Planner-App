import { useState, useEffect } from 'react';
import { Plus, Calendar, List, BarChart3, Clock as ClockIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import Timer from './components/Timer';
import DailySchedule from './components/DailySchedule';
import SessionHistory from './components/SessionHistory';
import ProductivityInsights from './components/ProductivityInsights';
import NotificationBanner, { type NotificationType } from './components/NotificationBanner';
import { taskService } from './services/taskService';
import { timeSessionService } from './services/timeSessionService';
import type { Task, TaskInsert, TimeSession } from './lib/database.types';

type ViewMode = 'today' | 'tomorrow' | 'list' | 'schedule' | 'insights';
type DisplayMode = 'cards' | 'list';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [activeSession, setActiveSession] = useState<TimeSession | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('cards');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const loadTasks = async () => {
    try {
      const allTasks = await taskService.getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const allSessions = await timeSessionService.getSessionsByDateRange(startDate, new Date());
      setSessions(allSessions);

      const active = await timeSessionService.getActiveSession();
      if (active) {
        setActiveSession(active);
        const task = await taskService.getTaskById(active.task_id!);
        if (task) setSelectedTask(task);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadTasks(), loadSessions()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    checkNotifications();
  }, [tasks, sessions, selectedTask]);

  const checkNotifications = () => {
    const newNotifications: Notification[] = [];

    const overdueTasks = tasks.filter(
      (t) => t.end_time && new Date(t.end_time) < new Date() && t.status !== 'completed' && t.status !== 'cancelled'
    );

    if (overdueTasks.length > 0) {
      newNotifications.push({
        id: 'overdue',
        type: 'overdue',
        title: 'Overdue Tasks',
        message: `You have ${overdueTasks.length} overdue task(s) that need attention.`,
      });
    }

    const upcomingTasks = tasks.filter((t) => {
      if (!t.start_time || t.status === 'completed' || t.status === 'cancelled') return false;
      const startTime = new Date(t.start_time);
      const now = new Date();
      const diff = startTime.getTime() - now.getTime();
      return diff > 0 && diff < 30 * 60 * 1000;
    });

    if (upcomingTasks.length > 0) {
      newNotifications.push({
        id: 'upcoming',
        type: 'starting-soon',
        title: 'Tasks Starting Soon',
        message: `${upcomingTasks.length} task(s) starting within 30 minutes.`,
      });
    }

    if (selectedTask && activeSession && !activeSession.end_time) {
      const startTime = new Date(activeSession.start_time).getTime();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const estimated = selectedTask.estimated_duration * 60;

      if (elapsed > estimated) {
        newNotifications.push({
          id: 'time-exceeded',
          type: 'time-exceeded',
          title: 'Time Exceeded',
          message: `Current task has exceeded estimated duration by ${Math.floor((elapsed - estimated) / 60)} minutes.`,
        });
      }
    }

    const hour = new Date().getHours();
    if (hour === 17 || hour === 18) {
      const todayTasks = tasks.filter((t) => {
        if (!t.start_time) return false;
        const taskDate = new Date(t.start_time);
        return taskDate.toDateString() === today.toDateString();
      });

      const completed = todayTasks.filter((t) => t.status === 'completed').length;

      newNotifications.push({
        id: 'end-of-day',
        type: 'end-of-day',
        title: 'End of Day Summary',
        message: `Completed ${completed} of ${todayTasks.length} tasks today. Great work!`,
      });
    }

    setNotifications(newNotifications);
  };

  const handleCreateTask = async (taskData: TaskInsert) => {
    try {
      await taskService.createTask(taskData);
      await loadTasks();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData: TaskInsert) => {
    if (!editingTask) return;
    try {
      await taskService.updateTask(editingTask.id, taskData);
      await loadTasks();
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStartTimer = async (task: Task) => {
    try {
      if (activeSession && !activeSession.end_time) {
        const startTime = new Date(activeSession.start_time).getTime();
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        await timeSessionService.endSession(activeSession.id, elapsed);
      }

      const newSession = await timeSessionService.createSession({
        task_id: task.id,
        start_time: new Date().toISOString(),
      });

      setActiveSession(newSession);
      setSelectedTask(task);

      await taskService.updateTask(task.id, { status: 'in-progress' });
      await loadTasks();
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const handlePauseTimer = async () => {
    if (!activeSession) return;
    try {
      const startTime = new Date(activeSession.start_time).getTime();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      await timeSessionService.updateSession(activeSession.id, { duration: elapsed });
    } catch (error) {
      console.error('Error pausing timer:', error);
    }
  };

  const handleStopTimer = async (duration: number) => {
    if (!activeSession || !selectedTask) return;
    try {
      await timeSessionService.endSession(activeSession.id, duration);
      await loadSessions();
      setActiveSession(null);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const getFilteredTasks = () => {
    if (viewMode === 'today') {
      return tasks.filter((task) => {
        if (!task.start_time) return false;
        const taskDate = new Date(task.start_time);
        return taskDate.toDateString() === today.toDateString();
      });
    } else if (viewMode === 'tomorrow') {
      return tasks.filter((task) => {
        if (!task.start_time) return false;
        const taskDate = new Date(task.start_time);
        return taskDate.toDateString() === tomorrow.toDateString();
      });
    }
    return tasks;
  };

  const filteredTasks = getFilteredTasks();

  const getTaskActualTime = (taskId: string) => {
    const taskSessions = sessions.filter((s) => s.task_id === taskId);
    return taskSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  };

  const taskTitles = new Map(tasks.map((t) => [t.id, t.title]));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ClockIcon size={48} className="mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Daily Task Planner</h1>
              <p className="text-sm text-gray-600">Stay organized and track your productivity</p>
            </div>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus size={20} />
              New Task
            </button>
          </div>

          <nav className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => setViewMode('today')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                viewMode === 'today'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar size={18} />
              Today
            </button>
            <button
              onClick={() => setViewMode('tomorrow')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                viewMode === 'tomorrow'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ChevronRight size={18} />
              Tomorrow
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List size={18} />
              All Tasks
            </button>
            <button
              onClick={() => setViewMode('schedule')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                viewMode === 'schedule'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ClockIcon size={18} />
              Schedule
            </button>
            <button
              onClick={() => setViewMode('insights')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                viewMode === 'insights'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 size={18} />
              Insights
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <NotificationBanner
          notifications={notifications}
          onDismiss={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
        />

        {viewMode === 'insights' ? (
          <ProductivityInsights tasks={tasks} sessions={sessions} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {viewMode === 'schedule' ? (
                <DailySchedule tasks={filteredTasks} onTaskClick={handleEditTask} />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {viewMode === 'today' && 'Today\'s Tasks'}
                      {viewMode === 'tomorrow' && 'Tomorrow\'s Tasks'}
                      {viewMode === 'list' && 'All Tasks'}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDisplayMode('cards')}
                        className={`p-2 rounded ${displayMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <Calendar size={18} />
                      </button>
                      <button
                        onClick={() => setDisplayMode('list')}
                        className={`p-2 rounded ${displayMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>

                  {filteredTasks.length > 0 ? (
                    <div className={displayMode === 'cards' ? 'grid grid-cols-1 gap-4' : 'space-y-2'}>
                      {filteredTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          onStartTimer={handleStartTimer}
                          actualTime={getTaskActualTime(task.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                      <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-2">No tasks for this view</p>
                      <p className="text-sm text-gray-500">Create a new task to get started</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-6">
              <Timer
                task={selectedTask}
                activeSession={activeSession}
                onStart={handleStartTimer}
                onPause={handlePauseTimer}
                onStop={handleStopTimer}
              />

              <SessionHistory sessions={sessions.slice(0, 10)} taskTitles={taskTitles} />
            </div>
          </div>
        )}
      </main>

      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
