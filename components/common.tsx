import React from 'react';
import { TaskStatus, EquipmentStatus, ProjectStatus, ExpenseStatus, SupplierOrderStatus, AttendanceStatus } from '../types';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${className}`}>
    {title && <h3 className="text-lg font-semibold text-dark-text mb-4">{title}</h3>}
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
        <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
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
    [TaskStatus.Completed]: 'bg-green-100 text-green-800',
    [TaskStatus.InProgress]: 'bg-blue-100 text-blue-800',
    [TaskStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [TaskStatus.Overdue]: 'bg-red-100 text-red-800',
    'Available': 'bg-green-100 text-green-800',
    'InUse': 'bg-blue-100 text-blue-800',
    'Maintenance': 'bg-red-100 text-red-800',
    'OnTrack': 'bg-green-100 text-green-800',
    'AtRisk': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Ordered': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-indigo-100 text-indigo-800',
    'Delivered': 'bg-green-100 text-green-800',
    [AttendanceStatus.Present]: 'bg-green-100 text-green-800',
    [AttendanceStatus.Absent]: 'bg-red-100 text-red-800',
  };

  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`${baseClasses} ${colorClass}`}>
      {status}
    </span>
  );
};