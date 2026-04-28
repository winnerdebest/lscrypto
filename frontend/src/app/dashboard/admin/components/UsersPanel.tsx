'use client';

import { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

interface User {
  id: number;
  username: string;
  email: string;
  kyc_status: string;
  date_joined: string;
  is_active: boolean;
  is_staff: boolean;
}

interface UsersPanelProps {
  onStatsUpdate: () => void;
}

export default function UsersPanel({ onStatsUpdate }: UsersPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/dashboard/admin/users/');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const updateKycStatus = async (userId: number, status: string) => {
    try {
      await api.patch(`/api/dashboard/admin/users/${userId}/kyc/`, { kyc_status: status });
      toast.success('KYC status updated');
      fetchUsers();
      onStatsUpdate();
    } catch (err) {
      toast.error('Failed to update KYC status');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const getKycBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30';
      case 'pending':
        return 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/30';
      default:
        return 'bg-[var(--bg-input)] text-[var(--text-muted)] border-[var(--border-glass)]';
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-[var(--bg-card)] rounded-2xl"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
        <input
          type="text"
          placeholder="Search users by email or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-glass)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
        />
      </div>

      <div className="glass-card--flat border border-[var(--border-glass)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-input)]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">KYC</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-glass)]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] font-bold text-sm">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        {user.is_staff && <span className="text-xs text-[var(--accent-secondary)]">Admin</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)]">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getKycBadge(user.kyc_status)}`}>
                      {user.kyc_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.is_active 
                        ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30'
                        : 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/30'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-2 hover:bg-[var(--bg-input)] rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} className="text-[var(--text-muted)]" />
                      </button>
                      {user.kyc_status !== 'verified' && (
                        <button 
                          onClick={() => updateKycStatus(user.id, 'verified')}
                          className="p-2 hover:bg-[var(--color-success)]/10 rounded-lg transition-colors"
                          title="Verify KYC"
                        >
                          <CheckCircle size={16} className="text-[var(--color-success)]" />
                        </button>
                      )}
                      {user.kyc_status === 'pending' && (
                        <button 
                          onClick={() => updateKycStatus(user.id, 'unverified')}
                          className="p-2 hover:bg-[var(--color-danger)]/10 rounded-lg transition-colors"
                          title="Reject KYC"
                        >
                          <XCircle size={16} className="text-[var(--color-danger)]" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedUser(null)}>
          <div className="glass-card p-6 rounded-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-heading font-bold mb-4">User Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Username</span>
                <span className="font-medium">{selectedUser.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Email</span>
                <span className="font-medium">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">KYC Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getKycBadge(selectedUser.kyc_status)}`}>
                  {selectedUser.kyc_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Joined</span>
                <span className="font-medium">{new Date(selectedUser.date_joined).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Role</span>
                <span className="font-medium">{selectedUser.is_staff ? 'Admin' : 'User'}</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedUser(null)}
              className="w-full mt-6 btn-ghost"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}