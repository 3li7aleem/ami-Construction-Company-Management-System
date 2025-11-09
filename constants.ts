import { Role, User, Project, Task, TaskStatus, Milestone, Material, Equipment, Expense, SupplierOrder, Conversation, Message, ManpowerAgent, ProjectStatus, EquipmentStatus, ExpenseCategory, ExpenseStatus, SupplierOrderStatus, AttendanceStatus } from './types';

export const USERS: User[] = [
  { id: 1, name: 'أليس جونسون', role: Role.ProjectManager, avatar: 'https://picsum.photos/seed/alice/100/100', password: 'password123', dashboardWidgets: ['kpiSummary', 'activeTasks', 'budgetChart', 'taskStatusPieChart', 'manpowerSummary'] },
  { id: 2, name: 'بوب ويليامز', role: Role.SiteSupervisor, avatar: 'https://picsum.photos/seed/bob/100/100', password: 'password123', dashboardWidgets: ['activeTasks', 'onSiteWorkers', 'manpowerSummary'] },
  { id: 3, name: 'تشارلي براون', role: Role.Worker, avatar: 'https://picsum.photos/seed/charlie/100/100', password: 'password123', dashboardWidgets: ['myTasks', 'activeTasks'] },
  { id: 4, name: 'ديانا برينس', role: Role.FinanceManager, avatar: 'https://picsum.photos/seed/diana/100/100', password: 'password123', dashboardWidgets: ['pendingExpenses', 'recentApprovedExpenses', 'activeTasks'] },
  { id: 5, name: 'إيثان هانت', role: Role.EquipmentOperator, avatar: 'https://picsum.photos/seed/ethan/100/100', password: 'password123', dashboardWidgets: ['myEquipment', 'myTasks', 'activeTasks'] },
  { id: 6, name: 'فيونا غلينان', role: Role.InventoryManager, avatar: 'https://picsum.photos/seed/fiona/100/100', password: 'password123', dashboardWidgets: ['inventoryLevels', 'supplierOrders', 'activeTasks'] },
  { id: 7, name: 'جورج كوستانزا', role: Role.Supplier, avatar: 'https://picsum.photos/seed/george/100/100', password: 'password123', dashboardWidgets: ['incomingOrders', 'activeTasks'] },
  { id: 8, name: 'هاري بوتر', role: Role.Client, avatar: 'https://picsum.photos/seed/harry/100/100', password: 'password123', dashboardWidgets: ['projectProgress', 'activeTasks'] },
  { id: 9, name: 'آيفي سميث', role: Role.Worker, avatar: 'https://picsum.photos/seed/ivy/100/100', password: 'password123', dashboardWidgets: ['myTasks', 'activeTasks'] },
  { id: 10, name: 'جاك رايان', role: Role.SiteEngineer, avatar: 'https://picsum.photos/seed/jack/100/100', password: 'password123', dashboardWidgets: ['activeTasks', 'onSiteWorkers', 'manpowerSummary'] },
];

export const PROJECTS: Project[] = [
  { id: 1, name: 'برج المكاتب في وسط المدينة', client: 'شركة إينوفيت', startDate: '2024-01-15', endDate: '2025-06-30', budget: 5000000, spent: 2100000, status: 'OnTrack', completion: 45 },
  { id: 2, name: 'مشروع إسكان الضواحي', client: 'شركة هومستيد العقارية', startDate: '2024-03-01', endDate: '2024-12-20', budget: 2500000, spent: 1800000, status: 'AtRisk', completion: 70 },
  { id: 3, name: 'تجديد الجسر الساحلي', client: 'إدارة النقل بالمدينة', startDate: '2023-09-01', endDate: '2024-08-30', budget: 8000000, spent: 7500000, status: 'Completed', completion: 100 },
];

export const TASKS: Task[] = [
  { id: 1, title: 'صب الأساسات', projectId: 1, assignedTo: 3, status: TaskStatus.Completed, startDate: '2024-02-01', endDate: '2024-02-28', priority: 'High', completion: 100 },
  { id: 2, title: 'تركيب الهيكل الفولاذي', projectId: 1, assignedTo: 9, status: TaskStatus.InProgress, startDate: '2024-03-01', endDate: '2024-05-30', priority: 'High', completion: 60 },
  { id: 3, title: 'تسوية الموقع والحفر', projectId: 2, assignedTo: 3, status: TaskStatus.Completed, startDate: '2024-03-05', endDate: '2024-03-30', priority: 'Medium', completion: 100 },
  { id: 4, title: 'تركيب السباكة والكهرباء', projectId: 2, assignedTo: 9, status: TaskStatus.InProgress, startDate: '2024-06-01', endDate: '2024-08-15', priority: 'High', completion: 30 },
  { id: 5, title: 'تقديم التقرير النهائي', projectId: 3, assignedTo: 1, status: TaskStatus.Completed, startDate: '2024-08-20', endDate: '2024-08-30', priority: 'Low', completion: 100 },
  { id: 6, title: 'تركيب الكسوة الخارجية', projectId: 1, assignedTo: 3, status: TaskStatus.Pending, startDate: '2024-09-01', endDate: '2024-10-30', priority: 'Medium', completion: 0 },
];

export const MILESTONES: Milestone[] = [
  { id: 1, projectId: 1, title: 'اكتمال الأساسات', dueDate: '2024-03-01', completed: true },
  { id: 2, projectId: 1, title: 'اكتمال الهيكل', dueDate: '2024-08-15', completed: false },
  { id: 3, projectId: 1, title: 'إغلاق المبنى ضد الماء', dueDate: '2024-11-01', completed: false },
  { id: 4, projectId: 2, title: 'تجهيز أراضي المرحلة الأولى', dueDate: '2024-04-01', completed: true },
  { id: 5, projectId: 2, title: 'افتتاح المنزل النموذجي', dueDate: '2024-09-01', completed: false },
];

export const MATERIALS: Material[] = [
    { id: 1, name: 'خلطة خرسانية', quantity: 500, unit: 'متر مكعب', threshold: 100 },
    { id: 2, name: 'حديد التسليح', quantity: 20, unit: 'طن', threshold: 5 },
    { id: 3, name: 'خشب 2x4', quantity: 8000, unit: 'قطعة', threshold: 1000 },
    { id: 4, name: 'ألواح جبس', quantity: 250, unit: 'لوح', threshold: 50 },
];

export const INITIAL_EQUIPMENT: Equipment[] = [
    { id: 1, name: 'حفارة كات 320', status: 'Available', operatorId: null, nextMaintenance: '2024-10-15' },
    { id: 2, name: 'رافعة برجية ليبهر', status: 'InUse', operatorId: 5, nextMaintenance: '2024-09-01' },
    { id: 3, name: 'شاحنة خلط الخرسانة', status: 'Maintenance', operatorId: null, nextMaintenance: '2024-08-20' },
    { id: 4, name: 'جرافة كوماتسو D65', status: 'Available', operatorId: null, nextMaintenance: '2024-11-05' },
];

export const EXPENSES: Expense[] = [
    { id: 1, projectId: 1, description: 'شراء حديد التسليح', amount: 15000, date: '2024-01-20', category: 'Materials', status: 'Approved' },
    { id: 2, projectId: 1, description: 'إيجار الرافعة (فبراير)', amount: 25000, date: '2024-02-05', category: 'Machinery', status: 'Approved' },
    { id: 3, projectId: 2, description: 'رسوم التصاريح', amount: 5000, date: '2024-03-10', category: 'Permits', status: 'Pending' },
    { id: 4, projectId: 1, description: 'أجور العمل الإضافي', amount: 8000, date: '2024-04-15', category: 'Labor', status: 'Rejected' },
];

export const SUPPLIER_ORDERS: SupplierOrder[] = [
  { id: 1, supplierId: 7, materialId: 1, quantity: 200, orderDate: '2024-07-01', deliveryDate: '2024-07-15', status: 'Shipped', cost: 30000 },
  { id: 2, supplierId: 7, materialId: 3, quantity: 5000, orderDate: '2024-07-05', deliveryDate: '2024-07-20', status: 'Ordered', cost: 12000 },
];

export const CONVERSATIONS: Conversation[] = [
  { id: 1, subject: 'استفسار بخصوص مهمة #2', participantIds: [1, 2] },
  { id: 2, subject: 'تقرير نهاية الأسبوع', participantIds: [1, 10] },
  { id: 3, subject: 'تأخير في تسليم الخرسانة', participantIds: [2, 6] },
];

export const MESSAGES: Message[] = [
  { id: 1, conversationId: 1, senderId: 1, text: 'مرحبًا بوب، هل يمكنك تزويدي بتحديث عن حالة تركيب الهيكل الفولاذي؟', timestamp: '2024-07-25T10:00:00Z' },
  { id: 2, conversationId: 1, senderId: 2, text: 'أهلاً أليس، نحن نسير وفقًا للجدول الزمني. يجب أن ننتهي من الطابق الخامس بحلول نهاية الأسبوع.', timestamp: '2024-07-25T10:05:00Z' },
  { id: 3, conversationId: 1, senderId: 1, text: 'ممتاز، شكرًا على التحديث!', timestamp: '2024-07-25T10:06:00Z' },
  { id: 4, conversationId: 2, senderId: 10, text: 'مرفق تقرير تقدم الموقع لهذا الأسبوع.', timestamp: '2024-07-24T16:30:00Z' },
  { id: 5, conversationId: 2, senderId: 1, text: 'استلمت، سأراجعه. شكرًا جاك.', timestamp: '2024-07-24T16:35:00Z' },
  { id: 6, conversationId: 3, senderId: 2, text: 'فيونا، المورد أبلغنا بتأخير في تسليم الخرسانة غدًا. هل يمكننا تدبر الأمر؟', timestamp: '2024-07-25T09:00:00Z' },
];

export const MANPOWER_AGENTS: ManpowerAgent[] = [
  { id: 1, name: 'أحمد علي', position: 'نجار', workplace: 'برج المكاتب في وسط المدينة', cpr: '850112345', dateAdded: '2024-07-28', attendance: AttendanceStatus.Present },
  { id: 2, name: 'محمد حسن', position: 'حداد', workplace: 'برج المكاتب في وسط المدينة', cpr: '920523456', dateAdded: '2024-07-27', attendance: AttendanceStatus.Present },
  { id: 3, name: 'خالد محمود', position: 'كهربائي', workplace: 'مشروع إسكان الضواحي', cpr: '880934567', dateAdded: '2024-06-26', attendance: AttendanceStatus.Absent },
  { id: 4, name: 'يوسف إبراهيم', position: 'سباك', workplace: 'مشروع إسكان الضواحي', cpr: '950345678', dateAdded: '2024-06-25', attendance: AttendanceStatus.Present },
  { id: 5, name: 'علي رضا', position: 'نجار', workplace: 'تجديد الجسر الساحلي', cpr: '900756789', dateAdded: new Date().toISOString().split('T')[0], attendance: AttendanceStatus.Absent },
];