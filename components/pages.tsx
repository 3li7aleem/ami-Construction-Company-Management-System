import React, { useState, useEffect, useRef } from 'react';
import { TASKS as INITIAL_TASKS, USERS as STATIC_USERS } from '../constants';
import { Card, ProgressBar, StatusBadge } from './common';
import GanttChart from './GanttChart';
import { Project, Task, TaskStatus, Expense, Material, User, Role, Equipment, Conversation, Message, ManpowerAgent, ProjectStatus, EquipmentStatus, ExpenseCategory, ExpenseStatus, AttendanceStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as Icons from './icons';

interface ProjectFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: Project) => void;
    project: Project | null;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ isOpen, onClose, onSave, project }) => {
    const [name, setName] = useState('');
    const [client, setClient] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budget, setBudget] = useState('');
    // FIX: Use ProjectStatus type and English keys for state to maintain data consistency.
    const [status, setStatus] = useState<ProjectStatus>('OnTrack');

    useEffect(() => {
        if (project) {
            setName(project.name);
            setClient(project.client);
            setStartDate(project.startDate);
            setEndDate(project.endDate);
            setBudget(project.budget.toString());
            setStatus(project.status);
        } else {
            setName('');
            setClient('');
            const today = new Date().toISOString().split('T')[0];
            setStartDate(today);
            setEndDate('');
            setBudget('');
            // FIX: Set default status to English key.
            setStatus('OnTrack');
        }
    }, [project, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !client || !startDate || !endDate || !budget) return;
        
        // In a real app, spent and completion would be calculated, but we'll preserve them on edit.
        const spent = project ? project.spent : 0;
        const completion = project ? project.completion : 0;

        onSave({
            id: project?.id || Date.now(),
            name,
            client,
            startDate,
            endDate,
            budget: parseFloat(budget),
            status,
            spent,
            completion,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-xl font-bold text-dark-text mb-6">{project ? 'تعديل مشروع' : 'إضافة مشروع جديد'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">اسم المشروع</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">العميل</label>
                            <input type="text" value={client} onChange={e => setClient(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">تاريخ البدء</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">تاريخ الانتهاء</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الميزانية (BHD)</label>
                            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الحالة</label>
                            {/* FIX: Use English keys for option values and display translated text. */}
                            <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full border bg-white border-gray-300 rounded-md p-2">
                                <option value="OnTrack">في المسار الصحيح</option>
                                <option value="AtRisk">في خطر</option>
                                <option value="Completed">مكتمل</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text rounded-md hover:bg-gray-300">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">حفظ المشروع</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface ProjectsPageProps {
    projects: Project[];
    tasks: Task[];
    users: User[];
    currentUser: User;
    onAdd: (project: Omit<Project, 'id'>) => void;
    onUpdate: (project: Project) => void;
    onDelete: (projectId: number) => void;
    onAddTask: (task: Omit<Task, 'id'>) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, tasks, users, currentUser, onAdd, onUpdate, onDelete, onAddTask }) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    useEffect(() => {
        if (selectedProject && !projects.find(p => p.id === selectedProject.id)) {
            setSelectedProject(projects[0] || null);
        } else if (!selectedProject && projects.length > 0) {
            setSelectedProject(projects[0]);
        }
    }, [projects, selectedProject]);

    const handleOpenAddModal = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleSaveProject = (project: Project) => {
        if (editingProject) {
            onUpdate(project);
        } else {
            const { id, ...newProject } = project;
            onAdd(newProject);
        }
        setIsModalOpen(false);
    };
    
    const handleOpenAddTaskModal = () => {
        setIsTaskModalOpen(true);
    };

    const handleSaveTask = (task: Task) => {
        const { id, ...newTask } = task;
        onAddTask(newTask);
        setIsTaskModalOpen(false);
    };

    const handleConfirmDelete = () => {
        if (deletingProject) {
            onDelete(deletingProject.id);
            setDeletingProject(null);
        }
    };
    
    const projectTasks = tasks.filter(task => task.projectId === selectedProject?.id);

    const formatCurrency = (value: number) => new Intl.NumberFormat('ar-BH', { style: 'currency', currency: 'BHD' }).format(value);

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark-text">المشاريع</h1>
                {currentUser.role === Role.ProjectManager && (
                    <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                        <Icons.PlusIcon className="w-5 h-5" />
                        <span>إضافة مشروع جديد</span>
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    {projects.map(project => (
                        <div key={project.id} onClick={() => setSelectedProject(project)} className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 ${selectedProject?.id === project.id ? 'border-primary bg-teal-50 shadow-lg' : 'border-transparent bg-white shadow-md hover:shadow-lg hover:-translate-y-1'}`}>
                            <div className="flex justify-between items-start">
                               <div>
                                   <h3 className="font-bold text-dark-text">{project.name}</h3>
                                   <p className="text-sm text-light-text mt-1">{project.client}</p>
                               </div>
                               <div className="flex items-center gap-1 flex-shrink-0">
                                   <StatusBadge status={project.status} type="Project" />
                                   {currentUser.role === Role.ProjectManager && (
                                       <>
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenEditModal(project); }} className="text-blue-500 hover:text-blue-700 p-1" title="تعديل"><Icons.EditIcon className="w-4 h-4" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); setDeletingProject(project); }} className="text-red-500 hover:text-red-700 p-1" title="حذف"><Icons.DeleteIcon className="w-4 h-4" /></button>
                                       </>
                                   )}
                               </div>
                            </div>
                            <div className="mt-3 flex justify-between items-center text-sm">
                                <span>الإنجاز</span>
                                <span className="font-semibold">{project.completion}%</span>
                            </div>
                            <ProgressBar value={project.completion} className="mt-1" />
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-2">
                    {selectedProject ? (
                        <Card>
                            <h2 className="text-2xl font-bold mb-1">{selectedProject.name}</h2>
                            <p className="text-medium-text mb-4">العميل: {selectedProject.client}</p>
                            
                            {currentUser.role === Role.ProjectManager && (
                                <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                                    <div>
                                        <p className="text-sm text-light-text">الميزانية</p>
                                        <p className="text-xl font-semibold text-green-600">{formatCurrency(selectedProject.budget)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-light-text">المصروف</p>
                                        <p className="text-xl font-semibold text-red-600">{formatCurrency(selectedProject.spent)}</p>
                                    </div>
                                </div>
                            )}

                            <GanttChart 
                                tasks={projectTasks} 
                                startDate={new Date(selectedProject.startDate)} 
                                endDate={new Date(selectedProject.endDate)} 
                            />
                            {currentUser.role === Role.ProjectManager && (
                                <div className="mt-6 text-center border-t pt-4">
                                    <button
                                        onClick={handleOpenAddTaskModal}
                                        className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors mx-auto"
                                    >
                                        <Icons.PlusIcon className="w-5 h-5" />
                                        <span>إضافة مهمة لهذا المشروع</span>
                                    </button>
                                </div>
                             )}
                        </Card>
                    ) : (
                        <Card>
                            <p className="text-center text-medium-text">الرجاء تحديد مشروع أو إضافة مشروع جديد.</p>
                        </Card>
                    )}
                </div>
            </div>
            <ProjectFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProject}
                project={editingProject}
            />
             <ConfirmationDialog
                isOpen={!!deletingProject}
                onClose={() => setDeletingProject(null)}
                onConfirm={handleConfirmDelete}
                title="تأكيد حذف المشروع"
            >
                <p>هل أنت متأكد أنك تريد حذف مشروع <span className="font-bold">"{deletingProject?.name}"</span>؟ سيؤدي هذا إلى حذف جميع المهام والنفقات المرتبطة به.</p>
            </ConfirmationDialog>
            <TaskFormModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSave={handleSaveTask}
                task={null}
                projects={projects}
                users={users}
                defaultProjectId={selectedProject?.id}
            />
        </div>
    );
};

const TaskFormModal = ({ isOpen, onClose, onSave, task, projects, users, defaultProjectId }: { isOpen: boolean, onClose: () => void, onSave: (task: Task) => void, task: Task | null, projects: Project[], users: User[], defaultProjectId?: number | null }) => {
    const [title, setTitle] = useState('');
    const [projectId, setProjectId] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
    
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setProjectId(task.projectId.toString());
            setAssignedTo(task.assignedTo.toString());
            setStartDate(task.startDate);
            setEndDate(task.endDate);
            setPriority(task.priority);
        } else {
            setTitle('');
            setProjectId(defaultProjectId ? defaultProjectId.toString() : projects[0]?.id.toString() || '');
            setAssignedTo('');
            const today = new Date().toISOString().split('T')[0];
            setStartDate(today);
            setEndDate('');
            setPriority('Medium');
        }
    }, [task, isOpen, projects, defaultProjectId]);
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !projectId || !assignedTo || !startDate || !endDate) return;

        const completion = task ? task.completion : 0;
        const status = task ? task.status : TaskStatus.Pending;

        onSave({
            id: task?.id || Date.now(),
            title,
            projectId: parseInt(projectId),
            assignedTo: parseInt(assignedTo),
            startDate,
            endDate,
            priority,
            completion,
            status,
        });
        onClose();
    };

    const assignableUsers = users.filter(u => [Role.Worker, Role.EquipmentOperator, Role.SiteEngineer, Role.SiteSupervisor].includes(u.role));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-xl font-bold text-dark-text mb-6">{task ? 'تعديل مهمة' : 'إضافة مهمة جديدة'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-medium-text mb-1">عنوان المهمة</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">المشروع</label>
                            <select 
                                value={projectId} 
                                onChange={e => setProjectId(e.target.value)} 
                                className="w-full border bg-white border-gray-300 rounded-md p-2 disabled:bg-gray-100 disabled:text-gray-500" 
                                required 
                                disabled={!!defaultProjectId && !task}
                            >
                               {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">إسناد إلى</label>
                            <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="w-full border bg-white border-gray-300 rounded-md p-2" required>
                                <option value="">اختر مستخدم...</option>
                               {assignableUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">تاريخ البدء</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">تاريخ الانتهاء</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الأولوية</label>
                            <select value={priority} onChange={e => setPriority(e.target.value as any)} className="w-full border bg-white border-gray-300 rounded-md p-2">
                                <option value="High">عالية</option>
                                <option value="Medium">متوسطة</option>
                                <option value="Low">منخفضة</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text rounded-md hover:bg-gray-300">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">حفظ المهمة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface TaskCardProps {
    task: Task;
    project: Project | undefined;
    user: User | undefined;
    currentUser: User;
    onUpdateTask: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, project, user, currentUser, onUpdateTask, onEdit, onDelete }) => {
    
    const isAuthorizedToEdit = currentUser.role === Role.ProjectManager || currentUser.id === task.assignedTo;

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as TaskStatus;
        let newCompletion = task.completion;

        switch (newStatus) {
            case TaskStatus.Completed:
                newCompletion = 100;
                break;
            case TaskStatus.Pending:
                newCompletion = 0;
                break;
            case TaskStatus.InProgress:
                if (task.completion === 100) {
                    newCompletion = 90;
                } else if (task.completion === 0) {
                    newCompletion = 10;
                }
                break;
        }
        onUpdateTask({ ...task, status: newStatus, completion: newCompletion });
    };
    
    const handleCompletionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCompletion = parseInt(e.target.value, 10);
        let newStatus: TaskStatus;

        if (newCompletion >= 100) {
            newStatus = TaskStatus.Completed;
        } else if (newCompletion <= 0) {
            newStatus = TaskStatus.Pending;
        } else {
            newStatus = TaskStatus.InProgress;
        }
        
        const finalCompletion = Math.max(0, Math.min(100, newCompletion));

        onUpdateTask({ ...task, completion: finalCompletion, status: newStatus });
    };

    const priorityColors = {
        'High': 'border-red-500',
        'Medium': 'border-yellow-500',
        'Low': 'border-blue-500',
    };

    const statusSelectClasses: { [key: string]: string } = {
        [TaskStatus.Completed]: 'bg-green-100 text-green-800 border-green-200',
        [TaskStatus.InProgress]: 'bg-blue-100 text-blue-800 border-blue-200',
        [TaskStatus.Pending]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        [TaskStatus.Overdue]: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
        <div className={`p-4 rounded-lg shadow-md bg-white border-r-4 ${priorityColors[task.priority]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-dark-text">{task.title}</h4>
                <select
                    value={task.status}
                    onChange={handleStatusChange}
                    disabled={!isAuthorizedToEdit}
                    className={`px-2 py-0.5 text-xs font-medium rounded-full border appearance-none focus:outline-none focus:ring-1 focus:ring-primary ${isAuthorizedToEdit ? 'cursor-pointer' : 'cursor-not-allowed'} ${statusSelectClasses[task.status] || 'bg-gray-100 text-gray-800'}`}
                >
                    {task.status === TaskStatus.Overdue && <option value={TaskStatus.Overdue}>متأخرة</option>}
                    <option value={TaskStatus.Pending}>قيد الانتظار</option>
                    <option value={TaskStatus.InProgress}>قيد التنفيذ</option>
                    <option value={TaskStatus.Completed}>مكتملة</option>
                </select>
            </div>
            <div className="space-y-2 text-sm text-medium-text">
                <p>
                    <span className="font-semibold text-light-text">المشروع:</span> {project?.name || 'غير محدد'}
                </p>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-light-text">المسؤول:</span>
                    {user ? <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" /> : null}
                    <span>{user?.name || 'غير محدد'}</span>
                </div>
                 <p>
                    <span className="font-semibold text-light-text">تاريخ الاستحقاق:</span> {task.endDate}
                </p>
            </div>
            
            <div className="mt-4">
                <div className="flex justify-between items-center text-xs text-light-text mb-1">
                    <span>التقدم</span>
                    <span className="font-semibold text-dark-text">{task.completion}%</span>
                </div>
                <ProgressBar value={task.completion} />
                 <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={task.completion}
                    onChange={handleCompletionChange}
                    disabled={!isAuthorizedToEdit}
                    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none mt-2 accent-primary ${isAuthorizedToEdit ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                />
            </div>
            
            {currentUser.role === Role.ProjectManager && (
                 <div className="mt-4 pt-3 border-t flex justify-end gap-2">
                    <button onClick={() => onEdit(task)} className="text-blue-600 hover:text-blue-800 p-1" title="تعديل"><Icons.EditIcon className="w-5 h-5" /></button>
                    <button onClick={() => onDelete(task)} className="text-red-600 hover:text-red-800 p-1" title="حذف"><Icons.DeleteIcon className="w-5 h-5" /></button>
                </div>
            )}
        </div>
    );
};


export const TasksPage = ({ projects, tasks, users, currentUser, onAddTask, onUpdateTask, onDeleteTask }: { projects: Project[], tasks: Task[], users: User[], currentUser: User, onAddTask: (task: Omit<Task, 'id'>) => void, onUpdateTask: (task: Task) => void, onDeleteTask: (taskId: number) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);
    const [filters, setFilters] = useState({ project: 'all', assignee: 'all' });
    const [sortBy, setSortBy] = useState('endDate');

    const isManager = [Role.ProjectManager, Role.SiteSupervisor, Role.SiteEngineer].includes(currentUser.role);
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const baseTasks = isManager ? tasks : tasks.filter(t => t.assignedTo === currentUser.id);

    const filteredAndSortedTasks = baseTasks
        .filter(task => {
            const projectMatch = filters.project === 'all' || task.projectId === parseInt(filters.project);
            const assigneeMatch = filters.assignee === 'all' || task.assignedTo === parseInt(filters.assignee);
            return projectMatch && assigneeMatch;
        })
        .sort((a, b) => {
            if (sortBy === 'priority') {
                const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            // Default sort by end date (ascending)
            return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        });

    const handleOpenAddModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };
    
    const handleSaveTask = (task: Task) => {
        if (editingTask) {
            onUpdateTask(task);
        } else {
            const { id, ...newTask } = task;
            onAddTask(newTask);
        }
        setIsModalOpen(false);
    };

    const handleConfirmDelete = () => {
        if (deletingTask) {
            onDeleteTask(deletingTask.id);
            setDeletingTask(null);
        }
    };

    const assignableUsers = users.filter(u => 
        [Role.Worker, Role.EquipmentOperator, Role.SiteEngineer, Role.SiteSupervisor, Role.ProjectManager].includes(u.role)
    );

    const renderTaskList = (title: string, status: TaskStatus) => {
        const filteredTasks = filteredAndSortedTasks.filter(t => t.status === status);
        return (
            <Card className="flex-1 min-w-[320px] bg-gray-50">
                <h3 className="font-bold text-lg mb-4 text-dark-text">{title} ({filteredTasks.length})</h3>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                    {filteredTasks.map(task => (
                        <TaskCard 
                            key={task.id}
                            task={task}
                            project={projects.find(p => p.id === task.projectId)}
                            user={users.find(u => u.id === task.assignedTo)}
                            currentUser={currentUser}
                            onUpdateTask={onUpdateTask}
                            onEdit={handleOpenEditModal}
                            onDelete={setDeletingTask}
                        />
                    ))}
                </div>
            </Card>
        );
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-dark-text">إدارة المهام</h1>
                {currentUser.role === Role.ProjectManager && (
                    <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                        <Icons.PlusIcon className="w-5 h-5" />
                        <span>إضافة مهمة جديدة</span>
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border items-end">
                <div className="flex-grow">
                    <label htmlFor="project-filter" className="block text-sm font-medium text-medium-text mb-1">تصفية حسب المشروع</label>
                    <select id="project-filter" name="project" value={filters.project} onChange={handleFilterChange} className="w-full bg-white border border-gray-300 rounded-md p-2 text-sm">
                        <option value="all">كل المشاريع</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>

                {isManager && (
                    <div className="flex-grow">
                        <label htmlFor="assignee-filter" className="block text-sm font-medium text-medium-text mb-1">تصفية حسب المسؤول</label>
                        <select id="assignee-filter" name="assignee" value={filters.assignee} onChange={handleFilterChange} className="w-full bg-white border border-gray-300 rounded-md p-2 text-sm">
                            <option value="all">كل المستخدمين</option>
                            {assignableUsers.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                        </select>
                    </div>
                )}

                <div className="flex-grow">
                    <label htmlFor="sort-by" className="block text-sm font-medium text-medium-text mb-1">ترتيب حسب</label>
                    <select id="sort-by" value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-white border border-gray-300 rounded-md p-2 text-sm">
                        <option value="endDate">تاريخ الاستحقاق</option>
                        <option value="priority">الأولوية</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {renderTaskList('قيد الانتظار', TaskStatus.Pending)}
                {renderTaskList('قيد التنفيذ', TaskStatus.InProgress)}
                {renderTaskList('مكتملة', TaskStatus.Completed)}
            </div>
             <TaskFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={editingTask}
                projects={projects}
                users={users}
            />
            <ConfirmationDialog
                isOpen={!!deletingTask}
                onClose={() => setDeletingTask(null)}
                onConfirm={handleConfirmDelete}
                title="تأكيد حذف المهمة"
            >
                <p>هل أنت متأكد أنك تريد حذف مهمة <span className="font-bold">"{deletingTask?.title}"</span>؟</p>
            </ConfirmationDialog>
        </div>
    );
};



interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h3 className="text-lg font-bold text-dark-text">{title}</h3>
                <div className="mt-4 text-medium-text">{children}</div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text rounded-md hover:bg-gray-300 transition-colors">
                        إلغاء
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-orange-600 transition-colors">
                        تأكيد
                    </button>
                </div>
            </div>
        </div>
    );
};

const ExpenseFormModal = ({ isOpen, onClose, onSave, expense, projects, materials }: { isOpen: boolean, onClose: () => void, onSave: (expense: Expense, materialUpdate?: {materialId: number, quantity: number}) => void, expense: Expense | null, projects: Project[], materials: Material[] }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    // FIX: Use ExpenseCategory type and English keys for state to maintain data consistency.
    const [category, setCategory] = useState<ExpenseCategory>('Labor');
    const [projectId, setProjectId] = useState('');
    const [materialId, setMaterialId] = useState('');
    const [materialQuantity, setMaterialQuantity] = useState('');
    const [date, setDate] = useState('');
    // FIX: Use ExpenseStatus type and English keys for state to maintain data consistency.
    const [status, setStatus] = useState<ExpenseStatus>('Pending');

    useEffect(() => {
        if (expense) {
            setDescription(expense.description);
            setAmount(expense.amount.toString());
            setCategory(expense.category);
            setProjectId(expense.projectId.toString());
            setDate(expense.date);
            setStatus(expense.status);
            // Reset material fields for edits as we don't adjust inventory on edit
            setMaterialId('');
            setMaterialQuantity('');
        } else {
            setDescription('');
            setAmount('');
            // FIX: Set default category to English key.
            setCategory('Labor');
            setProjectId(projects[0]?.id.toString() || '');
            setMaterialId('');
            setMaterialQuantity('');
            setDate(new Date().toISOString().split('T')[0]);
            // FIX: Set default status to English key.
            setStatus('Pending');
        }
    }, [expense, isOpen, projects]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !projectId) return;

        let materialUpdate;
        // Material logic only applies when ADDING a new material expense
        if (!expense && category === 'Materials') {
            if (!materialId || !materialQuantity || parseInt(materialQuantity) <= 0) {
                alert('الرجاء اختيار مادة وكمية صالحة.');
                return;
            }
            materialUpdate = { materialId: parseInt(materialId), quantity: parseInt(materialQuantity) };
        }

        onSave({
            id: expense?.id || Date.now(),
            projectId: parseInt(projectId),
            description,
            amount: parseFloat(amount),
            date,
            category,
            status,
        }, materialUpdate);
        
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-lg font-bold text-dark-text mb-6">{expense ? 'تعديل المصروف' : 'إضافة مصروف جديد'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الوصف</label>
                            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">المبلغ (BHD)</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">المشروع</label>
                            <select value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full border bg-white border-gray-300 rounded-md p-2">
                               {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الفئة</label>
                             {/* FIX: Use English keys for option values and display translated text. */}
                             <select value={category} onChange={e => { setCategory(e.target.value as any); setMaterialId(''); setMaterialQuantity(''); }} className="w-full border bg-white border-gray-300 rounded-md p-2">
                               <option value="Labor">عمالة</option>
                               <option value="Materials">مواد</option>
                               <option value="Machinery">آليات</option>
                               <option value="Permits">تصاريح</option>
                            </select>
                        </div>
                    </div>

                    {category === 'Materials' && !expense && (
                        <div className="p-3 bg-teal-50/50 border border-primary/20 rounded-md space-y-4">
                             <label className="block text-sm font-medium text-medium-text">المادة</label>
                             <select value={materialId} onChange={e => setMaterialId(e.target.value)} className="w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white" required>
                                 <option value="">اختر مادة...</option>
                                 {materials.map(m => <option key={m.id} value={m.id}>{m.name} (المتوفر: {m.quantity})</option>)}
                             </select>
                             <label className="block text-sm font-medium text-medium-text">الكمية المستهلكة</label>
                             <input type="number" value={materialQuantity} onChange={e => setMaterialQuantity(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                    )}
                    <div className="mt-6 flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text rounded-md hover:bg-gray-300">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FinancialKpiCard: React.FC<{ title: string; value: string; icon: React.FC<{className?: string}> }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center">
        <div className="p-3 rounded-full bg-primary/10 mr-4">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
            <h4 className="font-semibold text-medium-text text-sm">{title}</h4>
            <p className="text-2xl font-bold text-dark-text">{value}</p>
        </div>
    </div>
);


interface FinancialsPageProps {
    projects: Project[];
    expenses: Expense[];
    onAddExpense: (expense: Omit<Expense, 'id'>, materialUpdate?: { materialId: number; quantity: number; }) => void;
    onUpdateExpense: (expense: Expense) => void;
    onDeleteExpense: (expenseId: number) => void;
    materials: Material[];
}

export const FinancialsPage: React.FC<FinancialsPageProps> = ({ projects, expenses, onAddExpense, onUpdateExpense, onDeleteExpense, materials }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

    const [pendingExpense, setPendingExpense] = useState<{ expense: Omit<Expense, 'id'>, materialUpdate: { materialId: number, quantity: number } } | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleOpenAddModal = () => {
        setEditingExpense(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (expense: Expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleSaveExpense = (expense: Expense, materialUpdate?: { materialId: number, quantity: number }) => {
        if (editingExpense) {
            onUpdateExpense(expense);
        } else {
            const { id, ...newExpense } = expense;
            if (materialUpdate) {
                const material = materials.find(m => m.id === materialUpdate.materialId);
                if (material && (material.quantity - materialUpdate.quantity) < material.threshold) {
                    setPendingExpense({ expense: newExpense, materialUpdate });
                    setIsConfirmOpen(true);
                    return;
                }
            }
            onAddExpense(newExpense, materialUpdate);
        }
        setIsModalOpen(false);
    };

    const handleConfirmDelete = () => {
        if (deletingExpense) {
            onDeleteExpense(deletingExpense.id);
            setDeletingExpense(null);
        }
    };
    
    const handleConfirmLowStock = () => {
        if (pendingExpense) {
            onAddExpense(pendingExpense.expense, pendingExpense.materialUpdate);
        }
        setIsConfirmOpen(false);
        setPendingExpense(null);
        setIsModalOpen(false);
    };

    const handleCancelLowStock = () => {
        setIsConfirmOpen(false);
        setPendingExpense(null);
    };

    const pendingMaterial = pendingExpense ? materials.find(m => m.id === pendingExpense.materialUpdate.materialId) : null;

    const expenseByCategory = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(expenseByCategory).map(([name, amount]) => ({ name, amount }));

    const formatCurrency = (value: number) => new Intl.NumberFormat('ar-BH', { style: 'currency', currency: 'BHD', notation: 'compact', compactDisplay: 'short' }).format(value);
    const formatCurrencyFull = (value: number) => new Intl.NumberFormat('ar-BH', { style: 'currency', currency: 'BHD' }).format(value);
    
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = expenses.reduce((sum, e) => e.status === 'Approved' ? sum + e.amount : sum, 0);
    const pendingAmount = expenses.reduce((sum, e) => e.status === 'Pending' ? sum + e.amount : sum, 0);


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-dark-text">نظرة مالية عامة</h1>
                 <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    <Icons.PlusIcon className="w-5 h-5" />
                    <span>إضافة مصروف جديد</span>
                </button>
            </div>

            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={handleCancelLowStock}
                onConfirm={handleConfirmLowStock}
                title="تحذير انخفاض المخزون"
            >
                {pendingMaterial && (
                     <p>
                        إضافة هذا المصروف سيؤدي إلى انخفاض مخزون مادة 
                        <span className="font-bold text-dark-text"> "{pendingMaterial.name}" </span> 
                        إلى ما دون الحد الأدنى. هل أنت متأكد أنك تريد المتابعة؟
                    </p>
                )}
            </ConfirmationDialog>
             <ConfirmationDialog
                isOpen={!!deletingExpense}
                onClose={() => setDeletingExpense(null)}
                onConfirm={handleConfirmDelete}
                title="تأكيد حذف المصروف"
            >
                <p>هل أنت متأكد أنك تريد حذف هذا المصروف؟ لا يمكن التراجع عن هذا الإجراء.</p>
            </ConfirmationDialog>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FinancialKpiCard title="إجمالي الميزانية" value={formatCurrency(totalBudget)} icon={Icons.FinanceIcon} />
                <FinancialKpiCard title="إجمالي المصروفات" value={formatCurrency(totalSpent)} icon={Icons.PaperclipIcon} />
                <FinancialKpiCard title="الميزانية المتبقية" value={formatCurrency(totalBudget - totalSpent)} icon={Icons.CheckCircleIcon} />
                <FinancialKpiCard title="المصاريف المعلقة" value={formatCurrency(pendingAmount)} icon={Icons.ClockIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <Card title="جميع المصاريف">
                        <div className="overflow-x-auto max-h-96">
                            <table className="min-w-full text-sm text-right">
                               <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="p-3 text-right font-semibold text-medium-text">الوصف</th>
                                        <th className="p-3 text-right font-semibold text-medium-text">المشروع</th>
                                        <th className="p-3 text-right font-semibold text-medium-text">المبلغ</th>
                                        <th className="p-3 text-right font-semibold text-medium-text">الحالة</th>
                                        <th className="p-3 text-center font-semibold text-medium-text">إجراءات</th>
                                    </tr>
                               </thead>
                               <tbody>
                                    {expenses.map(e => {
                                        const project = projects.find(p => p.id === e.projectId);
                                        return (
                                            <tr key={e.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{e.description}</td>
                                                <td className="p-3 text-xs text-light-text">{project?.name || 'غير محدد'}</td>
                                                <td className="p-3 font-medium">{formatCurrencyFull(e.amount)}</td>
                                                <td className="p-3"><StatusBadge status={e.status} type="Expense" /></td>
                                                <td className="p-3">
                                                    <div className="flex justify-center gap-4">
                                                        <button onClick={() => handleOpenEditModal(e)} className="text-blue-600 hover:text-blue-800" title="تعديل"><Icons.EditIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => setDeletingExpense(e)} className="text-red-600 hover:text-red-800" title="حذف"><Icons.DeleteIcon className="w-5 h-5" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                               </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
                 <div className="lg:col-span-2">
                    <Card title="المصاريف حسب الفئة">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: '#F8FAFC'}} formatter={(value) => formatCurrencyFull(Number(value))} />
                                <Bar dataKey="amount" name="المبلغ" fill="#0D9488" barSize={20} radius={[0, 5, 5, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
             <ExpenseFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveExpense}
                expense={editingExpense}
                projects={projects}
                materials={materials}
            />
        </div>
    );
}

interface MaterialFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (material: Material) => void;
    material: Material | null;
}

const MaterialFormModal: React.FC<MaterialFormModalProps> = ({ isOpen, onClose, onSave, material }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [threshold, setThreshold] = useState('');

    useEffect(() => {
        if (material) {
            setName(material.name);
            setQuantity(material.quantity.toString());
            setUnit(material.unit);
            setThreshold(material.threshold.toString());
        } else {
            setName('');
            setQuantity('');
            setUnit('');
            setThreshold('');
        }
    }, [material, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !quantity || !unit || !threshold) return;

        onSave({
            id: material?.id || Date.now(),
            name,
            quantity: parseInt(quantity, 10),
            unit,
            threshold: parseInt(threshold, 10),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-lg font-bold text-dark-text mb-6">{material ? 'تعديل مادة' : 'إضافة مادة جديدة'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">اسم المادة</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الوحدة</label>
                            <input type="text" value={unit} onChange={e => setUnit(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الكمية الحالية</label>
                            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">حد التنبيه</label>
                            <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text rounded-md hover:bg-gray-300">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface InventoryPageProps {
    materials: Material[];
    onAdd: (material: Omit<Material, 'id'>) => void;
    onUpdate: (material: Material) => void;
    onDelete: (materialId: number) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({ materials, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
    const [deletingMaterial, setDeletingMaterial] = useState<Material | null>(null);

    const handleOpenAddModal = () => {
        setEditingMaterial(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (material: Material) => {
        setEditingMaterial(material);
        setIsModalOpen(true);
    };

    const handleSaveMaterial = (material: Material) => {
        if (editingMaterial) {
            onUpdate(material);
        } else {
            const { id, ...newMaterial } = material;
            onAdd(newMaterial);
        }
        setIsModalOpen(false);
    };

    const handleConfirmDelete = () => {
        if (deletingMaterial) {
            onDelete(deletingMaterial.id);
            setDeletingMaterial(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark-text">إدارة المخزون</h1>
                <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    <Icons.PlusIcon className="w-5 h-5" />
                    <span>إضافة مادة جديدة</span>
                </button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-right">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 font-semibold text-medium-text">اسم المادة</th>
                                <th className="p-3 font-semibold text-medium-text">الكمية المتوفرة</th>
                                <th className="p-3 font-semibold text-medium-text">حد التنبيه</th>
                                <th className="p-3 font-semibold text-medium-text text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map(material => (
                                <tr key={material.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{material.name}</td>
                                    <td className="p-3">
                                        <span className={material.quantity <= material.threshold ? 'text-red-500 font-bold' : ''}>
                                            {material.quantity} {material.unit}
                                        </span>
                                    </td>
                                    <td className="p-3">{material.threshold} {material.unit}</td>
                                    <td className="p-3">
                                        <div className="flex justify-center gap-4">
                                            <button onClick={() => handleOpenEditModal(material)} className="text-blue-600 hover:text-blue-800" title="تعديل"><Icons.EditIcon className="w-5 h-5" /></button>
                                            <button onClick={() => setDeletingMaterial(material)} className="text-red-600 hover:text-red-800" title="حذف"><Icons.DeleteIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <MaterialFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveMaterial}
                material={editingMaterial}
            />

            <ConfirmationDialog
                isOpen={!!deletingMaterial}
                onClose={() => setDeletingMaterial(null)}
                onConfirm={handleConfirmDelete}
                title="تأكيد حذف المادة"
            >
                <p>هل أنت متأكد أنك تريد حذف <span className="font-bold">"{deletingMaterial?.name}"</span>؟</p>
            </ConfirmationDialog>
        </div>
    );
};

interface EquipmentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (equipment: Equipment) => void;
    equipmentItem: Equipment | null;
    users: User[];
}

const EquipmentFormModal: React.FC<EquipmentFormModalProps> = ({ isOpen, onClose, onSave, equipmentItem, users }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<EquipmentStatus>('Available');
    const [operatorId, setOperatorId] = useState<string>('');
    const [nextMaintenance, setNextMaintenance] = useState('');

    useEffect(() => {
        if (equipmentItem) {
            setName(equipmentItem.name);
            setStatus(equipmentItem.status);
            setOperatorId(equipmentItem.operatorId ? equipmentItem.operatorId.toString() : '');
            setNextMaintenance(equipmentItem.nextMaintenance);
        } else {
            setName('');
            setStatus('Available');
            setOperatorId('');
            setNextMaintenance('');
        }
    }, [equipmentItem, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !status || !nextMaintenance) return;
        onSave({
            id: equipmentItem?.id || Date.now(),
            name,
            status,
            operatorId: operatorId ? parseInt(operatorId) : null,
            nextMaintenance,
        });
        onClose();
    };
    
    const operators = users.filter(u => u.role === Role.EquipmentOperator);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-lg font-bold text-dark-text mb-6">{equipmentItem ? 'تعديل معدة' : 'إضافة معدة جديدة'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">اسم المعدة</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الحالة</label>
                            <select value={status} onChange={e => setStatus(e.target.value as EquipmentStatus)} className="w-full border bg-white border-gray-300 rounded-md p-2">
                                <option value="Available">متاحة</option>
                                <option value="InUse">قيد الاستخدام</option>
                                <option value="Maintenance">تحت الصيانة</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">المشغل</label>
                            <select value={operatorId} onChange={e => setOperatorId(e.target.value)} className="w-full border bg-white border-gray-300 rounded-md p-2">
                                <option value="">لا يوجد</option>
                                {operators.map(op => <option key={op.id} value={op.id}>{op.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">تاريخ الصيانة التالي</label>
                            <input type="date" value={nextMaintenance} onChange={e => setNextMaintenance(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text rounded-md hover:bg-gray-300">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface EquipmentPageProps {
    equipment: Equipment[];
    users: User[];
    onAdd: (item: Omit<Equipment, 'id'>) => void;
    onUpdate: (item: Equipment) => void;
    onDelete: (itemId: number) => void;
}

export const EquipmentPage: React.FC<EquipmentPageProps> = ({ equipment, users, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Equipment | null>(null);
    const [deletingItem, setDeletingItem] = useState<Equipment | null>(null);

    const handleOpenAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: Equipment) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSaveItem = (item: Equipment) => {
        if (editingItem) {
            onUpdate(item);
        } else {
            const { id, ...newItem } = item;
            onAdd(newItem);
        }
        setIsModalOpen(false);
    };

    const handleConfirmDelete = () => {
        if (deletingItem) {
            onDelete(deletingItem.id);
            setDeletingItem(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark-text">إدارة المعدات</h1>
                <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    <Icons.PlusIcon className="w-5 h-5" />
                    <span>إضافة معدة جديدة</span>
                </button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-right">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 font-semibold text-medium-text">اسم المعدة</th>
                                <th className="p-3 font-semibold text-medium-text">الحالة</th>
                                <th className="p-3 font-semibold text-medium-text">المشغل الحالي</th>
                                <th className="p-3 font-semibold text-medium-text">الصيانة التالية</th>
                                <th className="p-3 font-semibold text-medium-text text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipment.map(item => {
                                const operator = users.find(u => u.id === item.operatorId);
                                return (
                                    <tr key={item.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">{item.name}</td>
                                        <td className="p-3"><StatusBadge status={item.status} type="Equipment" /></td>
                                        <td className="p-3">{operator?.name || 'لا يوجد'}</td>
                                        <td className="p-3">{item.nextMaintenance}</td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-4">
                                                <button onClick={() => handleOpenEditModal(item)} className="text-blue-600 hover:text-blue-800" title="تعديل"><Icons.EditIcon className="w-5 h-5" /></button>
                                                <button onClick={() => setDeletingItem(item)} className="text-red-600 hover:text-red-800" title="حذف"><Icons.DeleteIcon className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            <EquipmentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveItem}
                equipmentItem={editingItem}
                users={users}
            />

            <ConfirmationDialog
                isOpen={!!deletingItem}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
                title="تأكيد حذف المعدة"
            >
                <p>هل أنت متأكد أنك تريد حذف <span className="font-bold">"{deletingItem?.name}"</span>؟</p>
            </ConfirmationDialog>
        </div>
    );
};

interface ManpowerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (agent: ManpowerAgent) => void;
    agent: ManpowerAgent | null;
}

const ManpowerFormModal: React.FC<ManpowerFormModalProps> = ({ isOpen, onClose, onSave, agent }) => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [workplace, setWorkplace] = useState('');
    const [cpr, setCpr] = useState('');

    useEffect(() => {
        if (agent) {
            setName(agent.name);
            setPosition(agent.position);
            setWorkplace(agent.workplace);
            setCpr(agent.cpr);
        } else {
            setName('');
            setPosition('');
            setWorkplace('');
            setCpr('');
        }
    }, [agent, isOpen]);

    if (!isOpen) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !position || !workplace || !cpr) return;
        onSave({
            id: agent?.id || Date.now(),
            name,
            position,
            workplace,
            cpr,
            dateAdded: agent?.dateAdded || new Date().toISOString().split('T')[0],
            attendance: agent?.attendance || AttendanceStatus.Present,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-lg font-bold text-dark-text mb-6">{agent ? 'تعديل بيانات العامل' : 'إضافة عامل جديد'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الاسم</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الرقم الشخصي (CPR)</label>
                            <input type="text" value={cpr} onChange={e => setCpr(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">المهنة</label>
                            <input type="text" value={position} onChange={e => setPosition(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">مكان العمل</label>
                            <input type="text" value={workplace} onChange={e => setWorkplace(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text rounded-md hover:bg-gray-300">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface ManpowerPageProps {
    manpowerAgents: ManpowerAgent[];
    currentUser: User;
    onAdd: (agent: Omit<ManpowerAgent, 'id'>) => void;
    onUpdate: (agent: ManpowerAgent) => void;
    onDelete: (agentId: number) => void;
}

const ManpowerKpiCard: React.FC<{ title: string; value: string | number; icon: React.FC<{className?: string}>; iconBgColor: string }> = ({ title, value, icon: Icon, iconBgColor }) => (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center">
        <div className={`p-3 rounded-full ${iconBgColor} mr-4`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <h4 className="font-semibold text-medium-text text-sm">{title}</h4>
            <p className="text-2xl font-bold text-dark-text">{value}</p>
        </div>
    </div>
);


export const ManpowerPage: React.FC<ManpowerPageProps> = ({ manpowerAgents, currentUser, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<ManpowerAgent | null>(null);
    const [deletingAgent, setDeletingAgent] = useState<ManpowerAgent | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [professionFilter, setProfessionFilter] = useState('all');
    const [attendanceFilter, setAttendanceFilter] = useState('all');

    const canManage = [Role.ProjectManager, Role.SiteSupervisor, Role.SiteEngineer].includes(currentUser.role);

    const handleOpenAddModal = () => {
        setEditingAgent(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (agent: ManpowerAgent) => {
        setEditingAgent(agent);
        setIsModalOpen(true);
    };

    const handleSaveAgent = (agent: ManpowerAgent) => {
        if (editingAgent) {
            onUpdate(agent);
        } else {
            const { id, ...newAgent } = agent;
            onAdd(newAgent);
        }
        setIsModalOpen(false);
    };
    
    const handleUpdateAttendance = (agent: ManpowerAgent, status: AttendanceStatus) => {
        onUpdate({ ...agent, attendance: status });
    };

    const handleConfirmDelete = () => {
        if (deletingAgent) {
            onDelete(deletingAgent.id);
            setDeletingAgent(null);
        }
    };
    
    const filteredAgents = manpowerAgents.filter(agent => {
        const searchMatch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || agent.cpr.includes(searchTerm);
        const professionMatch = professionFilter === 'all' || agent.position === professionFilter;
        const attendanceMatch = attendanceFilter === 'all' || agent.attendance === attendanceFilter;
        return searchMatch && professionMatch && attendanceMatch;
    });

    const professions = [...new Set(manpowerAgents.map(a => a.position))];
    const presentCount = manpowerAgents.filter(a => a.attendance === 'Present').length;
    const absentCount = manpowerAgents.filter(a => a.attendance === 'Absent').length;

    const professionCounts = manpowerAgents.reduce((acc, agent) => {
        acc[agent.position] = (acc[agent.position] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topProfessions = Object.entries(professionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({ name, count }));

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-dark-text">إدارة القوى العاملة</h1>
                {canManage && (
                    <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                        <Icons.PlusIcon className="w-5 h-5" />
                        <span>إضافة عامل جديد</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ManpowerKpiCard title="إجمالي العمال" value={manpowerAgents.length} icon={Icons.UsersIcon} iconBgColor="bg-blue-500" />
                <ManpowerKpiCard title="الحاضرون" value={presentCount} icon={Icons.UserCheckIcon} iconBgColor="bg-green-500" />
                <ManpowerKpiCard title="الغائبون" value={absentCount} icon={Icons.UserMinusIcon} iconBgColor="bg-red-500" />
                <Card title="أبرز المهن">
                    <ul className="space-y-2">
                        {topProfessions.map(p => (
                            <li key={p.name} className="flex justify-between items-center text-sm">
                                <span className="text-medium-text">{p.name}</span>
                                <span className="font-semibold text-dark-text bg-gray-100 px-2 py-0.5 rounded">{p.count}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>

            <Card>
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-grow min-w-[200px]">
                        <label htmlFor="search-manpower" className="sr-only">بحث</label>
                        <input
                            id="search-manpower"
                            type="text"
                            placeholder="بحث بالاسم أو الرقم الشخصي..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div className="flex-grow min-w-[150px]">
                         <label htmlFor="profession-filter" className="sr-only">المهنة</label>
                         <select
                            id="profession-filter"
                            value={professionFilter}
                            onChange={(e) => setProfessionFilter(e.target.value)}
                            className="w-full border bg-white border-gray-300 rounded-md p-2"
                        >
                            <option value="all">كل المهن</option>
                            {professions.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                     <div className="flex-grow min-w-[150px]">
                         <label htmlFor="attendance-filter" className="sr-only">الحالة</label>
                         <select
                            id="attendance-filter"
                            value={attendanceFilter}
                            onChange={(e) => setAttendanceFilter(e.target.value)}
                            className="w-full border bg-white border-gray-300 rounded-md p-2"
                        >
                            <option value="all">كل الحالات</option>
                            <option value="Present">حاضر</option>
                            <option value="Absent">غائب</option>
                        </select>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map(agent => (
                    <Card key={agent.id} className="flex flex-col !p-0 overflow-hidden">
                        <div className="p-5 flex-grow">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xl flex-shrink-0">
                                        {agent.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark-text">{agent.name}</h3>
                                        <p className="text-sm text-medium-text">{agent.position}</p>
                                    </div>
                                </div>
                                <StatusBadge status={agent.attendance} type="Attendance" />
                            </div>
                            <div className="mt-4 space-y-2 text-sm text-light-text border-t pt-3">
                                <p><span className="font-semibold text-medium-text">مكان العمل:</span> {agent.workplace}</p>
                                <p><span className="font-semibold text-medium-text">الرقم الشخصي:</span> {agent.cpr}</p>
                                <p><span className="font-semibold text-medium-text">تاريخ الإضافة:</span> {agent.dateAdded}</p>
                            </div>
                        </div>
                         {canManage && (
                            <div className="bg-gray-50 p-3 mt-4 flex justify-between items-center gap-2">
                                <div className="flex gap-2">
                                     <button onClick={() => handleUpdateAttendance(agent, AttendanceStatus.Present)} disabled={agent.attendance === 'Present'} className="text-xs bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors">
                                        تسجيل حضور
                                    </button>
                                     <button onClick={() => handleUpdateAttendance(agent, AttendanceStatus.Absent)} disabled={agent.attendance === 'Absent'} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors">
                                        تسجيل غياب
                                    </button>
                                </div>
                                <div className="flex gap-1 border-s ps-2">
                                    <button onClick={() => handleOpenEditModal(agent)} className="text-blue-600 hover:text-blue-800 p-1" title="تعديل"><Icons.EditIcon className="w-5 h-5" /></button>
                                    <button onClick={() => setDeletingAgent(agent)} className="text-red-600 hover:text-red-800 p-1" title="حذف"><Icons.DeleteIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            <ManpowerFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAgent}
                agent={editingAgent}
            />
            
            <ConfirmationDialog
                isOpen={!!deletingAgent}
                onClose={() => setDeletingAgent(null)}
                onConfirm={handleConfirmDelete}
                title="تأكيد حذف العامل"
            >
                <p>هل أنت متأكد أنك تريد حذف <span className="font-bold">"{deletingAgent?.name}"</span>؟</p>
            </ConfirmationDialog>
        </div>
    );
};

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
    user: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSave, user }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState<Role>(Role.Worker);
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setRole(user.role);
            setAvatar(user.avatar);
        } else {
            setName('');
            setRole(Role.Worker);
            setAvatar(`https://picsum.photos/seed/${Date.now()}/100/100`);
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !role) return;
        onSave({
            id: user?.id || Date.now(),
            name,
            role,
            avatar,
            password: user?.password || 'password123'
        });
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-lg font-bold text-dark-text mb-6">{user ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الاسم</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الدور</label>
                            <select value={role} onChange={e => setRole(e.target.value as Role)} className="w-full border bg-white border-gray-300 rounded-md p-2">
                                {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text rounded-md hover:bg-gray-300">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface UsersPageProps {
    users: User[];
    onAdd: (user: Omit<User, 'id'>) => void;
    onUpdate: (user: User) => void;
    onDelete: (userId: number) => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({ users, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = (user: User) => {
        if (editingUser) {
            onUpdate(user);
        } else {
            const { id, ...newUser } = user;
            onAdd(newUser);
        }
        setIsModalOpen(false);
    };
    
    const handleConfirmDelete = () => {
        if (deletingUser) {
            onDelete(deletingUser.id);
            setDeletingUser(null);
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark-text">إدارة المستخدمين</h1>
                <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    <Icons.PlusIcon className="w-5 h-5" />
                    <span>إضافة مستخدم جديد</span>
                </button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-right">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 font-semibold text-medium-text">المستخدم</th>
                                <th className="p-3 font-semibold text-medium-text">الدور</th>
                                <th className="p-3 font-semibold text-medium-text text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-3">{user.role}</td>
                                    <td className="p-3">
                                        <div className="flex justify-center gap-4">
                                            <button onClick={() => handleOpenEditModal(user)} className="text-blue-600 hover:text-blue-800" title="تعديل"><Icons.EditIcon className="w-5 h-5" /></button>
                                            <button onClick={() => setDeletingUser(user)} className="text-red-600 hover:text-red-800" title="حذف"><Icons.DeleteIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                user={editingUser}
            />

            <ConfirmationDialog
                isOpen={!!deletingUser}
                onClose={() => setDeletingUser(null)}
                onConfirm={handleConfirmDelete}
                title="تأكيد حذف المستخدم"
            >
                <p>هل أنت متأكد أنك تريد حذف <span className="font-bold">"{deletingUser?.name}"</span>؟</p>
            </ConfirmationDialog>
        </div>
    );
};

interface MailPageProps {
    currentUser: User;
    users: User[];
    conversations: Conversation[];
    messages: Message[];
    onSendMessage: (conversationId: number, text: string) => void;
    onNewConversation: (recipientId: number, subject: string, text: string) => void;
}

export const MailPage: React.FC<MailPageProps> = ({ currentUser, users, conversations, messages, onSendMessage, onNewConversation }) => {
    const userConversations = conversations.filter(c => c.participantIds.includes(currentUser.id));
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(userConversations[0]?.id || null);
    const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
    
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    useEffect(scrollToBottom, [messages, selectedConversationId]);

    const MessageInput = ({ conversationId }: { conversationId: number }) => {
        const [text, setText] = useState('');
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (text.trim()) {
                onSendMessage(conversationId, text);
                setText('');
            }
        };
        return (
            <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button type="submit" className="bg-primary text-white rounded-full p-2 hover:bg-primary-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </div>
            </form>
        );
    };
    
    const ComposeModal: React.FC = () => {
        const [recipientId, setRecipientId] = useState('');
        const [subject, setSubject] = useState('');
        const [text, setText] = useState('');

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (recipientId && subject.trim() && text.trim()) {
                onNewConversation(parseInt(recipientId), subject, text);
                setIsComposeModalOpen(false);
            }
        };

        const otherUsers = users.filter(u => u.id !== currentUser.id);

        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                    <h3 className="text-lg font-bold text-dark-text mb-6">رسالة جديدة</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">إلى:</label>
                             <select value={recipientId} onChange={e => setRecipientId(e.target.value)} className="w-full border bg-white border-gray-300 rounded-md p-2" required>
                                <option value="">اختر مستلم...</option>
                                {otherUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الموضوع:</label>
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medium-text mb-1">الرسالة:</label>
                            <textarea value={text} onChange={e => setText(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-md p-2" required />
                        </div>
                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                            <button type="button" onClick={() => setIsComposeModalOpen(false)} className="px-4 py-2 bg-gray-200 text-dark-text rounded-md hover:bg-gray-300">إلغاء</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">إرسال</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    };
    
    const lastMessage = (convId: number) => {
        const convMessages = messages.filter(m => m.conversationId === convId);
        // FIX: The original slice(-1)[0] could return undefined. This check is more robust.
        return convMessages.length > 0 ? convMessages[convMessages.length - 1] : null;
    }


    return (
        <div className="h-[calc(100vh-120px)] flex">
            {isComposeModalOpen && <ComposeModal />}
            <Card className="flex-shrink-0 w-full md:w-1/3 min-w-[300px] h-full flex flex-col">
                <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className="text-xl font-bold">البريد الوارد</h2>
                    <button onClick={() => setIsComposeModalOpen(true)} className="p-2 rounded-full hover:bg-light-bg">
                        <Icons.EditIcon className="w-6 h-6 text-primary" />
                    </button>
                </div>
                <ul className="flex-1 overflow-y-auto mt-4 space-y-2">
                    {userConversations.map(conv => {
                        const otherParticipantId = conv.participantIds.find(id => id !== currentUser.id);
                        const otherParticipant = users.find(u => u.id === otherParticipantId);
                        const msg = lastMessage(conv.id);
                        return (
                            <li key={conv.id} onClick={() => setSelectedConversationId(conv.id)}
                                className={`p-3 rounded-lg cursor-pointer ${selectedConversationId === conv.id ? 'bg-primary/10' : 'hover:bg-light-bg'}`}>
                                <div className="flex items-center gap-3">
                                    <img src={otherParticipant?.avatar} alt={otherParticipant?.name} className="w-12 h-12 rounded-full" />
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-dark-text">{otherParticipant?.name}</p>
                                            <p className="text-xs text-light-text">{msg && new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <p className="text-sm text-medium-text truncate">{conv.subject}</p>
                                        <p className="text-sm text-light-text truncate">{msg?.text}</p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </Card>

            <div className="flex-1 h-full flex-col bg-white rounded-xl shadow-lg border border-gray-100 md:ml-6 hidden md:flex">
                {selectedConversationId ? (
                    <>
                        <div className="p-4 border-b flex items-center gap-3">
                             <h3 className="text-lg font-bold text-dark-text">{conversations.find(c => c.id === selectedConversationId)?.subject}</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                            {messages.filter(m => m.conversationId === selectedConversationId).map(message => {
                                const sender = users.find(u => u.id === message.senderId);
                                const isCurrentUser = message.senderId === currentUser.id;
                                return (
                                    <div key={message.id} className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                        {!isCurrentUser && <img src={sender?.avatar} alt={sender?.name} className="w-8 h-8 rounded-full" />}
                                        <div className={`max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-dark-text rounded-bl-none'}`}>
                                            <p>{message.text}</p>
                                            <p className={`text-xs mt-1 ${isCurrentUser ? 'text-gray-200' : 'text-light-text'} text-left`}>
                                                {new Date(message.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        {isCurrentUser && <img src={sender?.avatar} alt={sender?.name} className="w-8 h-8 rounded-full" />}
                                    </div>
                                );
                            })}
                             <div ref={messagesEndRef} />
                        </div>
                        <MessageInput conversationId={selectedConversationId} />
                    </>
                ) : (
                    <div className="flex-1 flex justify-center items-center text-center text-medium-text">
                        <div>
                            <Icons.MailIcon className="w-24 h-24 mx-auto text-gray-300" />
                            <p className="mt-4">اختر محادثة لعرض الرسائل</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};