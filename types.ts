export enum Role {
  ProjectManager = 'ProjectManager',
  Worker = 'Worker',
  FinanceManager = 'FinanceManager',
  EquipmentOperator = 'EquipmentOperator',
  InventoryManager = 'InventoryManager',
  Supplier = 'Supplier',
  SiteSupervisor = 'SiteSupervisor',
  SiteEngineer = 'SiteEngineer',
  Client = 'Client',
}

export interface User {
  id: number;
  name: string;
  role: Role;
  avatar: string;
  password?: string;
  dashboardWidgets?: string[];
}

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Overdue = 'Overdue',
}

export interface Task {
  id: number;
  title: string;
  projectId: number;
  assignedTo: number;
  status: TaskStatus;
  startDate: string;
  endDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completion: number;
}

export type ProjectStatus = 'OnTrack' | 'AtRisk' | 'Completed';

export interface Project {
  id: number;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  status: ProjectStatus;
  completion: number;
}

export interface Milestone {
  id: number;
  projectId: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Material {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
}

export type EquipmentStatus = 'Available' | 'InUse' | 'Maintenance';

export interface Equipment {
  id: number;
  name: string;
  status: EquipmentStatus;
  operatorId: number | null;
  nextMaintenance: string;
}

export type ExpenseCategory = 'Materials' | 'Labor' | 'Machinery' | 'Permits';
export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Expense {
    id: number;
    projectId: number;
    description: string;
    amount: number;
    date: string;
    category: ExpenseCategory;
    status: ExpenseStatus;
}

export type SupplierOrderStatus = 'Ordered' | 'Shipped' | 'Delivered';

export interface SupplierOrder {
  id: number;
  supplierId: number;
  materialId: number;
  quantity: number;
  orderDate: string;
  deliveryDate: string;
  status: SupplierOrderStatus;
  cost: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: number;
  subject: string;
  participantIds: number[];
}

export enum AttendanceStatus {
  Present = 'Present',
  Absent = 'Absent',
}

export interface ManpowerAgent {
  id: number;
  name: string;
  position: string;
  workplace: string;
  cpr: string;
  dateAdded: string;
  attendance: AttendanceStatus;
}