import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Lead } from '../../types';
import { User, Mail, Info, Target, Save, X } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

export type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: LeadFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, onCancel, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      status: initialData.status,
      source: initialData.source,
    } : {
      status: 'New',
      source: 'Website',
    },
  });

  const inputClasses = "w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium sm:text-sm";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-foreground/80">Full Name</label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <input
              {...register('name')}
              placeholder="Lead's name"
              className={inputClasses}
            />
          </div>
          {errors.name && <p className="ml-1 text-xs font-bold text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-foreground/80">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <input
              {...register('email')}
              type="email"
              placeholder="lead@company.com"
              className={inputClasses}
            />
          </div>
          {errors.email && <p className="ml-1 text-xs font-bold text-destructive">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-foreground/80">Current Status</label>
            <div className="relative group">
              <Info className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <select {...register('status')} className={`${inputClasses} appearance-none`}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-foreground/80">Lead Source</label>
            <div className="relative group">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <select {...register('source')} className={`${inputClasses} appearance-none`}>
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border/50">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-accent transition-all font-bold text-sm active:scale-95"
        >
          <X size={18} />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all font-bold text-sm active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={18} />
              {initialData ? 'Update Lead' : 'Create Lead'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
