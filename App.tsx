import React, { useState, useEffect, createContext, useContext } from 'react';
import { Role, User, Material, Expense, Project, Equipment, Task, Conversation, Message, ManpowerAgent, DailyLog, AttendanceStatus, DailyLogEntry } from './types';
import { 
    USERS as INITIAL_USERS, 
    MATERIALS as INITIAL_MATERIALS, 
    EXPENSES as INITIAL_EXPENSES, 
    PROJECTS as INITIAL_PROJECTS, 
    INITIAL_EQUIPMENT, 
    TASKS as INITIAL_TASKS,
    CONVERSATIONS as INITIAL_CONVERSATIONS,
    MESSAGES as INITIAL_MESSAGES,
    MANPOWER_AGENTS as INITIAL_MANPOWER_AGENTS,
    DAILY_LOGS as INITIAL_DAILY_LOGS
} from './constants';
import * as Icons from './components/icons';
import Dashboard from './components/Dashboard';
// FIX: Added MailPage to imports as it is now exported from components/pages.tsx
import { ProjectsPage, TasksPage, FinancialsPage, InventoryPage, EquipmentPage, UsersPage, MailPage, ManpowerPage, DailyLogPage } from './components/pages';

const LOGO_SRC = 'https://l.top4top.io/p_3599oulz31.png';

// --- I18n (Internationalization) Setup ---

const translations = {
  en: {
    // General
    language: 'Language',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    confirm: 'Confirm',
    logout: 'Logout',
    // Login
    signInToAccount: 'Sign in to your account',
    signInToContinue: 'Sign in to continue to your dashboard.',
    user: 'User',
    password: 'Password',
    passwordHint: "Hint: The password is 'password123'",
    login: 'Login',
    invalidCredentials: 'Invalid username or password.',
    // Header
    welcome: 'Welcome',
    notifications: 'Notifications',
    exportData: 'Export Data',
    // Sidebar
    dashboard: 'Dashboard',
    projects: 'Projects',
    tasks: 'Tasks',
    manpower: 'Manpower',
    dailyLog: 'Daily Log',
    mail: 'Mail',
    financials: 'Financials',
    inventory: 'Inventory',
    equipment: 'Equipment',
    users: 'Users',
    // Roles
    ProjectManager: 'Project Manager',
    Worker: 'Worker',
    FinanceManager: 'Finance Manager',
    EquipmentOperator: 'Equipment Operator',
    InventoryManager: 'Inventory Manager',
    Supplier: 'Supplier',
    SiteSupervisor: 'Site Supervisor',
    SiteEngineer: 'Site Engineer',
    Client: 'Client',
    // Task Status
    Pending: 'Pending',
    InProgress: 'In Progress',
    Completed: 'Completed',
    Overdue: 'Overdue',
    // Project Status
    OnTrack: 'On Track',
    AtRisk: 'At Risk',
    // Equipment Status
    Available: 'Available',
    InUse: 'In Use',
    Maintenance: 'Maintenance',
    // Expense Status
    Approved: 'Approved',
    Rejected: 'Rejected',
    // Supplier Order Status
    Ordered: 'Ordered',
    Shipped: 'Shipped',
    Delivered: 'Delivered',
    // Pages & Components
    dashboardWelcome: 'Welcome back',
    dashboardOverview: "Here's your dashboard overview for today.",
    customizeDashboard: 'Customize Dashboard',
    // ... (Add many more keys as needed for full translation)
  },
  ar: {
    // General
    language: 'اللغة',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    add: 'إضافة',
    confirm: 'تأكيد',
    logout: 'تسجيل الخروج',
    // Login
    signInToAccount: 'تسجيل الدخول إلى حسابك',
    signInToContinue: 'سجل الدخول للمتابعة إلى لوحة التحكم الخاصة بك.',
    user: 'المستخدم',
    password: 'كلمة المرور',
    passwordHint: "تلميح: كلمة المرور هي 'password123'",
    login: 'تسجيل الدخول',
    invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
    // Header
    welcome: 'أهلاً بك',
    notifications: 'الإشعارات',
    exportData: 'تصدير البيانات',
    // Sidebar
    dashboard: 'لوحة التحكم',
    projects: 'المشاريع',
    tasks: 'المهام',
    manpower: 'القوى العاملة',
    dailyLog: 'التقرير اليومي',
    mail: 'البريد',
    financials: 'المالية',
    inventory: 'المخزون',
    equipment: 'المعدات',
    users: 'المستخدمون',
    // Roles
    ProjectManager: 'مدير المشروع',
    Worker: 'عامل',
    FinanceManager: 'مدير مالي',
    EquipmentOperator: 'مشغل معدات',
    InventoryManager: 'مدير المخزون',
    Supplier: 'مورد',
    SiteSupervisor: 'مشرف موقع',
    SiteEngineer: 'مهندس موقع',
    Client: 'عميل',
    // Task Status
    Pending: 'قيد الانتظار',
    InProgress: 'قيد التنفيذ',
    Completed: 'مكتملة',
    Overdue: 'متأخرة',
    // Project Status
    OnTrack: 'في المسار الصحيح',
    AtRisk: 'في خطر',
    CompletedProject: 'مكتمل', // Distinct key for project status
    // Equipment Status
    Available: 'متاحة',
    InUse: 'قيد الاستخدام',
    Maintenance: 'تحت الصيانة',
    // Expense Status
    Approved: 'موافق عليه',
    Rejected: 'مرفوض',
    // Supplier Order Status
    Ordered: 'تم الطلب',
    Shipped: 'تم الشحن',
    Delivered: 'تم التسليم',
    // Pages & Components
    dashboardWelcome: 'أهلاً بعودتك',
    dashboardOverview: 'إليك نظرة عامة على لوحة التحكم الخاصة بك لليوم.',
    customizeDashboard: 'تخصيص لوحة التحكم',
    // ...
  },
  hi: {
    // General
    language: 'भाषा',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    add: 'जोड़ें',
    confirm: 'पुष्टि करें',
    logout: 'लॉग आउट',
    // Login
    signInToAccount: 'अपने खाते में साइन इन करें',
    signInToContinue: 'अपने डैशबोर्ड पर जारी रखने के लिए साइन इन करें।',
    user: 'उपयोगकर्ता',
    password: 'पासवर्ड',
    passwordHint: "संकेत: पासवर्ड 'password123' है",
    login: 'लॉग इन करें',
    invalidCredentials: 'अमान्य उपयोगकर्ता नाम या पासवर्ड।',
    // Header
    welcome: 'स्वागत है',
    notifications: 'सूचनाएं',
    exportData: 'डेटा निर्यात करें',
    // Sidebar
    dashboard: 'डैशबोर्ड',
    projects: 'परियोजनाएं',
    tasks: 'कार्य',
    manpower: 'जनशक्ति',
    dailyLog: 'दैनिक लॉग',
    mail: 'मेल',
    financials: 'वित्तीय',
    inventory: 'इन्वेंटरी',
    equipment: 'उपकरण',
    users: 'उपयोगकर्ता',
    // Roles
    ProjectManager: 'परियोजना प्रबंधक',
    Worker: 'कार्यकर्ता',
    FinanceManager: 'वित्त प्रबंधक',
    EquipmentOperator: 'उपकरण ऑपरेटर',
    InventoryManager: 'इन्वेंटरी प्रबंधक',
    Supplier: 'प्रदायक',
    SiteSupervisor: 'साइट पर्यवेक्षक',
    SiteEngineer: 'साइट इंजीनियर',
    Client: 'ग्राहक',
    // Task Status
    Pending: 'लंबित',
    InProgress: 'प्रगति में है',
    Completed: 'पूरा हो गया',
    Overdue: 'अतिदेय',
    // Project Status
    OnTrack: 'सही रास्ते पर',
    AtRisk: 'खतरे में',
    CompletedProject: 'पूरा हो गया',
    // Equipment Status
    Available: 'उपलब्ध',
    InUse: 'उपयोग में',
    Maintenance: 'रखरखाव',
    // Expense Status
    Approved: 'अनुमोदित',
    Rejected: 'अस्वीकृत',
    // Supplier Order Status
    Ordered: 'आदेश दिया',
    Shipped: 'भेज दिया गया',
    Delivered: 'पहुंचा दिया',
    // Pages & Components
    dashboardWelcome: 'वापसी पर स्वागत है',
    dashboardOverview: 'आज के लिए आपका डैशबोर्ड अवलोकन यहां है।',
    customizeDashboard: 'डैशबोर्ड अनुकूलित करें',
    // ...
  },
};

type Language = 'en' | 'ar' | 'hi';
type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const storedLang = localStorage.getItem('constructflow-lang');
    if (storedLang === 'en' || storedLang === 'ar' || storedLang === 'hi') {
      return storedLang as Language;
    }
    return 'ar';
  });
  
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('constructflow-lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const t = (key: TranslationKey | string): string => {
    return translations[language][key as TranslationKey] || translations.en[key as TranslationKey] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

// --- Theme Setup ---
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('constructflow-theme');
    return (storedTheme as Theme) || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('constructflow-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


// --- Main App Structure ---

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [equipment, setEquipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [manpowerAgents, setManpowerAgents] = useState<ManpowerAgent[]>(INITIAL_MANPOWER_AGENTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(INITIAL_DAILY_LOGS);


  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveView('Dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const handleAddUser = (user: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...user, id: Date.now(), password: user.password || 'password123' }]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    if (currentUser?.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  };
  
  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    if (currentUser?.id === userId) {
        handleLogout();
    }
  };

  const handleUpdateUserPassword = (userId: number, newPassword: string) => {
    setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, password: newPassword } : user
    ));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, password: newPassword } : null);
    }
  };

  const handleAddProject = (project: Omit<Project, 'id'>) => {
    setProjects(prev => [...prev, { ...project, id: Date.now() }]);
  };
  
  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleDeleteProject = (projectId: number) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    // Note: In a real app, you'd also handle deleting associated tasks, expenses etc.
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: Date.now() }]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };
  
  const handleDeleteTask = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleAddMaterial = (material: Omit<Material, 'id'>) => {
    setMaterials(prev => [...prev, { ...material, id: Date.now() }]);
  };
  
  const handleUpdateMaterial = (updatedMaterial: Material) => {
    setMaterials(prev => prev.map(m => m.id === updatedMaterial.id ? updatedMaterial : m));
  };

  const handleDeleteMaterial = (materialId: number) => {
    setMaterials(prev => prev.filter(m => m.id !== materialId));
  };

  const handleAddEquipment = (item: Omit<Equipment, 'id'>) => {
    setEquipment(prev => [...prev, { ...item, id: Date.now() }]);
  };

  const handleUpdateEquipment = (updatedItem: Equipment) => {
    setEquipment(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleDeleteEquipment = (itemId: number) => {
    setEquipment(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>, materialUpdate?: { materialId: number; quantity: number; }) => {
    setExpenses(prev => [...prev, { ...newExpense, id: Date.now() }]);
    if (materialUpdate) {
        setMaterials(prev => prev.map(m => 
            m.id === materialUpdate.materialId 
            ? { ...m, quantity: m.quantity - materialUpdate.quantity } 
            : m
        ));
    }
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    // Note: For simplicity, editing a material expense does not revert/change inventory.
    setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
  };

  const handleDeleteExpense = (expenseId: number) => {
     // Note: For simplicity, deleting a material expense does not revert/change inventory.
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  const handleAddManpowerAgent = (agent: Omit<ManpowerAgent, 'id'>) => {
    setManpowerAgents(prev => [...prev, { ...agent, id: Date.now() }]);
  };

  const handleUpdateManpowerAgent = (updatedAgent: ManpowerAgent) => {
    setManpowerAgents(prev => prev.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent));
  };

  const handleDeleteManpowerAgent = (agentId: number) => {
    setManpowerAgents(prev => prev.filter(agent => agent.id !== agentId));
  };

  const handleSendMessage = (conversationId: number, text: string) => {
      if (!currentUser) return;
      const newMessage: Message = {
          id: Date.now(),
          conversationId,
          senderId: currentUser.id,
          text,
          timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMessage]);
  };

  const handleNewConversation = (recipientId: number, subject: string, text: string) => {
    if (!currentUser) return;
    const conversationId = Date.now();
    const newConversation: Conversation = {
        id: conversationId,
        subject,
        participantIds: [currentUser.id, recipientId],
    };
    const newMessage: Message = {
        id: conversationId + 1,
        conversationId: newConversation.id,
        senderId: currentUser.id,
        text,
        timestamp: new Date().toISOString(),
    };
    setConversations(prev => [...prev, newConversation]);
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAddDailyLog = (log: Omit<DailyLog, 'id'>) => {
    const newLog = { ...log, id: Date.now() };
    setDailyLogs(prev => [newLog, ...prev]);

    // Also create a "report" message for managers
    if (!currentUser) return;
    const projectManager = users.find(u => u.role === Role.ProjectManager);
    const siteEngineer = users.find(u => u.role === Role.SiteEngineer);
    const recipients = [projectManager, siteEngineer].filter(Boolean) as User[];
    if (recipients.length === 0) return;

    const presentCount = log.entries.filter(e => e.status === AttendanceStatus.Present).length;
    const totalCount = log.entries.length;
    const subject = `تقرير الحضور اليومي - ${log.date}`;
    const text = `تم تقديم تقرير الحضور لموقع العمل "${log.workplace}" لليوم ${log.date}. الحضور: ${presentCount}/${totalCount}.`;

    recipients.forEach(recipient => {
      handleNewConversation(recipient.id, subject, text);
    });
  };

  const exportToCsv = (data: any[], filename: string) => {
      if (data.length === 0) {
          console.log(`No data to export for ${filename}`);
          return;
      }
  
      const header = Object.keys(data[0]);
      // Escape commas in values by wrapping in quotes
      const csvRows = data.map(row => 
          header.map(fieldName => {
              const value = String(row[fieldName] ?? '');
              return `"${value.replace(/"/g, '""')}"`; // Escape double quotes
          }).join(',')
      );
      
      const csvString = [header.join(','), ...csvRows].join('\r\n');
      
      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  };
  
  const handleExportData = () => {
      // Sanitize users data to remove passwords
      const sanitizedUsers = users.map(({ password, ...user }) => user);
  
      exportToCsv(projects, 'projects.csv');
      exportToCsv(tasks, 'tasks.csv');
      exportToCsv(sanitizedUsers, 'users.csv');
      exportToCsv(expenses, 'expenses.csv');
      exportToCsv(materials, 'materials.csv');
      exportToCsv(equipment, 'equipment.csv');
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg">
      <div className="no-print">
        <Sidebar 
          currentUser={currentUser} 
          activeView={activeView} 
          setActiveView={setActiveView} 
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="no-print">
          <Header 
            currentUser={currentUser} 
            onLogout={handleLogout} 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            materials={materials} 
            onExport={handleExportData}
          />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-bg dark:bg-dark-bg p-6 md:p-8">
          <PageContent 
            activeView={activeView} 
            currentUser={currentUser} 
            materials={materials}
            onAddMaterial={handleAddMaterial}
            onUpdateMaterial={handleUpdateMaterial}
            onDeleteMaterial={handleDeleteMaterial}
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onUpdateUserPassword={handleUpdateUserPassword}
            projects={projects}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            equipment={equipment}
            onAddEquipment={handleAddEquipment}
            onUpdateEquipment={handleUpdateEquipment}
            onDeleteEquipment={handleDeleteEquipment}
            manpowerAgents={manpowerAgents}
            onAddManpowerAgent={handleAddManpowerAgent}
            onUpdateManpowerAgent={handleUpdateManpowerAgent}
            onDeleteManpowerAgent={handleDeleteManpowerAgent}
            conversations={conversations}
            messages={messages}
            onSendMessage={handleSendMessage}
            onNewConversation={handleNewConversation}
            dailyLogs={dailyLogs}
            onAddDailyLog={handleAddDailyLog}
            setActiveView={setActiveView}
          />
        </main>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const LanguageSwitcher: React.FC<{ inLogin?: boolean }> = ({ inLogin = false }) => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const languages: { code: Language; name: string }[] = [
        { code: 'ar', name: 'العربية' },
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिन्दी' },
    ];
    const ref = React.useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref]);

    const buttonClasses = inLogin ? "text-medium-text hover:text-primary" : "text-light-text dark:text-dark-text-secondary hover:text-primary";
    const menuPosition = inLogin ? "top-full mt-2" : "start-0 mt-2";


    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className={buttonClasses} title="Change Language">
                <Icons.LanguageIcon className="w-6 h-6" />
            </button>
            {isOpen && (
                <div className={`absolute ${menuPosition} end-0 w-36 bg-white dark:bg-dark-card rounded-md shadow-lg z-20 border dark:border-dark-border`}>
                    <ul className="py-1">
                        {languages.map(lang => (
                             <li key={lang.code}>
                                <button
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-start px-4 py-2 text-sm text-medium-text dark:text-dark-text-secondary hover:bg-light-bg dark:hover:bg-slate-700 ${language === lang.code ? 'font-bold text-primary' : ''}`}
                                >
                                    {lang.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="text-light-text dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            {theme === 'light' ? (
                <Icons.MoonIcon className="w-6 h-6" />
            ) : (
                <Icons.SunIcon className="w-6 h-6" />
            )}
        </button>
    );
};


const LoginScreen: React.FC<{ onLogin: (user: User) => void, users: User[] }> = ({ onLogin, users }) => {
  const { t, dir } = useLanguage();
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id.toString() || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
        const user = users.find(u => u.id === parseInt(selectedUserId));
        if (user && user.password === password) {
            onLogin(user);
        } else {
            setError(t('invalidCredentials'));
        }
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Form Column */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 order-2 lg:order-1">
          <div className="w-full max-w-md">
            <div className={`flex justify-between items-center mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <img src={LOGO_SRC} alt="ConstructFlow Logo" className="h-10" />
              <div className="flex items-center gap-4">
                <LanguageSwitcher inLogin />
                <ThemeToggle />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-dark-text dark:text-dark-text-primary mb-2">{t('signInToAccount')}</h1>
            <p className="text-medium-text dark:text-dark-text-secondary mb-8">{t('signInToContinue')}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Select */}
              <div>
                <label htmlFor="user-select" className="block text-sm font-bold text-medium-text dark:text-dark-text-secondary mb-2">{t('user')}</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'end-0 pr-3' : 'start-0 pl-3'} flex items-center pointer-events-none`}>
                    <Icons.UserCircleIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="user-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className={`w-full border bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white border-gray-300 rounded-lg p-3 ${dir === 'rtl' ? 'pr-10' : 'pl-10'} focus:ring-primary focus:border-primary transition`}
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name} ({t(user.role)})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password-input" className="block text-sm font-bold text-medium-text dark:text-dark-text-secondary mb-2">{t('password')}</label>
                <div className="relative">
                   <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'end-0 pr-3' : 'start-0 pl-3'} flex items-center pointer-events-none`}>
                    <Icons.LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-700 dark:text-white ${dir === 'rtl' ? 'pr-10' : 'pl-10'} focus:ring-primary focus:border-primary transition`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 ${dir === 'rtl' ? 'start-0 pl-3' : 'end-0 pr-3'} flex items-center text-gray-400 hover:text-gray-600`}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Icons.EyeSlashIcon className="h-5 w-5" /> : <Icons.EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">{t('passwordHint')}</p>
              </div>

              {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-lg">{error}</p>}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 flex justify-center items-center disabled:bg-primary/70 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-primary/40"
                >
                  {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                  ) : t('login')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Image Column */}
        <div className="hidden lg:block order-1 lg:order-2">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}
          >
            {/* Overlay for better text readability if needed */}
            <div className="w-full h-full bg-black/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<{ currentUser: User, onLogout: () => void, onMenuClick: () => void, materials: Material[], onExport: () => void }> = ({ currentUser, onLogout, onMenuClick, materials, onExport }) => {
    const { t } = useLanguage();
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const notificationRef = React.useRef<HTMLDivElement>(null);

    const lowStockItems = materials.filter(m => m.quantity <= m.threshold);

    const handleNotificationClick = () => {
        setNotificationsOpen(!notificationsOpen);
    };

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [notificationRef]);
    
    return (
        <header className="bg-white dark:bg-dark-card shadow-sm p-4 flex justify-between items-center border-b dark:border-dark-border">
             <div className="flex items-center gap-x-4">
                <button onClick={onMenuClick} className="lg:hidden text-gray-500 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                 <img src={LOGO_SRC} alt="ConstructFlow Logo" className="h-8" />
            </div>
            <div className="flex items-center gap-x-4">
                 <span className="hidden sm:block text-medium-text dark:text-dark-text-secondary">{t('welcome')}, {currentUser.name}</span>

                {currentUser.role === Role.InventoryManager && (
                    <div className="relative" ref={notificationRef}>
                        <button onClick={handleNotificationClick} className="text-light-text dark:text-dark-text-secondary hover:text-primary relative" title={t('notifications')}>
                            <Icons.NotificationIcon className="w-6 h-6" />
                            {lowStockItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                                </span>
                            )}
                        </button>
                        {notificationsOpen && (
                            <div className="absolute end-0 mt-2 w-80 bg-white dark:bg-dark-card rounded-md shadow-lg z-20 border dark:border-dark-border">
                                <div className="p-3 border-b dark:border-dark-border">
                                    <h4 className="font-semibold text-dark-text dark:text-dark-text-primary">إشعارات المخزون</h4>
                                </div>
                                <ul className="py-1 max-h-64 overflow-y-auto">
                                    {lowStockItems.length > 0 ? (
                                        lowStockItems.map(item => (
                                            <li key={item.id} className="px-4 py-3 text-sm text-medium-text dark:text-dark-text-secondary hover:bg-light-bg dark:hover:bg-slate-700 border-b dark:border-dark-border last:border-b-0 cursor-pointer">
                                                <p className="font-semibold text-red-600 dark:text-red-400">
                                                    <span className="font-bold">{item.name}</span> على وشك النفاد!
                                                </p>
                                                <p className="text-xs text-light-text dark:text-slate-400 mt-1">
                                                    الكمية المتبقية: {item.quantity} {item.unit} (الحد الأدنى: {item.threshold})
                                                </p>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-3 text-sm text-light-text dark:text-dark-text-secondary">لا توجد إشعارات جديدة.</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                
                <button onClick={onExport} className="text-light-text dark:text-dark-text-secondary hover:text-primary" title={t('exportData')}>
                    <Icons.DownloadIcon className="w-6 h-6" />
                </button>
                <LanguageSwitcher />
                <ThemeToggle />
                <button onClick={onLogout} className="text-light-text dark:text-dark-text-secondary hover:text-primary" title={t('logout')}>
                    <Icons.LogoutIcon className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};


const Sidebar: React.FC<{ 
    currentUser: User, 
    activeView: string, 
    setActiveView: (view: string) => void, 
    onLogout: () => void,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
}> = ({ currentUser, activeView, setActiveView, onLogout, isOpen, setIsOpen }) => {
  const { t, dir } = useLanguage();
  const getNavItemsForRole = (role: Role) => {
      const allItems: { view: string; labelKey: TranslationKey; icon: React.FC<{ className?: string; }> }[] = [
        { view: 'Dashboard', labelKey: 'dashboard', icon: Icons.DashboardIcon },
        { view: 'Projects', labelKey: 'projects', icon: Icons.ProjectsIcon },
        { view: 'Tasks', labelKey: 'tasks', icon: Icons.TasksIcon },
        { view: 'Manpower', labelKey: 'manpower', icon: Icons.ManpowerIcon },
        { view: 'DailyLog', labelKey: 'dailyLog', icon: Icons.ClipboardCheckIcon },
        { view: 'Mail', labelKey: 'mail', icon: Icons.MailIcon },
        { view: 'Financials', labelKey: 'financials', icon: Icons.FinanceIcon },
        { view: 'Inventory', labelKey: 'inventory', icon: Icons.InventoryIcon },
        { view: 'Equipment', labelKey: 'equipment', icon: Icons.EquipmentIcon },
        { view: 'Users', labelKey: 'users', icon: Icons.UsersIcon },
      ];
  
      const rolePermissions: { [key in Role]?: string[] } = {
        [Role.ProjectManager]: ['Dashboard', 'Projects', 'Tasks', 'Mail', 'Financials', 'Inventory', 'Equipment', 'Users', 'Manpower', 'DailyLog'],
        [Role.Worker]: ['Dashboard', 'Tasks', 'Mail', 'Manpower'],
        [Role.FinanceManager]: ['Dashboard', 'Financials', 'Mail', 'Manpower'],
        [Role.EquipmentOperator]: ['Dashboard', 'Equipment', 'Tasks', 'Mail', 'Manpower'],
        [Role.InventoryManager]: ['Dashboard', 'Inventory', 'Mail', 'Manpower'],
        [Role.Supplier]: ['Dashboard', 'Mail', 'Manpower'],
        [Role.SiteSupervisor]: ['Dashboard', 'Projects', 'Tasks', 'Users', 'Mail', 'Manpower', 'DailyLog'],
        [Role.SiteEngineer]: ['Dashboard', 'Projects', 'Tasks', 'Users', 'Mail', 'Manpower', 'DailyLog'],
        [Role.Client]: ['Dashboard', 'Projects', 'Mail', 'Manpower'],
      };
      
      const allowedViews = rolePermissions[role] || ['Dashboard', 'Mail'];
      
      if (role !== Role.ProjectManager) {
          return allItems.filter(item => allowedViews.includes(item.view) && item.view !== 'Users');
      }
      return allItems.filter(item => allowedViews.includes(item.view));
    };

  const navItems = getNavItemsForRole(currentUser.role);
  
  interface NavLinkProps {
    view: string;
    label: string;
    icon: React.FC<{className?: string}>;
  }
  const NavLink: React.FC<NavLinkProps> = ({ view, label, icon: Icon }) => (
    <button
      onClick={() => {
        setActiveView(view);
        setIsOpen(false);
      }}
      className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${dir === 'rtl' ? 'space-x-reverse space-x-3 text-right' : 'space-x-3 text-left'} ${
        activeView === view ? 'bg-primary text-white shadow-lg' : 'text-gray-200 hover:bg-primary-dark/50'
      }`}
    >
      <Icon className="w-6 h-6" />
      <span>{label}</span>
    </button>
  );

  const sidebarClasses = `fixed lg:relative z-40 lg:z-auto w-64 bg-dark-bg text-white h-full flex flex-col p-4 transform transition-transform duration-300 ease-in-out ${
    isOpen 
      ? (dir === 'rtl' ? 'translate-x-0' : 'translate-x-0') 
      : (dir === 'rtl' ? 'translate-x-full' : '-translate-x-full')
  } lg:translate-x-0`;

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden no-print ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={sidebarClasses}>
        <div className="mb-8 pt-2">
          <img src={LOGO_SRC} alt="ConstructFlow Logo" className="h-10 mx-auto" />
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => <NavLink key={item.view} view={item.view} label={t(item.labelKey)} icon={item.icon} />)}
        </nav>
        <div className="mt-auto">
            <button
              onClick={onLogout}
              className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 text-gray-200 hover:bg-primary-dark/50 ${dir === 'rtl' ? 'space-x-reverse space-x-3 text-right' : 'space-x-3 text-left'}`}
            >
              <Icons.LogoutIcon className="w-6 h-6" />
              <span>{t('logout')}</span>
            </button>
        </div>
      </aside>
    </>
  );
};

interface PageContentProps {
  activeView: string;
  currentUser: User;
  materials: Material[];
  onAddMaterial: (material: Omit<Material, 'id'>) => void;
  onUpdateMaterial: (material: Material) => void;
  onDeleteMaterial: (materialId: number) => void;
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>, materialUpdate?: { materialId: number; quantity: number; }) => void;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: number) => void;
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
  onUpdateUserPassword: (userId: number, newPassword: string) => void;
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: number) => void;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  equipment: Equipment[];
  onAddEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  onUpdateEquipment: (equipment: Equipment) => void;
  onDeleteEquipment: (equipmentId: number) => void;
  manpowerAgents: ManpowerAgent[];
  onAddManpowerAgent: (agent: Omit<ManpowerAgent, 'id'>) => void;
  onUpdateManpowerAgent: (agent: ManpowerAgent) => void;
  onDeleteManpowerAgent: (agentId: number) => void;
  conversations: Conversation[];
  messages: Message[];
  onSendMessage: (conversationId: number, text: string) => void;
  onNewConversation: (recipientId: number, subject: string, text: string) => void;
  dailyLogs: DailyLog[];
  onAddDailyLog: (log: Omit<DailyLog, 'id'>) => void;
  setActiveView: (view: string) => void;
}

const PageContent: React.FC<PageContentProps> = (props) => {
  const { 
      activeView, currentUser, materials, expenses, users, projects, equipment, tasks,
      onAddUser, onUpdateUser, onDeleteUser, onUpdateUserPassword, onAddProject, onUpdateProject, 
      onDeleteProject, onAddMaterial, onUpdateMaterial, onDeleteMaterial,
      onAddEquipment, onUpdateEquipment, onDeleteEquipment, onAddExpense,
      onUpdateExpense, onDeleteExpense, onAddTask, onUpdateTask, onDeleteTask,
      manpowerAgents, onAddManpowerAgent, onUpdateManpowerAgent, onDeleteManpowerAgent,
      conversations, messages, onSendMessage, onNewConversation,
      dailyLogs, onAddDailyLog,
      setActiveView
  } = props;

  switch (activeView) {
    case 'Dashboard':
      return <Dashboard 
                currentUser={currentUser} 
                materials={materials} 
                expenses={expenses} 
                projects={projects} 
                equipment={equipment} 
                users={users}
                tasks={tasks}
                manpowerAgents={manpowerAgents}
                onUpdateUser={onUpdateUser} 
                onNavigate={setActiveView}
                onUpdateExpense={onUpdateExpense}
            />;
    case 'Projects':
      return <ProjectsPage 
                projects={projects} 
                tasks={tasks} 
                onAdd={onAddProject} 
                onUpdate={onUpdateProject} 
                onDelete={onDeleteProject} 
                users={users}
                currentUser={currentUser}
                onAddTask={onAddTask}
            />;
    case 'Tasks':
      return <TasksPage 
                projects={projects} 
                tasks={tasks} 
                users={users} 
                currentUser={currentUser}
                onAddTask={onAddTask} 
                onUpdateTask={onUpdateTask} 
                onDeleteTask={onDeleteTask} 
            />;
    case 'Financials':
      return <FinancialsPage 
                projects={projects} 
                expenses={expenses} 
                onAddExpense={onAddExpense}
                onUpdateExpense={onUpdateExpense}
                onDeleteExpense={onDeleteExpense}
                materials={materials}
            />;
    case 'Inventory':
      return <InventoryPage 
                materials={materials} 
                onAdd={onAddMaterial} 
                onUpdate={onUpdateMaterial} 
                onDelete={onDeleteMaterial} 
            />;
    case 'Equipment':
      return <EquipmentPage 
                equipment={equipment} 
                users={users} 
                onAdd={onAddEquipment} 
                onUpdate={onUpdateEquipment} 
                onDelete={onDeleteEquipment} 
            />;
    case 'Users':
      return <UsersPage 
                users={users} 
                currentUser={currentUser}
                onAdd={onAddUser} 
                onUpdate={onUpdateUser} 
                onDelete={onDeleteUser} 
                onUpdateUserPassword={onUpdateUserPassword}
            />;
    case 'Mail':
      return <MailPage
                currentUser={currentUser}
                users={users}
                conversations={conversations}
                messages={messages}
                onSendMessage={onSendMessage}
                onNewConversation={onNewConversation}
              />;
    case 'Manpower':
      return <ManpowerPage
                manpowerAgents={manpowerAgents}
                currentUser={currentUser}
                onAdd={onAddManpowerAgent}
                onUpdate={onUpdateManpowerAgent}
                onDelete={onDeleteManpowerAgent}
              />;
    case 'DailyLog':
      return <DailyLogPage
                currentUser={currentUser}
                manpowerAgents={manpowerAgents}
                dailyLogs={dailyLogs}
                users={users}
                onAddDailyLog={onAddDailyLog}
              />
    default:
      return <Dashboard 
                currentUser={currentUser} 
                materials={materials} 
                expenses={expenses} 
                projects={projects} 
                equipment={equipment} 
                users={users}
                tasks={tasks}
                manpowerAgents={manpowerAgents}
                onUpdateUser={onUpdateUser} 
                onNavigate={setActiveView}
                onUpdateExpense={onUpdateExpense}
            />;
  }
};


const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
