"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Clock, 
  Check, 
  X, 
  Search, 
  RefreshCw,
  ExternalLink,
  User,
  DollarSign
} from 'lucide-react';
import AdminTopbar from '../components/AdminTopbar';
import { getAdminDeposits, updateDepositStatus } from '@/app/actions/deposits';
import ConfirmModal from '../components/ConfirmModal';
import AdminToast from '../components/AdminToast';

interface DepositRequest {
  id: string;
  user_id: string;
  coin_symbol: string;
  amount_usd: number;
  status: 'pending' | 'approved' | 'declined';
  network: string;
  deposit_address: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // New UI states
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    depositId: string | null;
    status: 'approved' | 'declined' | null;
  }>({
    isOpen: false,
    depositId: null,
    status: null
  });

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const data = await getAdminDeposits();
      setDeposits(data as any);
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        message: 'Failed to fetch deposits',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const openConfirmModal = (id: string, status: 'approved' | 'declined') => {
    setConfirmModal({
      isOpen: true,
      depositId: id,
      status
    });
  };

  const handleConfirmAction = async () => {
    const { depositId, status } = confirmModal;
    if (!depositId || !status) return;

    setConfirmModal(prev => ({ ...prev, isOpen: false }));
    setProcessingId(depositId);
    
    const result = await updateDepositStatus(depositId, status);
    
    if (result.success) {
      setDeposits(prev => prev.map(d => d.id === depositId ? { ...d, status } : d));
      setToast({
        show: true,
        message: `Deposit successfully ${status}`,
        type: 'success'
      });
    } else {
      setToast({
        show: true,
        message: result.error || 'Failed to update status',
        type: 'error'
      });
    }
    setProcessingId(null);
  };

  const filteredDeposits = deposits.filter(d => {
    const matchesSearch = d.profiles.full_name?.toLowerCase().includes(search.toLowerCase()) || 
                         d.profiles.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AdminTopbar title="Deposit Requests" />
      
      <div className="mt-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'pending', 'approved', 'declined'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-dash-accent/10 text-dash-accent border border-dash-accent/20'
                    : 'bg-white/5 text-text-muted hover:text-white border border-white/5'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group flex-1 sm:min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-dash-accent transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0C101A] border border-white/[0.08] rounded-xl py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-dash-accent/30 transition-all"
              />
            </div>
            <button 
              onClick={fetchDeposits}
              className="p-3 bg-white/5 border border-white/10 rounded-xl text-text-muted hover:text-white transition-all"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0C101A] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-white/[0.06]">User</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-white/[0.06] hidden sm:table-cell">Asset</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-white/[0.06]">Amount (USD)</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-white/[0.06] hidden md:table-cell">Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-white/[0.06]">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-white/[0.06]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-10 text-center">
                        <div className="h-4 bg-white/5 rounded w-full mx-auto" />
                      </td>
                    </tr>
                  ))
                ) : filteredDeposits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-text-muted">
                      No deposit requests found.
                    </td>
                  </tr>
                ) : (
                  filteredDeposits.map((d) => (
                    <tr key={d.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-text-muted border border-white/10">
                            <User size={18} />
                          </div>
                          <div className="max-w-[120px] sm:max-w-none">
                            <p className="font-bold text-sm text-white leading-none mb-1 truncate">{d.profiles.full_name || 'Unnamed'}</p>
                            <p className="text-[10px] text-text-muted truncate">{d.profiles.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden sm:table-cell">
                        <div>
                          <p className="font-bold text-sm text-white leading-none mb-1">{d.coin_symbol}</p>
                          <p className="text-[10px] text-text-muted font-bold tracking-wider">{d.network}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono">
                        <span className="text-dash-accent font-bold">${d.amount_usd.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-text-muted">
                          <Clock size={14} />
                          <span className="text-xs">{new Date(d.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                          d.status === 'approved' ? 'bg-dash-accent/10 text-dash-accent border border-dash-accent/20' :
                          d.status === 'declined' ? 'bg-dash-error/10 text-dash-error border border-dash-error/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                        <td className="px-6 py-5 text-right">
                          {d.status === 'pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openConfirmModal(d.id, 'declined')}
                                disabled={processingId === d.id}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-dash-error/10 text-dash-error hover:bg-dash-error hover:text-[#0A0D14] transition-all disabled:opacity-50"
                              >
                                <X size={16} />
                              </button>
                              <button
                                onClick={() => openConfirmModal(d.id, 'approved')}
                                disabled={processingId === d.id}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-dash-accent/10 text-dash-accent hover:bg-dash-accent hover:text-[#0A0D14] transition-all disabled:opacity-50"
                              >
                                {processingId === d.id ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={`${confirmModal.status === 'approved' ? 'Approve' : 'Decline'} Deposit`}
        message={`Are you sure you want to ${confirmModal.status === 'approved' ? 'approve' : 'decline'} this deposit? This action will ${confirmModal.status === 'approved' ? 'credit the user wallet' : 'cancel this request'}.`}
        variant={confirmModal.status === 'approved' ? 'success' : 'danger'}
        confirmText={confirmModal.status === 'approved' ? 'Approve' : 'Decline'}
      />

      <AdminToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}
