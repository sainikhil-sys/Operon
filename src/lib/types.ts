export interface Profile {
  id: string;
  full_name: string;
  email: string;
  business_name: string;
  business_type: string;
  phone?: string;
  avatar_url?: string;
  role?: string;
  created_at: string;
}

export interface Organization {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  plan: string;
  created_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
  value: number;
  notes?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  revenue_generated: number;
  health_score?: number;
  notes?: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  repository_url?: string;
  status: string;
  created_at: string;
}

export interface Deployment {
  id: string;
  project_id: string;
  user_id: string;
  environment: string;
  status: string;
  commit_hash?: string;
  url?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  customer_id?: string;
  invoice_number: string;
  amount: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  due_date?: string;
  paid_at?: string;
  created_at: string;
}

export interface AiAgent {
  id: string;
  user_id: string;
  agent_key: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'executing';
  memory_count: number;
  permissions: string;
  last_reasoning?: string;
  updated_at: string;
}

export interface KnowledgeDoc {
  id: string;
  user_id: string;
  title: string;
  category: 'Policy' | 'Product' | 'Sales' | 'Engineering' | 'General';
  snippet?: string;
  content?: string;
  author: string;
  created_at: string;
}

export interface Automation {
  id: string;
  user_id: string;
  name: string;
  trigger_name: string;
  condition_text: string;
  ai_decision: string;
  execution_action: string;
  status: 'active' | 'paused';
  runs_count: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  timestamp: string;
  type: 'lead' | 'task' | 'customer' | 'system';
}
