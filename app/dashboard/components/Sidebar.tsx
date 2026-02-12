"use client";

import { useSidebar } from '../context/SidebarContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  FileText, 
  Wallet, 
  Plus, 
  ArrowRight, 
  DollarSign, 
  CheckCircle2, 
  Image as ImageIcon, 
  User, 
  ShieldCheck, 
  Lock, 
  Settings, 
  LogOut,
  X,
  Landmark
} from 'lucide-react';

const navGroups = [
  {
    title: 'TRADING',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: TrendingUp, label: 'Trade', href: '/dashboard/trade' },
      { icon: FileText, label: 'Orders', href: '/dashboard/orders' },
    ]
  },
  {
    title: 'WALLETS',
    items: [
      { icon: Wallet, label: 'My Wallets', href: '/dashboard/wallets' },
      { icon: Plus, label: 'Deposit', href: '/dashboard/deposit' },
      { icon: ArrowRight, label: 'Withdraw', href: '/dashboard/withdraw' },
    ]
  },
  {
    title: 'STAKING',
    items: [
      { icon: DollarSign, label: 'Staking Pools', href: '/dashboard/staking-pools' },
      { icon: CheckCircle2, label: 'My Stakes', href: '/dashboard/my-stakes' },
    ]
  },
  {
    title: 'NFT',
    items: [
      { icon: ImageIcon, label: 'NFT Marketplace', href: '/dashboard/nft-marketplace' },
      { icon: User, label: 'My NFTs', href: '/dashboard/my-nfts' },
    ]
  },
  {
    title: 'ACCOUNT',
    items: [
      { icon: User, label: 'Profile', href: '/dashboard/profile' },
      { icon: ShieldCheck, label: 'KYC Verification', href: '/dashboard/kyc' },
      { icon: Lock, label: 'Security', href: '/dashboard/security' },
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <aside className={`fixed left-0 top-0 bottom-0 bg-[#07090F] flex flex-col transition-all duration-500 z-[60] shadow-[20px_0_40px_rgba(0,0,0,0.3)] w-[280px] lg:w-[var(--sidebar-width)]
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Logo Section */}
      <div className="px-7 py-9 flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
            <div className="relative w-11 h-11 flex items-center justify-center bg-dash-accent/10 rounded-2xl shadow-inner border border-dash-accent/10">
                <ShieldCheck className="text-dash-accent" size={26} />
            </div>
            <div className="flex items-center transform translate-y-0.5">
                <span className="font-pacifico text-[22px] text-dash-accent">Aura</span>
                <span className="font-outfit text-[22px] font-bold text-white -ml-0.5">Trade</span>
            </div>
        </div>
        <button 
            onClick={close}
            className="lg:hidden text-text-muted hover:text-white p-2.5 bg-white/5 rounded-xl border border-white/5 transition-all"
        >
            <X size={20} />
        </button>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 w-full px-4 overflow-y-auto custom-scrollbar space-y-8 pb-8">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <h4 className="px-4 text-[10px] font-space font-bold text-text-muted/50 tracking-[2px] uppercase">
              {group.title}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                        if (window.innerWidth < 1024) close();
                    }}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative ${
                      isActive 
                        ? 'bg-dash-accent text-bg-primary font-bold shadow-lg shadow-dash-accent/20' 
                        : 'text-text-secondary hover:bg-white/[0.03] hover:text-white'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-bg-primary' : 'group-hover:text-dash-accent transition-colors'} />
                    <span className="font-outfit text-[14px]">{item.label}</span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="active-pill"
                        className="absolute left-0 w-1 h-5 bg-dash-accent rounded-r-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout - Fixed */}
      <div className="w-full px-4 py-6 border-t border-dash-border">
        <button 
          className="flex items-center gap-4 px-4 py-3 rounded-xl w-full text-dash-error hover:bg-dash-error/5 transition-all group"
          onClick={() => {/* Implement Logout */}}
        >
          <LogOut size={18} />
          <span className="font-outfit text-[14px] font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}
