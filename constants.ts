import { Role, User, Project, Task, TaskStatus, Milestone, Material, Equipment, Expense, SupplierOrder, Conversation, Message, ManpowerAgent, ProjectStatus, EquipmentStatus, ExpenseCategory, ExpenseStatus, SupplierOrderStatus, AttendanceStatus, DailyLog } from './types';

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
  { id: 4, name: 'مشروع سترة', client: 'وزارة الإسكان', startDate: '2024-05-01', endDate: '2026-12-31', budget: 12000000, spent: 150000, status: 'OnTrack', completion: 5 },
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
    { id: 1, name: 'خالد عبد الله', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100001', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 2, name: 'فيصل علي', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100002', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 3, name: 'حسن جاسم', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100003', dateAdded: '2024-07-29', attendance: AttendanceStatus.Absent },
    { id: 4, name: 'ماجد إبراهيم', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100004', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 5, name: 'بدر ناصر', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100005', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 6, name: 'عادل مبارك', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100006', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 7, name: 'طارق يوسف', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100007', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 8, name: 'سعيد راشد', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100008', dateAdded: '2024-07-29', attendance: AttendanceStatus.Absent },
    { id: 9, name: 'نواف حمد', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100009', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 10, name: 'ياسر فهد', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100010', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 11, name: 'محمد سلمان', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100011', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 12, name: 'عمر خليفة', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100012', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 13, name: 'راكان أحمد', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100013', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 14, name: 'وليد قاسم', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100014', dateAdded: '2024-07-29', attendance: AttendanceStatus.Absent },
    { id: 15, name: 'صالح جمال', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100015', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 16, name: 'فواز نزار', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100016', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 17, name: 'زياد أيمن', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100017', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 18, name: 'عبد العزيز', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100018', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 19, name: 'هشام محمود', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100019', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 20, name: 'علي حسين', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100020', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 21, name: 'جابر سيف', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100021', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 22, name: 'فهد مسعود', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100022', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 23, name: 'مشعل عيسى', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100023', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 24, name: 'ناصر عادل', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100024', dateAdded: '2024-07-29', attendance: AttendanceStatus.Absent },
    { id: 25, name: 'سعود مبارك', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100025', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 26, name: 'رائد يحيى', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100026', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 27, name: 'سامي مصطفى', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100027', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 28, name: 'كريم عمار', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100028', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 29, name: 'وائل بشار', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100029', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 30, name: 'إياد زكي', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100030', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 31, name: 'جواد نبيل', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100031', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 32, name: 'سفيان ماهر', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100032', dateAdded: '2024-07-29', attendance: AttendanceStatus.Absent },
    { id: 33, name: 'رامي صلاح', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100033', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 34, name: 'معاذ فيصل', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100034', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 35, name: 'ضياء الدين', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100035', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 36, name: 'أنس طلال', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100036', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 37, name: 'كمال عادل', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100037', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 38, name: 'نورس سامر', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100038', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 39, name: 'يزن عمر', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100039', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 40, name: 'حاتم نزار', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100040', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 41, name: 'قيس سعيد', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100041', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 42, name: 'ريان راشد', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100042', dateAdded: '2024-07-29', attendance: AttendanceStatus.Absent },
    { id: 43, name: 'أيوب حمد', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100043', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 44, name: 'مروان خالد', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100044', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 45, name: 'تامر فهد', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100045', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 46, name: 'غسان علي', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100046', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 47, name: 'مهند إبراهيم', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100047', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 48, name: 'هشام عبد الله', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100048', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
    { id: 49, name: 'بشار يوسف', position: 'سباك', workplace: 'مشروع سترة', cpr: '900100049', dateAdded: '2024-07-29', attendance: AttendanceStatus.Absent },
    { id: 50, name: 'صبري محمود', position: 'عامل', workplace: 'مشروع سترة', cpr: '900100050', dateAdded: '2024-07-29', attendance: AttendanceStatus.Present },
];

export const DAILY_LOGS: DailyLog[] = [
  { 
    id: 1, 
    date: '2024-07-27', 
    submittedById: 2, // Bob Williams (Site Supervisor)
    workplace: 'برج المكاتب في وسط المدينة',
    entries: [
      { agentId: 1, status: AttendanceStatus.Present, tasks: 'تركيب قوالب الطابق الخامس' },
      { agentId: 2, status: AttendanceStatus.Present, tasks: 'تثبيت حديد التسليح للجدران' },
      { agentId: 3, status: AttendanceStatus.Absent, tasks: '' },
      { agentId: 4, status: AttendanceStatus.Present, tasks: 'تمديدات السباكة الرئيسية' },
      { agentId: 5, status: AttendanceStatus.Present, tasks: 'تجهيز أعمال النجارة للأسقف' },
    ]
  },
  { 
    id: 2, 
    date: '2024-07-28', 
    submittedById: 2,
    workplace: 'مشروع إسكان الضواحي',
    entries: [
      { agentId: 1, status: AttendanceStatus.Present, tasks: 'تجميع الهياكل الخشبية للفيلا رقم 5' },
      { agentId: 2, status: AttendanceStatus.Present, tasks: 'لحام البوابات الرئيسية' },
      { agentId: 3, status: AttendanceStatus.Present, tasks: 'توصيل لوحة الكهرباء الرئيسية' },
      { agentId: 4, status: AttendanceStatus.Present, tasks: 'تركيب أنابيب الصرف الصحي' },
      { agentId: 5, status: AttendanceStatus.Absent, tasks: '' },
    ]
  }
];