import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Users, 
  TrendingUp, 
  Calendar,
  Filter,
  Search,
  RefreshCw,
  LogOut,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Building,
  MessageSquare,
  Download,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
  Target,
  Sparkles,
  Eye,
  MousePointer,
  TrendingDown,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  stage?: string;
  service_interest?: string;
  source_page?: string;
  message?: string;
  status?: string;
  created_at: string;
  quiz_answers?: Record<string, string>;
  ai_assessment?: {
    stage: string;
    bottleneck: string;
    stage_description: string;
    bottleneck_description: string;
    what_to_avoid: string;
    personalized_insight: string;
    recommended_system: {
      name: string;
      description: string;
      route: string;
    };
  };
}

interface Stats {
  total: number;
  recent_7_days: number;
  by_service: Record<string, number>;
  by_stage: Record<string, number>;
  by_status: Record<string, number>;
}

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

interface ScrollStats {
  total_sessions: number;
  total_events: number;
  days: number;
  page_visitors: Array<{ page: string; total_visitors: number }>;
  section_stats: Array<{
    page: string;
    section: string;
    section_index: number;
    total_sections: number;
    reach_count: number;
  }>;
}

const statusColors: Record<string, string> = {
  'New': 'bg-blue-500/20 text-blue-400',
  'Contacted': 'bg-yellow-500/20 text-yellow-400',
  'Qualified': 'bg-purple-500/20 text-purple-400',
  'Converted': 'bg-green-500/20 text-green-400',
  'Lost': 'bg-red-500/20 text-red-400',
};

const statusIcons: Record<string, React.ElementType> = {
  'New': Clock,
  'Contacted': Phone,
  'Qualified': Target,
  'Converted': CheckCircle,
  'Lost': XCircle,
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'analytics'>('leads');

  // Check session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_auth');
    if (savedAuth) {
      setIsAuthenticated(true);
      setPassword(savedAuth);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, serviceFilter, stageFilter, statusFilter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_auth', password);
      } else {
        setAuthError('Invalid password');
      }
    } catch {
      setAuthError('Connection error');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('admin_auth');
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (serviceFilter !== 'all') params.append('service', serviceFilter);
      if (stageFilter !== 'all') params.append('stage', stageFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const [leadsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/leads?${params}`, {
          headers: { 'X-Admin-Password': password }
        }),
        fetch(`${API_URL}/api/leads/stats`, {
          headers: { 'X-Admin-Password': password }
        })
      ]);

      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Password': password 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        ));
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Service Interest', 'Stage', 'Status', 'Source', 'Message', 'Date'];
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      lead.phone || '',
      lead.company || '',
      lead.service_interest || '',
      lead.stage || '',
      lead.status || 'New',
      lead.source_page || '',
      lead.message?.replace(/,/g, ';') || '',
      formatDate(lead.created_at)
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `founderplane-leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      (lead.company?.toLowerCase().includes(term)) ||
      (lead.message?.toLowerCase().includes(term))
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h1>
          <p className="text-slate-400 text-center mb-6">Enter password to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-slate-800 border-slate-700 text-white"
              data-testid="admin-password-input"
            />
            {authError && <p className="text-red-400 text-sm text-center">{authError}</p>}
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              data-testid="admin-login-btn"
            >
              Login
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Calculate pipeline stats
  const pipelineStats = LEAD_STATUSES.map(status => ({
    status,
    count: leads.filter(l => (l.status || 'New') === status).length
  }));

  const conversionRate = leads.length > 0 
    ? Math.round((leads.filter(l => l.status === 'Converted').length / leads.length) * 100) 
    : 0;

  // Dashboard
  return (
    <div className="min-h-screen bg-slate-950" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FounderPlane Admin</h1>
              <p className="text-sm text-slate-400">Lead Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Tab Switcher */}
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'leads' 
                    ? 'bg-primary text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
                data-testid="tab-leads"
              >
                <Users className="w-4 h-4 inline mr-2" />
                Leads
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'analytics' 
                    ? 'bg-primary text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
                data-testid="tab-analytics"
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Analytics
              </button>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-slate-400 hover:text-white"
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'analytics' ? (
          // Analytics Tab
          <div className="space-y-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-400 text-sm">Total Leads</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats?.total || 0}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-slate-400 text-sm">Last 7 Days</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats?.recent_7_days || 0}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-400 text-sm">Conversion Rate</span>
                </div>
                <p className="text-3xl font-bold text-white">{conversionRate}%</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-orange-400" />
                  <span className="text-slate-400 text-sm">Active Pipeline</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {leads.filter(l => !['Converted', 'Lost'].includes(l.status || '')).length}
                </p>
              </motion.div>
            </div>

            {/* Pipeline Funnel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Lead Pipeline
              </h3>
              <div className="flex items-end justify-between gap-4 h-48">
                {pipelineStats.map((item, index) => {
                  const maxCount = Math.max(...pipelineStats.map(p => p.count), 1);
                  const height = (item.count / maxCount) * 100;
                  const StatusIcon = statusIcons[item.status];
                  return (
                    <div key={item.status} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(height, 10)}%` }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className={`w-full rounded-t-lg ${statusColors[item.status].replace('text-', 'bg-').split(' ')[0]}`}
                        style={{ minHeight: '20px' }}
                      />
                      <div className="mt-3 text-center">
                        <StatusIcon className={`w-4 h-4 mx-auto mb-1 ${statusColors[item.status].split(' ')[1]}`} />
                        <p className="text-xs text-slate-400">{item.status}</p>
                        <p className="text-lg font-bold text-white">{item.count}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Service & Stage Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">By Service Interest</h3>
                <div className="space-y-3">
                  {Object.entries(stats?.by_service || {}).sort((a, b) => b[1] - a[1]).map(([service, count]) => (
                    <div key={service} className="flex items-center justify-between">
                      <span className="text-slate-300">{service || 'Unknown'}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-slate-800 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(count / (stats?.total || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-white font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">By Founder Stage</h3>
                <div className="space-y-3">
                  {Object.entries(stats?.by_stage || {}).sort((a, b) => b[1] - a[1]).map(([stage, count]) => (
                    <div key={stage} className="flex items-center justify-between">
                      <span className="text-slate-300">{stage || 'Unknown'}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-slate-800 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              stage === 'Launch' ? 'bg-blue-500' :
                              stage === 'Growth' ? 'bg-green-500' :
                              'bg-purple-500'
                            }`}
                            style={{ width: `${(count / (stats?.total || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-white font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          // Leads Tab
          <>
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-400 text-sm">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </motion.div>

                {LEAD_STATUSES.slice(0, 4).map((status, i) => {
                  const StatusIcon = statusIcons[status];
                  const count = pipelineStats.find(p => p.status === status)?.count || 0;
                  return (
                    <motion.div
                      key={status}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (i + 1) }}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className={`w-5 h-5 ${statusColors[status].split(' ')[1]}`} />
                        <span className="text-slate-400 text-sm">{status}</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{count}</p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search leads..."
                  className="pl-10 bg-slate-900 border-slate-700 text-white"
                  data-testid="lead-search-input"
                />
              </div>
              
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-[160px] bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="BoltGuider">BoltGuider</SelectItem>
                  <SelectItem value="BrandToFly">BrandToFly</SelectItem>
                  <SelectItem value="D2CBolt">D2CBolt</SelectItem>
                  <SelectItem value="BoltRunway">BoltRunway</SelectItem>
                  <SelectItem value="ScaleRunway">ScaleRunway</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-[140px] bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="Launch">Launch</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Scale">Scale</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="all">All Status</SelectItem>
                  {LEAD_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={fetchData}
                disabled={isLoading}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                data-testid="refresh-leads-btn"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button 
                variant="outline" 
                onClick={exportToCSV}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                data-testid="export-csv-btn"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Leads Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Lead</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Contact</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Interest</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Stage</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Date</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                          {isLoading ? 'Loading...' : 'No leads found'}
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <React.Fragment key={lead.id}>
                          <tr 
                            className="hover:bg-slate-800/30 cursor-pointer"
                            onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                            data-testid={`lead-row-${lead.id}`}
                          >
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-white font-medium">{lead.name}</p>
                                {lead.company && (
                                  <p className="text-slate-400 text-sm flex items-center gap-1">
                                    <Building className="w-3 h-3" />
                                    {lead.company}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-slate-300 text-sm flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {lead.email}
                              </p>
                              {lead.phone && (
                                <p className="text-slate-400 text-sm flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {lead.phone}
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                                {lead.service_interest || 'General'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {lead.stage && (
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                  lead.stage === 'Launch' ? 'bg-blue-500/20 text-blue-400' :
                                  lead.stage === 'Growth' ? 'bg-green-500/20 text-green-400' :
                                  'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {lead.stage}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <Select 
                                value={lead.status || 'New'} 
                                onValueChange={(value) => {
                                  updateLeadStatus(lead.id, value);
                                }}
                              >
                                <SelectTrigger 
                                  className={`w-[120px] h-8 text-xs border-0 ${statusColors[lead.status || 'New']}`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                  {LEAD_STATUSES.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-sm">
                              {formatDate(lead.created_at)}
                            </td>
                            <td className="px-6 py-4">
                              {expandedLead === lead.id ? (
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </td>
                          </tr>
                          <AnimatePresence>
                            {expandedLead === lead.id && (
                              <motion.tr
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-slate-800/20"
                              >
                                <td colSpan={7} className="px-6 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Message & Source */}
                                    <div>
                                      {lead.message && (
                                        <div className="mb-4">
                                          <div className="flex items-start gap-2">
                                            <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
                                            <div>
                                              <p className="text-slate-400 text-sm mb-1">Message:</p>
                                              <p className="text-slate-300">{lead.message}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      <p className="text-slate-500 text-xs">
                                        Source: {lead.source_page || 'Unknown'}
                                      </p>
                                    </div>

                                    {/* Quiz Answers & AI Assessment */}
                                    {lead.ai_assessment && (
                                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                        <div className="flex items-center gap-2 mb-3">
                                          <Sparkles className="w-4 h-4 text-blue-400" />
                                          <p className="text-sm font-medium text-blue-400">AI Assessment</p>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                          <p><span className="text-slate-400">Stage:</span> <span className="text-white">{lead.ai_assessment.stage}</span></p>
                                          <p><span className="text-slate-400">Bottleneck:</span> <span className="text-white">{lead.ai_assessment.bottleneck}</span></p>
                                          <p><span className="text-slate-400">Recommended:</span> <span className="text-primary">{lead.ai_assessment.recommended_system?.name}</span></p>
                                          {lead.ai_assessment.personalized_insight && (
                                            <div className="mt-3 pt-3 border-t border-slate-700">
                                              <p className="text-slate-400 text-xs mb-1">Personalized Insight:</p>
                                              <p className="text-slate-300 text-xs italic">{lead.ai_assessment.personalized_insight}</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Quiz Answers if available */}
                                    {lead.quiz_answers && Object.keys(lead.quiz_answers).length > 0 && (
                                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 md:col-span-2">
                                        <p className="text-sm font-medium text-slate-400 mb-3">Quiz Responses:</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                          {Object.entries(lead.quiz_answers).map(([key, value]) => (
                                            <div key={key}>
                                              <p className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}</p>
                                              <p className="text-slate-300 capitalize">{String(value).replace(/_/g, ' ')}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
