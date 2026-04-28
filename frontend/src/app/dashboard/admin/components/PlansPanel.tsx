'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

interface Plan {
  id: number;
  name: string;
  roi_percentage: string;
  duration_days: number;
  minimum_amount: string;
}

interface PlansPanelProps {
  onStatsUpdate: () => void;
}

export default function PlansPanel({ onStatsUpdate }: PlansPanelProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    roi_percentage: '',
    duration_days: '',
    minimum_amount: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/api/dashboard/admin/plans/');
      setPlans(res.data);
    } catch (err) {
      toast.error('Failed to load plans');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await api.patch(`/api/dashboard/admin/plans/${editingPlan.id}/`, formData);
        toast.success('Plan updated successfully');
      } else {
        await api.post('/api/dashboard/admin/plans/', formData);
        toast.success('Plan created successfully');
      }
      setShowModal(false);
      setEditingPlan(null);
      setFormData({ name: '', roi_percentage: '', duration_days: '', minimum_amount: '' });
      fetchPlans();
    } catch (err) {
      toast.error(editingPlan ? 'Failed to update plan' : 'Failed to create plan');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await api.delete(`/api/dashboard/admin/plans/${id}/`);
      toast.success('Plan deleted successfully');
      fetchPlans();
    } catch (err) {
      toast.error('Failed to delete plan');
    }
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      roi_percentage: plan.roi_percentage,
      duration_days: plan.duration_days.toString(),
      minimum_amount: plan.minimum_amount,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({ name: '', roi_percentage: '', duration_days: '', minimum_amount: '' });
    setShowModal(true);
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-[var(--bg-card)] rounded-2xl"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-[var(--text-muted)]">{plans.length} investment plans</span>
        <button onClick={openCreateModal} className="btn-primary flex items-center space-x-2">
          <Plus size={16} />
          <span>Create Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="glass-card p-6 relative group">
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => openEditModal(plan)}
                className="p-2 hover:bg-[var(--bg-input)] rounded-lg transition-colors"
              >
                <Edit2 size={14} className="text-[var(--text-muted)]" />
              </button>
              <button 
                onClick={() => handleDelete(plan.id)}
                className="p-2 hover:bg-[var(--color-danger)]/10 rounded-lg transition-colors"
              >
                <Trash2 size={14} className="text-[var(--color-danger)]" />
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-heading font-bold">{plan.name}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[var(--text-muted)]">
                  <TrendingUp size={14} />
                  <span className="text-sm">Daily ROI</span>
                </div>
                <span className="font-mono font-bold text-[var(--color-success)]">{plan.roi_percentage}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[var(--text-muted)]">
                  <Calendar size={14} />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="font-medium">{plan.duration_days} days</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[var(--text-muted)]">
                  <DollarSign size={14} />
                  <span className="text-sm">Min Amount</span>
                </div>
                <span className="font-mono font-medium">{plan.minimum_amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="glass-card--flat border border-[var(--border-glass)] rounded-2xl p-12 text-center">
          <TrendingUp size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
          <p className="text-[var(--text-secondary)]">No investment plans yet</p>
          <button onClick={openCreateModal} className="btn-primary mt-4">
            Create Your First Plan
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 rounded-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-heading font-bold mb-6">
              {editingPlan ? 'Edit Plan' : 'Create Investment Plan'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-glass)] rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="e.g., Starter Plan"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Daily ROI (%)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.roi_percentage}
                  onChange={(e) => setFormData({ ...formData, roi_percentage: e.target.value })}
                  className="w-full px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-glass)] rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="e.g., 2.5"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Duration (days)</label>
                <input
                  type="number"
                  required
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                  className="w-full px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-glass)] rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="e.g., 30"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Minimum Amount</label>
                <input
                  type="text"
                  required
                  value={formData.minimum_amount}
                  onChange={(e) => setFormData({ ...formData, minimum_amount: e.target.value })}
                  className="w-full px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-glass)] rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="e.g., 0.01"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingPlan ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}