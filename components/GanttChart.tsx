import React from 'react';
import { Task, TaskStatus } from '../types';
import { USERS } from '../constants';

interface GanttChartProps {
  tasks: Task[];
  startDate: Date;
  endDate: Date;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, startDate, endDate }) => {
  const getDaysDiff = (d1: Date, d2: Date) => {
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const totalDays = getDaysDiff(startDate, endDate);

  const getTaskStyle = (task: Task) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const right = (getDaysDiff(startDate, taskStart) / totalDays) * 100;
    const width = (getDaysDiff(taskStart, taskEnd) / totalDays) * 100;
    
    return {
      right: `${right}%`,
      width: `${width}%`,
    };
  };

  const statusColors: { [key: string]: string } = {
    [TaskStatus.Completed]: 'bg-green-500',
    [TaskStatus.InProgress]: 'bg-blue-500',
    [TaskStatus.Pending]: 'bg-yellow-500',
    [TaskStatus.Overdue]: 'bg-red-500',
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-dark-text dark:text-dark-text-primary">الجدول الزمني للمشروع</h4>
      <div className="relative">
        <div className="absolute w-full h-full border-r border-gray-200 dark:border-dark-border">
            {/* You could add vertical grid lines here */}
        </div>
        {tasks.map((task, index) => {
          const user = USERS.find(u => u.id === task.assignedTo);
          return (
            <div key={task.id} className="relative mb-2 h-10 flex items-center">
              <div 
                className={`absolute h-8 rounded ${statusColors[task.status]} text-white text-xs flex items-center px-2 shadow-sm`}
                style={getTaskStyle(task)}
                title={`${task.title} - ${user?.name}`}
              >
                <span className="truncate font-medium">{task.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GanttChart;