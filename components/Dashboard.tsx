







import React, { useState } from 'react';
import { User, Role, Project, Task, TaskStatus, Material, Expense, Equipment, ManpowerAgent, ExpenseStatus } from '../types';
import { SUPPLIER_ORDERS } from '../constants';
import { Card, ProgressBar, StatusBadge } from './common';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as Icons from './icons';
import { useTheme } from '../App';


// --- Widget Components ---

// FIX: Added tasks to props and used it to filter myTasks, resolving the "Cannot find name 'TASKS'" error.
const MyTasksWidget = ({ currentUser, projects, tasks }: { currentUser: User, projects: Project[], tasks: Task[] }) => {
  const myTasks = tasks.filter(t => t.assignedTo === currentUser.id);
  return (
    <Card title="مهامي النشطة">
      <ul className="space-y-3">
        {myTasks.length > 0 ? myTasks.slice(0, 4).map(task => {
          const project = projects.find(p => p.id === task.projectId);
          return (
            <li key={task.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-dark-border/50">
              <div>
                <p className="font-semibold text-medium-text dark:text-dark-text-secondary">{task.title}</p>
                <p className="text-sm text-light-text dark:text-slate-400">{project?.name}</p>
              </div>
              <StatusBadge status={task.status} type="Task" />
            </li>
          );
        }) : <p className="text-light-text dark:text-dark-text-secondary">لا توجد مهام مسندة.</p>}
      </ul>
    </Card>
  );
};

const KpiCard = ({ title, value, icon: Icon, iconBgColor }: { title: string, value: string | number, icon: React.FC<{className?: string}>, iconBgColor: string }) => (
    <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-lg border border-gray-100 dark:border-dark-border flex items-center">
        <div className={`p-3 rounded-full ${iconBgColor} mr-4`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <h4 className="font-semibold text-medium-text dark:text-dark-text-secondary text-sm">{title}</h4>
            <p className="text-2xl font-bold text-dark-text dark:text-dark-text-primary">{value}</p>
        </div>
    </div>
);

const KpiSummaryWidget = ({ projects, expenses, tasks }: { projects: Project[], expenses: Expense[], tasks: Task[] }) => {
    const totalBudgetFormatted = new Intl.NumberFormat('ar-BH', {
        style: 'currency',
        currency: 'BHD',
        notation: 'compact',
        compactDisplay: 'short'
    }).format(projects.reduce((sum, p) => sum + p.budget, 0));

    return (
        <div className="col-span-1 lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6">
            <KpiCard title="إجمالي المشاريع" value={projects.length} icon={Icons.ProjectsIcon} iconBgColor="bg-blue-500" />
            <KpiCard title="مهام قيد التنفيذ" value={tasks.filter(t => t.status === TaskStatus.InProgress).length} icon={Icons.TasksIcon} iconBgColor="bg-teal-500" />
            {/* FIX: Compared expense status to the English type value 'Pending' instead of the Arabic translated string. */}
            {/* FIX: 'ExpenseStatus' is a type and cannot be used as a value. Use the string literal 'Pending' instead. */}
            <KpiCard title="موافقات معلقة" value={expenses.filter(e => e.status === 'Pending').length} icon={Icons.ClockIcon} iconBgColor="bg-yellow-500" />
            <KpiCard title="إجمالي الميزانية" value={totalBudgetFormatted} icon={Icons.FinanceIcon} iconBgColor="bg-green-500" />
        </div>
    );
};

const BudgetChartWidget = ({ projects }: { projects: Project[] }) => {
    const { theme } = useTheme();
    const budgetData = projects.map(p => ({ name: p.name, Budget: p.budget, Spent: p.spent }));
    const tickColor = theme === 'dark' ? '#94A3B8' : '#475569';
    return (
        <Card title="ميزانيات المشاريع">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
                    <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} tick={{ fill: tickColor }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#334155' : '#FFFFFF',
                            borderColor: theme === 'dark' ? '#475569' : '#CCCCCC'
                        }}
                        formatter={(value) => new Intl.NumberFormat('ar-BH', { style: 'currency', currency: 'BHD' }).format(Number(value))} />
                    <Legend wrapperStyle={{ color: tickColor }} />
                    <Bar dataKey="Spent" name="المصروف" fill="#82ca9d" />
                    <Bar dataKey="Budget" name="الميزانية" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

const TaskStatusPieChartWidget = ({ tasks }: { tasks: Task[] }) => {
    const { theme } = useTheme();
    const taskStatusCounts = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {} as Record<TaskStatus, number>);
    const pieData = Object.entries(taskStatusCounts).map(([name, value]) => ({ name, value }));
    const COLORS = {
        [TaskStatus.Completed]: '#22C55E',
        [TaskStatus.InProgress]: '#3B82F6',
        [TaskStatus.Pending]: '#FBBF24',
        [TaskStatus.Overdue]: '#EF4444',
    };
    return (
        <Card title="نظرة عامة على حالة المهام">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fill: theme === 'dark' ? '#F1F5F9' : '#1E293B' }}>
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name as TaskStatus]} />)}
                    </Pie>
                     <Tooltip 
                        contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#334155' : '#FFFFFF',
                            borderColor: theme === 'dark' ? '#475569' : '#CCCCCC'
                        }}
                    />
                    <Legend wrapperStyle={{ color: theme === 'dark' ? '#94A3B8' : '#475569' }}/>
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};

const PendingExpensesWidget = ({ expenses, onUpdateExpense }: { expenses: Expense[], onUpdateExpense: (expense: Expense) => void }) => (
    <Card title="طلبات المصاريف المعلقة">
        {/* FIX: Compared expense status to the English type value 'Pending' instead of the Arabic translated string. */}
        {/* FIX: 'ExpenseStatus' is a type and cannot be used as a value. Use the string literal 'Pending' instead. */}
        {expenses.filter(e => e.status === 'Pending').map(expense => (
            <div key={expense.id} className="flex justify-between items-center py-2 border-b dark:border-dark-border">
                <p className="dark:text-dark-text-secondary">{expense.description}</p>
                <p className="font-semibold dark:text-dark-text-primary">{new Intl.NumberFormat('ar-BH', { style: 'currency', currency: 'BHD' }).format(expense.amount)}</p>
                <div className="flex gap-2">
                    <button onClick={() => onUpdateExpense({ ...expense, status: 'Approved' })} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">موافقة</button>
                    <button onClick={() => onUpdateExpense({ ...expense, status: 'Rejected' })} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">رفض</button>
                </div>
            </div>
        ))}
    </Card>
);

const RecentApprovedExpensesWidget = ({ expenses }: { expenses: Expense[] }) => (
    <Card title="المصاريف الموافق عليها مؤخراً">
        {/* FIX: Compared expense status to the English type value 'Approved' instead of the Arabic translated string. */}
        {/* FIX: 'ExpenseStatus' is a type and cannot be used as a value. Use the string literal 'Approved' instead. */}
        {expenses.filter(e => e.status === 'Approved').slice(0, 5).map(expense => (
            <div key={expense.id} className="flex justify-between items-center py-2 border-b dark:border-dark-border">
                <p className="dark:text-dark-text-secondary">{expense.description}</p>
                <p className="font-semibold text-green-600">{new Intl.NumberFormat('ar-BH', { style: 'currency', currency: 'BHD' }).format(expense.amount)}</p>
            </div>
        ))}
    </Card>
);

const InventoryLevelsWidget = ({ materials }: { materials: Material[] }) => (
    <Card title="مستويات المخزون">
        {materials.map(material => (
            <div key={material.id} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <p className="font-medium dark:text-dark-text-secondary">{material.name}</p>
                    <p className={`text-sm ${material.quantity <= material.threshold ? 'text-red-500 font-bold' : 'text-dark-text dark:text-dark-text-primary'}`}>
                        {material.quantity} / {material.threshold} {material.unit}
                    </p>
                </div>
                <ProgressBar value={(material.quantity / (material.threshold * 2)) * 100} />
            </div>
        ))}
    </Card>
);

const SupplierOrdersWidget = ({ materials }: { materials: Material[] }) => (
    <Card title="طلبات الموردين">
        <div className="overflow-x-auto max-h-96">
            <table className="min-w-full text-sm text-right">
                <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0">
                    <tr>
                        <th className="p-3 text-right font-semibold text-medium-text dark:text-dark-text-secondary">المادة</th>
                        <th className="p-3 text-right font-semibold text-medium-text dark:text-dark-text-secondary">الكمية</th>
                        <th className="p-3 text-right font-semibold text-medium-text dark:text-dark-text-secondary">الحالة</th>
                    </tr>
                </thead>
                <tbody className="dark:text-dark-text-secondary">
                    {SUPPLIER_ORDERS.map(order => {
                        const material = materials.find(m => m.id === order.materialId);
                        return (
                            <tr key={order.id} className="border-b dark:border-dark-border hover:bg-gray-50 dark:hover:bg-slate-600/50">
                                <td className="p-3 font-medium">{material?.name || 'غير معروف'}</td>
                                <td className="p-3">{order.quantity} {material?.unit}</td>
                                <td className="p-3"><StatusBadge status={order.status} type="SupplierOrder" /></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </Card>
);

const ActiveTasksWidget = ({ tasks, projects, users, currentUser, onNavigate }: { tasks: Task[], projects: Project[], users: User[], currentUser: User, onNavigate?: (view: string) => void }) => {
    const activeTasks = tasks.filter(t => t.status === TaskStatus.InProgress && t.assignedTo === currentUser.id);
    
    return (
        <div className="h-full cursor-pointer group" onClick={() => onNavigate && onNavigate('Tasks')}>
            <Card title="المهام النشطة حالياً" className="h-full transition-all group-hover:border-primary group-hover:shadow-xl">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                {activeTasks.length > 0 ? activeTasks.map(task => {
                    const project = projects.find(p => p.id === task.projectId);
                    const user = users.find(u => u.id === task.assignedTo);
                    return (
                    <div key={task.id} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-dark-border hover:shadow-md hover:border-primary transition-all">
                        <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-dark-text dark:text-dark-text-primary">{task.title}</p>
                        <div className="flex items-center gap-2">
                            {user && <img src={user.avatar} alt={user.name} title={user.name} className="w-6 h-6 rounded-full" />}
                            <span className="text-xs text-light-text dark:text-dark-text-secondary hidden sm:block">{user?.name}</span>
                        </div>
                        </div>
                        <p className="text-sm text-medium-text dark:text-dark-text-secondary mb-3">
                        <span className="font-semibold">المشروع:</span> {project?.name || 'غير معروف'}
                        </p>
                        <ProgressBar value={task.completion} />
                    </div>
                    );
                }) : (
                    <div className="text-center py-8">
                        <Icons.CheckCircleIcon className="w-12 h-12 mx-auto text-green-400" />
                        <p className="mt-2 text-medium-text dark:text-dark-text-secondary">لا توجد مهام نشطة حالياً. عمل رائع!</p>
                    </div>
                )}
                </div>
            </Card>
        </div>
    );
};

const OnSiteWorkersWidget = ({ users, onNavigate }: { users: User[], onNavigate?: (view: string) => void }) => {
    const onSiteWorkers = users.filter(u => u.role === Role.Worker || u.role === Role.EquipmentOperator);
    return (
        <div className="h-full cursor-pointer group" onClick={() => onNavigate && onNavigate('Manpower')}>
            <Card title={`العاملون في الموقع (${onSiteWorkers.length})`} className="h-full transition-all group-hover:border-primary group-hover:shadow-xl">
                <div className="flex flex-wrap gap-4">
                    {onSiteWorkers.map(user => (
                        <div key={user.id} className="flex items-center space-x-2">
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-medium dark:text-dark-text-secondary">{user.name}</p>
                                <p className="text-xs text-light-text dark:text-dark-text-secondary">{user.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const ProjectProgressWidget = ({ projects }: { projects: Project[] }) => {
    const clientProject = projects[0]; // Assuming client is associated with the first project
    // FIX: The Card component requires a 'children' prop. Added a child paragraph for the empty state and updated the title to be consistent with the widget's purpose.
    if (!clientProject) return <Card title="تقدم المشروع"><p className="dark:text-dark-text-secondary">لا توجد مشاريع لعرضها.</p></Card>;

    return (
        <Card title={`تقدم المشروع: ${clientProject.name}`}>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-lg dark:text-dark-text-secondary">نسبة الإنجاز الكلية</p>
                        <p className="text-lg font-bold text-primary">{clientProject.completion}%</p>
                    </div>
                    <ProgressBar value={clientProject.completion} />
                </div>
            </div>
        </Card>
    );
};

const IncomingOrdersWidget = ({ materials }: { materials: Material[] }) => (
    <Card title="الطلبات الواردة">
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-right">
                <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                        <th className="p-3 text-right font-semibold dark:text-dark-text-secondary">المادة</th>
                        <th className="p-3 text-right font-semibold dark:text-dark-text-secondary">تاريخ التسليم</th>
                        <th className="p-3 text-right font-semibold dark:text-dark-text-secondary">الحالة</th>
                    </tr>
                </thead>
                <tbody className="dark:text-dark-text-secondary">
                    {SUPPLIER_ORDERS.map(order => {
                        const material = materials.find(m => m.id === order.materialId);
                        return (
                            <tr key={order.id} className="border-b dark:border-dark-border">
                                <td className="p-3">{material?.name}</td>
                                <td className="p-3">{order.deliveryDate}</td>
                                <td className="p-3"><StatusBadge status={order.status} type="SupplierOrder" /></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </Card>
);

const MyEquipmentWidget = ({ currentUser, equipment }: { currentUser: User, equipment: Equipment[] }) => {
    const myEquipment = equipment.find(m => m.operatorId === currentUser.id);
    return (
        <Card title="معداتي">
            {myEquipment ? (
                <div>
                    <h3 className="text-xl font-bold dark:text-dark-text-primary">{myEquipment.name}</h3>
                    <div className="mt-4 space-y-2 dark:text-dark-text-secondary">
                        <p>الحالة: <StatusBadge status={myEquipment.status} type="Equipment" /></p>
                        <p>الصيانة التالية: {myEquipment.nextMaintenance}</p>
                    </div>
                </div>
            ) : (
                <p className="dark:text-dark-text-secondary">لم يتم تخصيص أي معدة.</p>
            )}
        </Card>
    );
};

const ManpowerSummaryWidget = ({ manpowerAgents, onNavigate }: { manpowerAgents: ManpowerAgent[], onNavigate?: (view: string) => void }) => {
    const { theme } = useTheme();
    const totalWorkers = manpowerAgents.length;
    const professionCounts = manpowerAgents.reduce((acc, agent) => {
        acc[agent.position] = (acc[agent.position] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topProfessions = Object.entries(professionCounts)
        .map(([name, count]) => ({ name, 'العدد': count }))
        .sort((a, b) => b['العدد'] - a['العدد'])
        .slice(0, 3);
        
    const tickColor = theme === 'dark' ? '#94A3B8' : '#475569';

    return (
        <div className="h-full cursor-pointer group" onClick={() => onNavigate && onNavigate('Manpower')}>
            <Card title="ملخص القوى العاملة" className="h-full transition-all group-hover:border-primary group-hover:shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-medium-text dark:text-dark-text-secondary">إجمالي العمال</p>
                    <p className="text-3xl font-bold text-dark-text dark:text-dark-text-primary">{totalWorkers}</p>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-medium-text dark:text-dark-text-secondary mb-2">أبرز المهن</h4>
                    <ResponsiveContainer width="100%" height={100}>
                        <BarChart data={topProfessions} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                             <XAxis type="number" hide />
                             <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                             <Tooltip 
                                cursor={{fill: theme === 'dark' ? '#475569' : '#F8FAFC'}} 
                                formatter={(value) => `${value} عامل`} 
                                contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? '#334155' : '#FFFFFF',
                                    borderColor: theme === 'dark' ? '#475569' : '#CCCCCC'
                                }}
                            />
                             <Bar dataKey="العدد" fill="#0D9488" barSize={15} radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};


// --- Widget Registry and Config ---

const WIDGETS: { [key: string]: { name: string; component: React.FC<any>; roles: Role[]; colSpan?: number } } = {
    myTasks: { name: 'مهامي النشطة', component: MyTasksWidget, roles: [Role.Worker, Role.EquipmentOperator, Role.SiteEngineer, Role.SiteSupervisor] },
    kpiSummary: { name: 'ملخص المؤشرات', component: KpiSummaryWidget, roles: [Role.ProjectManager], colSpan: 2 },
    budgetChart: { name: 'ميزانيات المشاريع', component: BudgetChartWidget, roles: [Role.ProjectManager] },
    taskStatusPieChart: { name: 'حالة المهام', component: TaskStatusPieChartWidget, roles: [Role.ProjectManager] },
    pendingExpenses: { name: 'مصاريف معلقة', component: PendingExpensesWidget, roles: [Role.FinanceManager] },
    recentApprovedExpenses: { name: 'مصاريف موافق عليها', component: RecentApprovedExpensesWidget, roles: [Role.FinanceManager] },
    inventoryLevels: { name: 'مستويات المخزون', component: InventoryLevelsWidget, roles: [Role.InventoryManager] },
    supplierOrders: { name: 'طلبات الموردين', component: SupplierOrdersWidget, roles: [Role.InventoryManager] },
    activeTasks: { name: 'المهام النشطة', component: ActiveTasksWidget, roles: Object.values(Role), colSpan: 2 },
    onSiteWorkers: { name: 'العاملون في الموقع', component: OnSiteWorkersWidget, roles: [Role.SiteSupervisor, Role.SiteEngineer] },
    projectProgress: { name: 'تقدم المشروع', component: ProjectProgressWidget, roles: [Role.Client] },
    incomingOrders: { name: 'الطلبات الواردة', component: IncomingOrdersWidget, roles: [Role.Supplier] },
    myEquipment: { name: 'معداتي المخصصة', component: MyEquipmentWidget, roles: [Role.EquipmentOperator] },
    manpowerSummary: { name: 'ملخص القوى العاملة', component: ManpowerSummaryWidget, roles: [Role.ProjectManager, Role.SiteSupervisor, Role.SiteEngineer] },
};


// --- Main Dashboard Component ---

interface DashboardProps {
  currentUser: User;
  materials: Material[];
  expenses: Expense[];
  projects: Project[];
  equipment: Equipment[];
  users: User[];
  tasks: Task[];
  manpowerAgents: ManpowerAgent[];
  onUpdateUser: (user: User) => void;
  onNavigate?: (view: string) => void;
  onUpdateExpense: (expense: Expense) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { currentUser, onUpdateUser } = props;
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  const WelcomeHeader = () => (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-dark-text dark:text-dark-text-primary flex items-center gap-3">
        <Icons.DashboardIcon className="w-8 h-8 text-primary"/>
        <span>أهلاً بعودتك، {currentUser.name}!</span>
      </h1>
      <p className="text-light-text dark:text-dark-text-secondary mt-1">إليك نظرة عامة على لوحة التحكم الخاصة بك لليوم.</p>
    </div>
  );
  
  const handleSaveCustomization = (selectedKeys: string[]) => {
      onUpdateUser({ ...currentUser, dashboardWidgets: selectedKeys });
      setIsCustomizeModalOpen(false);
  }

  const widgetsToDisplay = currentUser.dashboardWidgets || [];

  return (
    <div>
      <WelcomeHeader />

      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setIsCustomizeModalOpen(true)}
          className="flex items-center gap-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border text-dark-text dark:text-dark-text-primary px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-sm font-semibold"
        >
            <Icons.EditIcon className="w-4 h-4" />
            <span>تخصيص لوحة التحكم</span>
        </button>
      </div>

       <DashboardCustomizationModal
            isOpen={isCustomizeModalOpen}
            onClose={() => setIsCustomizeModalOpen(false)}
            onSave={handleSaveCustomization}
            currentUserRole={currentUser.role}
            currentSelection={currentUser.dashboardWidgets || []}
        />
        
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgetsToDisplay.length > 0 ? widgetsToDisplay.map(key => {
            const widgetConfig = WIDGETS[key];
            if (!widgetConfig) return null;
            const WidgetComponent = widgetConfig.component;
            const colSpanClass = widgetConfig.colSpan ? `lg:col-span-${widgetConfig.colSpan}` : '';
            return (
                <div key={key} className={colSpanClass}>
                    <WidgetComponent {...props} />
                </div>
            );
        }) : (
            <div className="lg:col-span-2">
                <Card>
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-dark-text dark:text-dark-text-primary">لوحة التحكم فارغة</h3>
                        <p className="text-medium-text dark:text-dark-text-secondary mt-2">
                            انقر على زر "تخصيص لوحة التحكم" لإضافة بعض الأدوات.
                        </p>
                    </div>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
};

// --- Customization Modal ---
interface DashboardCustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedKeys: string[]) => void;
    currentUserRole: Role;
    currentSelection: string[];
}
const DashboardCustomizationModal: React.FC<DashboardCustomizationModalProps> = ({ isOpen, onClose, onSave, currentUserRole, currentSelection }) => {
    const [selected, setSelected] = useState<string[]>(currentSelection);
    
    const availableWidgets = Object.entries(WIDGETS).filter(([, config]) => config.roles.includes(currentUserRole));

    const handleToggle = (key: string) => {
        setSelected(prev => 
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-xl font-bold text-dark-text dark:text-dark-text-primary mb-6">تخصيص لوحة التحكم</h3>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                    {availableWidgets.map(([key, config]) => (
                        <label key={key} htmlFor={key} className="flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer">
                            <input 
                                type="checkbox"
                                id={key}
                                checked={selected.includes(key)}
                                onChange={() => handleToggle(key)}
                                className="h-5 w-5 rounded border-gray-300 dark:border-slate-500 text-primary focus:ring-primary dark:bg-slate-600"
                            />
                            <span className="mr-3 font-medium text-medium-text dark:text-dark-text-secondary">{config.name}</span>
                        </label>
                    ))}
                </div>
                <div className="mt-6 flex justify-end gap-3 pt-4 border-t dark:border-dark-border">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-dark-text dark:text-dark-text-primary rounded-md hover:bg-gray-300 dark:hover:bg-slate-500">إلغاء</button>
                    <button type="button" onClick={() => onSave(selected)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">حفظ التغييرات</button>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;