import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import type { Lead } from '../types';
import { 
  ArrowLeft, User, Mail, Calendar, Info, 
  Clock, Shield, Activity, Share2, MoreHorizontal,
  ExternalLink, MessageSquare, Phone, Briefcase, CheckCircle2, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const { data } = await api.get(`/leads/${id}`);
        setLead(data);
      } catch (error) {
        console.error('Failed to fetch lead', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-lg font-black text-muted-foreground animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-8"
    >
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          <div className="p-2 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Back to Pipeline
        </Link>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-2xl bg-muted hover:bg-muted/80 transition-all active:scale-90">
            <Share2 size={20} />
          </button>
          <button className="p-3 rounded-2xl bg-muted hover:bg-muted/80 transition-all active:scale-90">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Overview */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-8"
        >
          <div className="glass rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-purple-600/20" />
            
            <div className="relative mt-4 mb-6">
              <div className="w-32 h-32 mx-auto rounded-[2.5rem] bg-gradient-to-br from-primary to-purple-600 p-1 shadow-2xl">
                <div className="w-full h-full rounded-[2.3rem] bg-background flex items-center justify-center">
                  <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary to-purple-600">
                    {lead.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 right-1/2 translate-x-12 translate-y-2 w-8 h-8 rounded-2xl bg-emerald-500 border-4 border-background flex items-center justify-center">
                <CheckCircle2 size={16} className="text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-black tracking-tight">{lead.name}</h2>
            <p className="text-muted-foreground font-bold text-sm mb-6">{lead.email}</p>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 ${
                lead.status === 'Qualified' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                lead.status === 'Lost' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
              }`}>
                {lead.status}
              </span>
              <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-muted text-muted-foreground border-2 border-border/50">
                {lead.source}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-border/50 pt-8">
              <button className="flex flex-col items-center gap-2 group">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <Phone size={20} />
                </div>
                <span className="text-[10px] font-black uppercase opacity-60">Call</span>
              </button>
              <button className="flex flex-col items-center gap-2 group">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                  <MessageSquare size={20} />
                </div>
                <span className="text-[10px] font-black uppercase opacity-60">Email</span>
              </button>
              <button className="flex flex-col items-center gap-2 group">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <ExternalLink size={20} />
                </div>
                <span className="text-[10px] font-black uppercase opacity-60">Visit</span>
              </button>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-6 shadow-xl border-white/20">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              Lead Quality
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                  <span>Engagement Score</span>
                  <span className="text-primary">85%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    className="h-full bg-gradient-to-r from-primary to-purple-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                  <span>Probability</span>
                  <span className="text-emerald-500">High</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Detailed Info & Timeline */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="glass rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border-white/20">
            <h3 className="text-2xl font-black mb-8 tracking-tight">Lead Insights</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                  <User size={22} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">Full Identity</p>
                  <p className="text-lg font-bold">{lead.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">Direct Contact</p>
                  <p className="text-lg font-bold">{lead.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Briefcase size={22} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">Source Origin</p>
                  <p className="text-lg font-bold">{lead.source}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-pink-500/10 text-pink-500">
                  <Shield size={22} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">Assigned Representative</p>
                  <p className="text-lg font-bold">{lead.createdBy.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                  <Calendar size={22} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">Discovery Date</p>
                  <p className="text-lg font-bold">{new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-slate-500/10 text-slate-500">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">Last Update</p>
                  <p className="text-lg font-bold">{new Date(lead.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border-white/20 relative overflow-hidden">
            <h3 className="text-2xl font-black mb-10 tracking-tight flex items-center gap-3">
              <Clock size={24} className="text-primary" />
              Interaction Timeline
            </h3>
            
            <div className="space-y-12 relative">
              <div className="absolute left-[27px] top-2 bottom-2 w-1 bg-gradient-to-b from-primary/50 via-border to-transparent rounded-full" />
              
              <div className="flex gap-8 relative group">
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 z-10 shadow-lg shadow-primary/20 ring-8 ring-background">
                  <Plus size={24} strokeWidth={3} />
                </div>
                <div className="pt-2">
                  <p className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-1">Lead Created</p>
                  <p className="text-xl font-black tracking-tight">Record initialized by {lead.createdBy.name}</p>
                  <p className="text-sm text-muted-foreground font-bold mt-2 opacity-80">
                    The opportunity was captured via <span className="text-foreground">{lead.source}</span> and entered into the qualification pipeline.
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-xs font-black text-muted-foreground">
                    <Calendar size={14} />
                    {new Date(lead.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-8 relative group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 z-10 shadow-sm ring-8 ring-background">
                  <Info size={24} strokeWidth={3} />
                </div>
                <div className="pt-2">
                  <p className="text-sm font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Status Update</p>
                  <p className="text-xl font-black tracking-tight">Shifted to {lead.status}</p>
                  <p className="text-sm text-muted-foreground font-bold mt-2 opacity-80">
                    Lead progression monitored and status updated to reflect current engagement level.
                  </p>
                </div>
              </div>

              <div className="flex gap-8 relative group opacity-40 grayscale">
                <div className="w-14 h-14 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center shrink-0 z-10 shadow-sm ring-8 ring-background">
                  <Shield size={24} strokeWidth={3} />
                </div>
                <div className="pt-2">
                  <p className="text-sm font-black uppercase tracking-[0.2em] mb-1">Next Step</p>
                  <p className="text-xl font-black tracking-tight">Waiting for further action...</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeadDetails;
