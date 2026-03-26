export type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
  tenure: string;
  hrmsSource: string;
  status: 'active' | 'pending' | 'flagged';
  birthday: string;
  workAnniversary: string;
  location: string;
  email: string;
};

export type Department = {
  id: string;
  name: string;
  headcount: number;
  allocatedBudget: number;
  usedBudget: number;
  manager: string;
  sentiment: 'positive' | 'neutral' | 'negative';
};

export type GiftOrder = {
  id: string;
  employeeName: string;
  department: string;
  giftType: string;
  provider: string;
  amount: number;
  status: 'pending' | 'processing' | 'delivered' | 'failed';
  occasion: string;
  deliveryChannel: string;
  createdAt: string;
};

export type HRMSConnector = {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  connectionType: string;
  lastSync: string;
  employeeCount: number;
  description: string;
  color: string;
};

export type GiftProvider = {
  id: string;
  name: string;
  type: 'gift-card' | 'meal-voucher' | 'mf-gift';
  status: 'active' | 'inactive' | 'maintenance';
  catalogSize: number;
  description: string;
  color: string;
  apiVersion: string;
};

export type AIInsight = {
  id: string;
  type: 'recommendation' | 'alert' | 'trend';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  department?: string;
  employeeCount?: number;
  actionRequired: boolean;
};

export const employees: Employee[] = [
  {
    id: 'EMP001',
    name: 'Priya Sharma',
    department: 'Engineering',
    role: 'Senior Software Engineer',
    tenure: '3 years 2 months',
    hrmsSource: 'Workday',
    status: 'active',
    birthday: '1992-04-15',
    workAnniversary: '2021-01-10',
    location: 'Bengaluru',
    email: 'priya.sharma@acme.com',
  },
  {
    id: 'EMP002',
    name: 'Rahul Mehta',
    department: 'Sales',
    role: 'Account Executive',
    tenure: '1 year 8 months',
    hrmsSource: 'SAP SuccessFactors',
    status: 'active',
    birthday: '1990-07-22',
    workAnniversary: '2022-08-05',
    location: 'Mumbai',
    email: 'rahul.mehta@acme.com',
  },
  {
    id: 'EMP003',
    name: 'Ananya Krishnan',
    department: 'HR',
    role: 'HR Business Partner',
    tenure: '5 years 1 month',
    hrmsSource: 'Darwinbox',
    status: 'active',
    birthday: '1988-11-03',
    workAnniversary: '2019-03-18',
    location: 'Chennai',
    email: 'ananya.krishnan@acme.com',
  },
  {
    id: 'EMP004',
    name: 'Vikram Nair',
    department: 'Finance',
    role: 'Financial Analyst',
    tenure: '2 years 5 months',
    hrmsSource: 'Keka',
    status: 'pending',
    birthday: '1993-02-28',
    workAnniversary: '2021-10-12',
    location: 'Hyderabad',
    email: 'vikram.nair@acme.com',
  },
  {
    id: 'EMP005',
    name: 'Sneha Patel',
    department: 'Marketing',
    role: 'Marketing Manager',
    tenure: '4 years 7 months',
    hrmsSource: 'Oracle HCM',
    status: 'active',
    birthday: '1989-09-14',
    workAnniversary: '2019-08-20',
    location: 'Pune',
    email: 'sneha.patel@acme.com',
  },
  {
    id: 'EMP006',
    name: 'Arjun Reddy',
    department: 'Engineering',
    role: 'DevOps Engineer',
    tenure: '6 months',
    hrmsSource: 'Workday',
    status: 'active',
    birthday: '1995-06-08',
    workAnniversary: '2023-09-01',
    location: 'Bengaluru',
    email: 'arjun.reddy@acme.com',
  },
  {
    id: 'EMP007',
    name: 'Deepika Joshi',
    department: 'Customer Success',
    role: 'CSM Lead',
    tenure: '2 years 11 months',
    hrmsSource: 'Xoxoday Plum',
    status: 'flagged',
    birthday: '1991-12-19',
    workAnniversary: '2021-04-07',
    location: 'Delhi',
    email: 'deepika.joshi@acme.com',
  },
  {
    id: 'EMP008',
    name: 'Karthik Subramanian',
    department: 'Sales',
    role: 'Sales Director',
    tenure: '7 years 3 months',
    hrmsSource: 'SAP SuccessFactors',
    status: 'active',
    birthday: '1985-03-25',
    workAnniversary: '2016-12-01',
    location: 'Mumbai',
    email: 'karthik.s@acme.com',
  },
  {
    id: 'EMP009',
    name: 'Meera Iyer',
    department: 'Design',
    role: 'UX Designer',
    tenure: '1 year 3 months',
    hrmsSource: 'Almonds AI',
    status: 'active',
    birthday: '1997-08-11',
    workAnniversary: '2022-12-15',
    location: 'Bengaluru',
    email: 'meera.iyer@acme.com',
  },
  {
    id: 'EMP010',
    name: 'Rohan Gupta',
    department: 'Finance',
    role: 'CFO',
    tenure: '9 years 6 months',
    hrmsSource: 'Oracle HCM',
    status: 'active',
    birthday: '1978-01-30',
    workAnniversary: '2014-07-22',
    location: 'Delhi',
    email: 'rohan.gupta@acme.com',
  },
];

export const departments: Department[] = [
  {
    id: 'DEPT001',
    name: 'Engineering',
    headcount: 145,
    allocatedBudget: 580000,
    usedBudget: 412000,
    manager: 'Aryan Kapoor',
    sentiment: 'positive',
  },
  {
    id: 'DEPT002',
    name: 'Sales',
    headcount: 87,
    allocatedBudget: 348000,
    usedBudget: 301000,
    manager: 'Karthik Subramanian',
    sentiment: 'positive',
  },
  {
    id: 'DEPT003',
    name: 'HR',
    headcount: 32,
    allocatedBudget: 128000,
    usedBudget: 64000,
    manager: 'Ananya Krishnan',
    sentiment: 'neutral',
  },
  {
    id: 'DEPT004',
    name: 'Finance',
    headcount: 41,
    allocatedBudget: 164000,
    usedBudget: 98000,
    manager: 'Rohan Gupta',
    sentiment: 'neutral',
  },
  {
    id: 'DEPT005',
    name: 'Marketing',
    headcount: 56,
    allocatedBudget: 224000,
    usedBudget: 189000,
    manager: 'Sneha Patel',
    sentiment: 'positive',
  },
  {
    id: 'DEPT006',
    name: 'Customer Success',
    headcount: 63,
    allocatedBudget: 252000,
    usedBudget: 198000,
    manager: 'Deepika Joshi',
    sentiment: 'negative',
  },
];

export const giftOrders: GiftOrder[] = [
  {
    id: 'ORD001',
    employeeName: 'Priya Sharma',
    department: 'Engineering',
    giftType: 'Amazon Gift Card',
    provider: 'QwikCliver',
    amount: 2000,
    status: 'delivered',
    occasion: 'Work Anniversary',
    deliveryChannel: 'WhatsApp',
    createdAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'ORD002',
    employeeName: 'Rahul Mehta',
    department: 'Sales',
    giftType: 'Swiggy Voucher',
    provider: 'Pluxee',
    amount: 500,
    status: 'processing',
    occasion: 'Birthday',
    deliveryChannel: 'Email',
    createdAt: '2024-03-18T09:15:00Z',
  },
  {
    id: 'ORD003',
    employeeName: 'Ananya Krishnan',
    department: 'HR',
    giftType: 'Flipkart Gift Card',
    provider: 'Tillo',
    amount: 3000,
    status: 'pending',
    occasion: '5-Year Milestone',
    deliveryChannel: 'RCS',
    createdAt: '2024-03-20T14:00:00Z',
  },
  {
    id: 'ORD004',
    employeeName: 'Deepika Joshi',
    department: 'Customer Success',
    giftType: 'MF Gift (Tata MF)',
    provider: 'AMC Partner',
    amount: 5000,
    status: 'failed',
    occasion: 'Performance Award',
    deliveryChannel: 'D2C Widget',
    createdAt: '2024-03-19T11:45:00Z',
  },
  {
    id: 'ORD005',
    employeeName: 'Sneha Patel',
    department: 'Marketing',
    giftType: 'Zomato Voucher',
    provider: 'Zaggle',
    amount: 750,
    status: 'delivered',
    occasion: 'Birthday',
    deliveryChannel: 'WhatsApp',
    createdAt: '2024-03-14T16:20:00Z',
  },
];

export const hrmsConnectors: HRMSConnector[] = [
  {
    id: 'HRMS001',
    name: 'Workday',
    logo: 'W',
    status: 'connected',
    connectionType: 'REST API + SSO',
    lastSync: '2 minutes ago',
    employeeCount: 1243,
    description: 'Core HCM, Payroll & Talent Management',
    color: '#CC0000',
  },
  {
    id: 'HRMS002',
    name: 'SAP SuccessFactors',
    logo: 'SF',
    status: 'connected',
    connectionType: 'OData API + SCIM',
    lastSync: '15 minutes ago',
    employeeCount: 872,
    description: 'Employee Central & Performance',
    color: '#F0AB00',
  },
  {
    id: 'HRMS003',
    name: 'Darwinbox',
    logo: 'DB',
    status: 'syncing',
    connectionType: 'REST API + Webhooks',
    lastSync: 'Syncing now...',
    employeeCount: 534,
    description: 'Core HR, Onboarding & Engagement',
    color: '#6C3AE6',
  },
  {
    id: 'HRMS004',
    name: 'Keka / greytHR',
    logo: 'KG',
    status: 'connected',
    connectionType: 'REST API',
    lastSync: '1 hour ago',
    employeeCount: 312,
    description: 'Payroll, Attendance & Leave',
    color: '#E85D26',
  },
  {
    id: 'HRMS005',
    name: 'Oracle HCM',
    logo: 'OR',
    status: 'error',
    connectionType: 'REST API + SCIM',
    lastSync: '3 hours ago (error)',
    employeeCount: 0,
    description: 'Global HR & Workforce Management',
    color: '#F80000',
  },
  {
    id: 'HRMS006',
    name: 'Xoxoday Plum',
    logo: 'XP',
    status: 'connected',
    connectionType: 'REST API + SSO',
    lastSync: '30 minutes ago',
    employeeCount: 198,
    description: 'Rewards & Recognition Platform',
    color: '#FF6B35',
  },
  {
    id: 'HRMS007',
    name: 'Almonds AI',
    logo: 'AI',
    status: 'disconnected',
    connectionType: 'REST API',
    lastSync: 'Not connected',
    employeeCount: 0,
    description: 'AI-powered HR Analytics',
    color: '#5B6AD0',
  },
];

export const giftProviders: GiftProvider[] = [
  {
    id: 'PROV001',
    name: 'QwikCliver',
    type: 'gift-card',
    status: 'active',
    catalogSize: 250,
    description: 'Gift Cards — Amazon, Flipkart, Myntra, Nykaa & 250+ brands',
    color: '#4F46E5',
    apiVersion: 'v3.1',
  },
  {
    id: 'PROV002',
    name: 'Tillo',
    type: 'gift-card',
    status: 'active',
    catalogSize: 2000,
    description: 'Global Gift Card Network — 2000+ brands across 30 countries',
    color: '#7C3AED',
    apiVersion: 'v2.5',
  },
  {
    id: 'PROV003',
    name: 'Pluxee',
    type: 'meal-voucher',
    status: 'active',
    catalogSize: 50000,
    description: 'Meal Vouchers — Swiggy, Zomato, 50,000+ restaurants',
    color: '#059669',
    apiVersion: 'v4.0',
  },
  {
    id: 'PROV004',
    name: 'Zaggle',
    type: 'meal-voucher',
    status: 'maintenance',
    catalogSize: 12000,
    description: 'Prepaid Cards & Meal Vouchers — Expense Management',
    color: '#D97706',
    apiVersion: 'v1.8',
  },
  {
    id: 'PROV005',
    name: 'AMC Partners (MF Gift)',
    type: 'mf-gift',
    status: 'active',
    catalogSize: 45,
    description: 'Mutual Fund Gift PPI — Tata MF, HDFC MF, SBI MF & 45 AMCs',
    color: '#0891B2',
    apiVersion: 'v1.2',
  },
];

export const aiInsights: AIInsight[] = [
  {
    id: 'INS001',
    type: 'alert',
    title: 'High Attrition Risk Detected',
    description: 'Customer Success team shows 34% higher attrition signals vs last quarter. Negative Slack sentiment patterns detected over past 3 weeks.',
    priority: 'high',
    department: 'Customer Success',
    employeeCount: 8,
    actionRequired: true,
  },
  {
    id: 'INS002',
    type: 'recommendation',
    title: '12 Work Anniversaries This Week',
    description: 'Engineering & Sales teams have 12 upcoming work anniversaries. AI recommends personalized gift cards worth ₹2,000-₹5,000 based on tenure.',
    priority: 'medium',
    department: 'Engineering, Sales',
    employeeCount: 12,
    actionRequired: true,
  },
  {
    id: 'INS003',
    type: 'trend',
    title: 'Marketing Team Morale Boost',
    description: 'Post Q1 campaign success — positive sentiment spike in Teams channels. Good time for recognition gifts to sustain momentum.',
    priority: 'low',
    department: 'Marketing',
    employeeCount: 56,
    actionRequired: false,
  },
  {
    id: 'INS004',
    type: 'alert',
    title: 'Oracle HCM Sync Failure',
    description: 'Oracle HCM connector has been failing for 3 hours. 0 employees synced. Check API credentials and rate limits.',
    priority: 'high',
    actionRequired: true,
  },
  {
    id: 'INS005',
    type: 'recommendation',
    title: 'Q1 Budget Surplus Opportunity',
    description: 'Finance & HR departments have significant Q1 budget remaining. AI recommends deploying ₹1.3L in Meal Vouchers before Q1 close.',
    priority: 'medium',
    department: 'Finance, HR',
    actionRequired: true,
  },
];

export const monthlySpendData = [
  { month: 'Oct', Engineering: 48000, Sales: 35000, HR: 12000, Finance: 18000, Marketing: 28000, 'Customer Success': 22000 },
  { month: 'Nov', Engineering: 52000, Sales: 41000, HR: 9000, Finance: 14000, Marketing: 31000, 'Customer Success': 25000 },
  { month: 'Dec', Engineering: 71000, Sales: 58000, HR: 18000, Finance: 21000, Marketing: 45000, 'Customer Success': 38000 },
  { month: 'Jan', Engineering: 44000, Sales: 38000, HR: 11000, Finance: 16000, Marketing: 24000, 'Customer Success': 19000 },
  { month: 'Feb', Engineering: 58000, Sales: 44000, HR: 13000, Finance: 19000, Marketing: 33000, 'Customer Success': 28000 },
  { month: 'Mar', Engineering: 62000, Sales: 51000, HR: 14000, Finance: 22000, Marketing: 38000, 'Customer Success': 32000 },
];

export const giftCategoryData = [
  { name: 'Gift Cards', value: 42, color: '#6366f1' },
  { name: 'Meal Vouchers', value: 28, color: '#8b5cf6' },
  { name: 'MF Gifts', value: 15, color: '#06b6d4' },
  { name: 'Experience Vouchers', value: 10, color: '#10b981' },
  { name: 'Wellness Credits', value: 5, color: '#f59e0b' },
];

export const recognitionTrendData = [
  { month: 'Oct', recognitions: 124, automated: 89, manual: 35 },
  { month: 'Nov', recognitions: 138, automated: 102, manual: 36 },
  { month: 'Dec', recognitions: 195, automated: 158, manual: 37 },
  { month: 'Jan', recognitions: 112, automated: 78, manual: 34 },
  { month: 'Feb', recognitions: 147, automated: 115, manual: 32 },
  { month: 'Mar', recognitions: 168, automated: 139, manual: 29 },
];

export const recentActivity = [
  { id: 1, type: 'gift_sent', message: 'Work anniversary gift sent to Priya Sharma (Engineering)', time: '2 min ago', icon: 'gift', color: 'indigo' },
  { id: 2, type: 'ai_alert', message: 'AI detected attrition risk in Customer Success team (8 employees)', time: '15 min ago', icon: 'alert', color: 'red' },
  { id: 3, type: 'sync', message: 'Workday sync completed — 1,243 employees updated', time: '18 min ago', icon: 'sync', color: 'green' },
  { id: 4, type: 'gift_sent', message: 'Birthday gift (Zomato voucher) sent to Sneha Patel', time: '1 hour ago', icon: 'gift', color: 'purple' },
  { id: 5, type: 'budget', message: 'Q1 budget alert: Marketing dept at 84% utilization', time: '2 hours ago', icon: 'budget', color: 'yellow' },
  { id: 6, type: 'ai_alert', message: 'Oracle HCM connector error — manual review required', time: '3 hours ago', icon: 'alert', color: 'red' },
  { id: 7, type: 'gift_sent', message: '5-year milestone celebration gift queued for Ananya Krishnan', time: '4 hours ago', icon: 'gift', color: 'indigo' },
];
