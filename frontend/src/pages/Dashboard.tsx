import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import type { Lead, LeadsResponse } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { 
  Plus, Download, Search, ChevronLeft, ChevronRight, 
  Edit2, Trash2, Eye, Filter, Users, Target, CheckCircle2, XCircle, TrendingUp,
  ArrowUpRight, Clock, Calendar, Sparkles, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import LeadForm from '../components/leads/LeadForm';
import type { LeadFormData } from '../components/leads/LeadForm';

const Dashboard = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const debouncedSearch = useDebounce(search, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<LeadsResponse>('/leads', {
        params: { status, source, search: debouncedSearch, sort, page },
      });
      setLeads(data.leads);
      setTotal(data.total);
      setPages(data.pages);
    } catch (error) {
      toast.error('Failed to fetch leads');
      console.error('Failed to fetch leads', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [status, source, debouncedSearch, sort, page]);

  const handleCreateOrUpdate = async (formData: LeadFormData) => {
    const loadingToast = toast.loading(editingLead ? 'Updating lead...' : 'Creating lead...');
    try {
      if (editingLead) {
        await api.put(`/leads/${editingLead._id}`, formData);
        toast.success('Lead updated successfully!', { id: loadingToast });
      } else {
        await api.post('/leads', formData);
        toast.success('New lead created!', { id: loadingToast });
      }
      setIsModalOpen(false);
      setEditingLead(null);
      fetchLeads();
    } catch (error) {
      toast.error('Operation failed. Please try again.', { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      const loadingToast = toast.loading('Removing lead...');
      try {
        await api.delete(`/leads/${id}`);
        toast.success('Lead removed successfully', { id: loadingToast });
        fetchLeads();
      } catch (error) {
        toast.error('Failed to delete lead', { id: loadingToast });
      }
    }
  };

  const handleExport = async () => {
    const loadingToast = toast.loading('Preparing CSV...');
    try {
      const response = await api.get('/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started!', { id: loadingToast });
    } catch (error) {
      toast.error('Export failed', { id: loadingToast });
    }
  };

  const stats = [
    { label: 'Total Leads', value: total, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '+12% this month' },
    { label: 'Qualified', value: leads.filter(l => l.status === 'Qualified').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: 'High conversion' },
    { label: 'Pending', value: leads.filter(l => l.status === 'New').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: 'Needs action' },
    { label: 'Success Rate', value: total ? `${Math.round((leads.filter(l => l.status === 'Qualified').length / total) * 100)}%` : '0%', icon: TrendingUp, color: 'text-pink-500', bg: 'bg-pink-500/10', trend: 'Growing steady' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 mb-8 text-white shadow-2xl shadow-indigo-500/20"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-yellow-300" />
              <span className="text-sm font-bold uppercase tracking-wider text-indigo-100">Performance Overview</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">Hello, {user?.name}! 👋</h1>
            <p className="text-indigo-100 max-w-xl text-lg font-medium opacity-90">
              You have <span className="font-bold text-white underline underline-offset-4 decoration-yellow-400">{leads.filter(l => l.status === 'New').length} new leads</span> waiting for your attention. Keep up the great work!
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleExport}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border border-white/10 active:scale-95"
            >
              <Download size={20} />
              Export Data
            </button>
            <button
              onClick={() => {
                setEditingLead(null);
                setIsModalOpen(true);
              }}
              className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus size={22} strokeWidth={3} />
              Add Opportunity
            </button>
          </div>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-24 -mb-24 blur-3xl" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Stats Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group shadow-lg shadow-black/5"
              >
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} w-fit group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black mt-1 tracking-tight">{stat.value}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-full">
                    <ArrowUpRight size={12} />
                    {stat.trend}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters & Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Advanced Filters */}
            <div className="glass rounded-3xl p-6 shadow-xl shadow-black/5">
              <div className="flex flex-col xl:flex-row gap-6">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search client names, emails, or tags..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-background/50 border-2 border-border/50 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-semibold text-lg"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-background/50 border-2 border-border/50 rounded-2xl hover:border-primary/30 transition-all">
                    <Filter size={18} className="text-muted-foreground" />
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="bg-transparent border-none outline-none font-bold text-sm min-w-[120px]"
                    >
                      <option value="">All Statuses</option>
                      <option value="New">🆕 New</option>
                      <option value="Contacted">📞 Contacted</option>
                      <option value="Qualified">✅ Qualified</option>
                      <option value="Lost">❌ Lost</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-background/50 border-2 border-border/50 rounded-2xl hover:border-primary/30 transition-all">
                    <Target size={18} className="text-muted-foreground" />
                    <select
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="bg-transparent border-none outline-none font-bold text-sm min-w-[120px]"
                    >
                      <option value="">All Sources</option>
                      <option value="Website">🌐 Website</option>
                      <option value="Instagram">📸 Instagram</option>
                      <option value="Referral">🤝 Referral</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-background/50 border-2 border-border/50 rounded-2xl hover:border-primary/30 transition-all">
                    <Clock size={18} className="text-muted-foreground" />
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="bg-transparent border-none outline-none font-bold text-sm min-w-[120px]"
                    >
                      <option value="latest">Latest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="glass rounded-[2rem] overflow-hidden shadow-2xl border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-[0.2em] font-black border-b border-border/50">
                      <th className="px-8 py-6">Client Profile</th>
                      <th className="px-8 py-6">Status Tracker</th>
                      <th className="px-8 py-6">Origin</th>
                      <th className="px-8 py-6">Timestamp</th>
                      <th className="px-8 py-6 text-right">Management</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <AnimatePresence mode="popLayout">
                      {loading ? (
                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <td colSpan={5} className="py-32 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <div className="relative">
                                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <Zap className="absolute inset-0 m-auto text-primary animate-pulse" size={24} />
                              </div>
                              <span className="text-lg font-black text-muted-foreground tracking-tight">Syncing Leads...</span>
                            </div>
                          </td>
                        </motion.tr>
                      ) : leads.length === 0 ? (
                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <td colSpan={5} className="py-32 text-center">
                            <div className="flex flex-col items-center gap-6">
                              <div className="bg-muted/50 p-8 rounded-full text-muted-foreground relative">
                                <Users size={64} className="opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Search size={32} />
                                </div>
                              </div>
                              <div>
                                <p className="text-2xl font-black tracking-tight">No Leads Captured</p>
                                <p className="text-muted-foreground font-medium mt-2">Start your growth by adding new opportunities.</p>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ) : (
                        leads.map((lead, idx) => (
                          <motion.tr 
                            key={lead._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="hover:bg-primary/5 transition-all group relative cursor-default"
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
                                    {lead.name.charAt(0)}
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-black rounded-full p-1 flex items-center justify-center shadow-md">
                                    <div className={`w-full h-full rounded-full ${lead.status === 'Qualified' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                  </div>
                                </div>
                                <div>
                                  <p className="font-black text-lg leading-tight group-hover:text-primary transition-colors">{lead.name}</p>
                                  <p className="text-sm text-muted-foreground font-bold opacity-70 mt-0.5">{lead.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                                lead.status === 'Qualified' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10' :
                                lead.status === 'Lost' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                lead.status === 'Contacted' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                'bg-slate-500/10 text-slate-500 border-slate-500/20'
                              } group-hover:scale-105`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-muted/50 rounded-lg group-hover:bg-white dark:group-hover:bg-black transition-colors shadow-sm">
                                  {lead.source === 'Website' ? <Target size={16} /> : lead.source === 'Instagram' ? <Sparkles size={16} /> : <Users size={16} />}
                                </div>
                                <span className="font-bold text-sm opacity-80">{lead.source}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 font-black text-sm">
                                  <Calendar size={14} className="text-muted-foreground" />
                                  {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter ml-5">
                                  {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                <Link 
                                  to={`/leads/${lead._id}`} 
                                  className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                                  title="View Details"
                                >
                                  <Eye size={20} strokeWidth={2.5} />
                                </Link>
                                <button
                                  onClick={() => {
                                    setEditingLead(lead);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                  title="Edit Lead"
                                >
                                  <Edit2 size={20} strokeWidth={2.5} />
                                </button>
                                {user?.role === 'admin' && (
                                  <button
                                    onClick={() => handleDelete(lead._id)}
                                    className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                    title="Delete Lead"
                                  >
                                    <Trash2 size={20} strokeWidth={2.5} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              <div className="px-8 py-6 bg-muted/20 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Target size={20} />
                  </div>
                  <p className="text-sm font-bold tracking-tight">
                    Displaying <span className="text-primary">{leads.length}</span> of <span className="text-primary">{total}</span> qualified prospects
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-3 rounded-2xl border-2 border-border/50 bg-background hover:border-primary hover:text-primary disabled:opacity-30 transition-all active:scale-90 shadow-sm"
                  >
                    <ChevronLeft size={20} strokeWidth={3} />
                  </button>
                  <div className="flex items-center gap-2 px-2">
                    {[...Array(pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-12 h-12 rounded-2xl text-sm font-black transition-all border-2 ${
                          page === i + 1
                            ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30 -translate-y-1 scale-110'
                            : 'bg-background border-border/50 hover:border-primary/30 text-muted-foreground'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage(Math.min(pages, page + 1))}
                    disabled={page === pages}
                    className="p-3 rounded-2xl border-2 border-border/50 bg-background hover:border-primary hover:text-primary disabled:opacity-30 transition-all active:scale-90 shadow-sm"
                  >
                    <ChevronRight size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Quick Actions Card */}
          <div className="glass rounded-[2rem] p-6 shadow-xl border-white/20">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Zap size={22} className="text-yellow-500 fill-current" />
              Quick Insights
            </h3>
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20">
                <p className="text-xs font-black uppercase text-indigo-500 tracking-[0.1em] mb-1">Top Performer</p>
                <p className="text-lg font-black">{leads[0]?.name || 'No leads yet'}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mt-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Most active client
                </div>
              </div>
              <div className="p-5 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-2xl border border-pink-500/20">
                <p className="text-xs font-black uppercase text-pink-500 tracking-[0.1em] mb-1">Recent Origin</p>
                <p className="text-lg font-black">{leads[0]?.source || 'Scanning...'}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mt-2">
                  <ArrowUpRight size={14} className="text-pink-500" />
                  Trending source
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed Simulation */}
          <div className="glass rounded-[2rem] p-6 shadow-xl border-white/20">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Clock size={22} className="text-indigo-500" />
              Live Activity
            </h3>
            <div className="space-y-6">
              {leads.slice(0, 5).map((lead, i) => (
                <div key={i} className="flex gap-4 relative group">
                  {i !== 4 && <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-border/50 group-hover:bg-primary/30 transition-colors" />}
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 relative z-10 border-2 border-background shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black opacity-60 uppercase tracking-widest mb-0.5">
                      {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm font-bold leading-tight">
                      New lead <span className="text-primary">{lead.name}</span> added from {lead.source}
                    </p>
                  </div>
                </div>
              ))}
              {leads.length === 0 && (
                <p className="text-sm font-bold text-muted-foreground text-center py-4 italic">Watching for new activity...</p>
              )}
            </div>
            <button className="w-full mt-8 py-3 rounded-2xl bg-muted/50 hover:bg-muted text-sm font-black transition-all border border-border/50">
              View All History
            </button>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Modern Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass rounded-[2.5rem] p-8 sm:p-10 shadow-3xl border-white/20"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <Plus size={18} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Management</span>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">
                    {editingLead ? 'Update Profile' : 'New Opportunity'}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-muted rounded-2xl transition-all hover:rotate-90"
                >
                  <XCircle size={28} className="text-muted-foreground" />
                </button>
              </div>
              <LeadForm
                initialData={editingLead || undefined}
                onSubmit={handleCreateOrUpdate}
                onCancel={() => setIsModalOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
