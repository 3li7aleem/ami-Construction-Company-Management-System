import React from 'react';
import { TaskStatus, EquipmentStatus, ProjectStatus, ExpenseStatus, SupplierOrderStatus, AttendanceStatus } from '../types';

// FIX: Extended CardProps with React.HTMLAttributes<HTMLDivElement> to allow passing standard HTML attributes like 'id'.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, ...rest }) => (
  <div className={`bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-100 dark:border-dark-border p-6 ${className}`} {...rest}>
    {title && <h3 className="text-lg font-semibold text-dark-text dark:text-dark-text-primary mb-4">{title}</h3>}
    {children}
  </div>
);

interface ProgressBarProps {
    value: number;
    className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, className = '' }) => {
    const bgColor = value < 30 ? 'bg-red-500' : value < 70 ? 'bg-yellow-400' : 'bg-green-500';
    return (
        <div className={`w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 ${className}`}>
            <div className={`${bgColor} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
        </div>
    );
};

interface StatusBadgeProps {
  status: string; // The translated status string
  type?: 'Task' | 'Equipment' | 'Project' | 'Expense' | 'SupplierOrder' | 'Attendance';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-block";
  
  const statusColors: { [key: string]: string } = {
    [TaskStatus.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [TaskStatus.InProgress]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    [TaskStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    [TaskStatus.Overdue]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'Available': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'InUse': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Maintenance': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'OnTrack': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'AtRisk': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'Ordered': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Shipped': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [AttendanceStatus.Present]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [AttendanceStatus.Absent]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };

  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';

  return (
    <span className={`${baseClasses} ${colorClass}`}>
      {status}
    </span>
  );
};
