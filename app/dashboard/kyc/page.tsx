"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  X,
  AlertCircle,
  Building,
  Calendar,
  MapPin,
  Lock,
  Clock,
  ShieldAlert,
  ShieldX
} from 'lucide-react';
import Image from 'next/image';
import { useUser } from '../context/UserContext';
import { useLoading } from '../context/LoadingContext';
import { useNotification } from '../context/NotificationContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Step = 1 | 2 | 3;

export default function KYCPage() {
    const { user, refreshUser } = useUser();
    const { setIsLoading } = useLoading();
    const { addNotification } = useNotification();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [existingSubmission, setExistingSubmission] = useState<any>(null);
    const [isChecking, setIsChecking] = useState(true);
    
    // Form State
    const [formData, setFormData] = useState({
        fullName: user?.user_metadata?.full_name || '',
        dob: '',
        address: '',
        idType: 'passport',
        idNumber: ''
    });

    const [files, setFiles] = useState<{
        front: File | null;
        back: File | null;
    }>({ front: null, back: null });

    const [filesPreview, setFilesPreview] = useState<{
        front: string | null;
        back: string | null;
    }>({ front: null, back: null });

    const [isSubmitted, setIsSubmitted] = useState(false);

    // Refs
    const frontInputRef = useRef<HTMLInputElement>(null);
    const backInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchSubmission = async () => {
            if (!user?.id) return;
            try {
                const { data, error } = await supabase
                    .from('kyc_submissions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (data) {
                    setExistingSubmission(data);
                }
            } catch (err) {
                console.error("Error fetching KYC status:", err);
            } finally {
                setIsChecking(false);
            }
        };

        fetchSubmission();
    }, [user]);

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as Step);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as Step);
    };

    const handleFileChange = (type: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFiles(prev => ({ ...prev, [type]: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
            setFilesPreview(prev => ({ ...prev, [type]: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        addNotification(message, type);
    };

    const handleSubmit = async () => {
        if (!user) return;
        
        try {
            setIsLoading(true, "Submitting verification documents...");
            
            // 1. Upload Documents to PRIVATE Bucket
            const uploadFile = async (file: File, suffix: string) => {
                const fileExt = file.name.split('.').pop();
                const filePath = `${user.id}/${suffix}-${Date.now()}.${fileExt}`;
                const { error: uploadError, data } = await supabase.storage
                    .from('kyc-documents')
                    .upload(filePath, file);
                
                if (uploadError) throw uploadError;
                return filePath;
            };

            const frontPath = files.front ? await uploadFile(files.front, 'front') : null;
            const backPath = files.back ? await uploadFile(files.back, 'back') : null;

            if (!frontPath) {
                showNotification("Document front is required", "error");
                return;
            }

            // 2. Create Submission Record
            const { data: newSubmission, error: dbError } = await supabase
                .from('kyc_submissions')
                .insert({
                    user_id: user.id,
                    full_name: formData.fullName,
                    date_of_birth: formData.dob,
                    address: formData.address,
                    id_type: formData.idType,
                    id_number: formData.idNumber,
                    document_front_url: frontPath,
                    document_back_url: backPath,
                    status: 'pending'
                })
                .select()
                .single();

            if (dbError) throw dbError;

            // 3. Update User Metadata
            await supabase.auth.updateUser({
                data: { kyc_status: 'Pending' }
            });

            await refreshUser();
            setExistingSubmission(newSubmission);
            setIsSubmitted(true);
            showNotification("Verification documents submitted successfully!", "success");

        } catch (error: any) {
            console.error("KYC Submission error:", error);
            showNotification(error.message || "Something went wrong during submission.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { id: 1, title: 'Personal Information', desc: 'Verify your basic identity details', icon: UserIcon },
        { id: 2, title: 'ID Verification', desc: 'Upload your official identity documents', icon: FileText },
        { id: 3, title: 'Final Review', desc: 'Confirm your details before submission', icon: ShieldCheck },
    ];

    if (isChecking) {
        return (
            <div className="max-w-4xl mx-auto min-h-[50vh] flex items-center justify-center font-outfit">
                <div className="w-12 h-12 border-4 border-dash-accent/20 border-t-dash-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (existingSubmission || isSubmitted) {
        const status = existingSubmission?.status || 'pending';
        
        const configs = {
            pending: {
                icon: Clock,
                color: 'text-amber-500',
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/20',
                title: 'Verification In Progress',
                desc: 'Your documents have been successfully submitted and are currently being reviewed by our security team. This process usually takes 24-48 hours.'
            },
            approved: {
                icon: ShieldCheck,
                color: 'text-dash-accent',
                bg: 'bg-dash-accent/10',
                border: 'border-dash-accent/20',
                title: 'Account Verified',
                desc: 'Congratulations! Your identity has been verified. You now have full access to all platform features and higher transaction limits.'
            },
            rejected: {
                icon: ShieldX,
                color: 'text-red-500',
                bg: 'bg-red-500/10',
                border: 'border-red-500/20',
                title: 'Verification Rejected',
                desc: existingSubmission?.rejection_reason || 'Your verification was unsuccessful. Please contact support to understand the reason and how to proceed.'
            }
        };

        const statusConfig = configs[status as 'pending' | 'approved' | 'rejected'] || configs.pending;

        return (
            <div className="max-w-4xl mx-auto min-h-[70vh] flex flex-col items-center justify-center font-outfit px-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`bg-[#0C101A] border ${statusConfig.border} p-12 rounded-[40px] text-center shadow-2xl relative overflow-hidden w-full max-w-xl`}
                >
                    <div className={`absolute top-0 left-0 w-full h-1 ${statusConfig.color.replace('text', 'bg')}`} />
                    <div className={`w-24 h-24 ${statusConfig.bg} rounded-full flex items-center justify-center mx-auto mb-8`}>
                        <statusConfig.icon className={statusConfig.color} size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">{statusConfig.title}</h2>
                    <p className="text-text-muted mb-8 leading-relaxed">
                        {statusConfig.desc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/dashboard/profile" className="w-full">
                            <button className="w-full px-8 py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all">
                                View Profile
                            </button>
                        </Link>
                        <button className="w-full px-8 py-4 bg-dash-accent text-bg-primary rounded-2xl font-bold hover:bg-white transition-all shadow-lg shadow-dash-accent/10">
                            Contact Support
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-2 text-white/20">
                         <ShieldCheck size={14} />
                         <span className="text-[10px] uppercase font-bold tracking-widest">Secure Verification System</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20 font-outfit px-2 sm:px-6 relative">
            {/* Toast Notification handled by global context */}

            <div className="mb-12">
                <h1 className="text-3xl font-bold text-white mb-2">KYC Verification</h1>
                <p className="text-text-muted font-medium">Verify your identity and unlock full account features</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Left Sidebar Stepper */}
                <div className="lg:col-span-1 border-r border-white/5 h-fit pb-8 lg:pb-0">
                    <div className="flex flex-col gap-10">
                        {steps.map((s, idx) => (
                            <div key={s.id} className="relative flex items-start gap-4">
                                {/* Connector Line */}
                                {idx < steps.length - 1 && (
                                    <div className={`absolute left-6 top-12 w-0.5 h-10 ${currentStep > s.id ? 'bg-dash-accent' : 'bg-white/5'}`} />
                                )}
                                
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${
                                    currentStep === s.id ? 'bg-dash-accent text-bg-primary shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 
                                    currentStep > s.id ? 'bg-dash-accent/20 text-dash-accent' : 
                                    'bg-white/5 text-white/20'
                                }`}>
                                    <s.icon size={20} />
                                </div>
                                
                                <div className="flex-1 pt-1">
                                    <h3 className={`text-sm font-bold transition-colors ${currentStep >= s.id ? 'text-white' : 'text-white/20'}`}>
                                        {s.title}
                                    </h3>
                                    <p className={`text-[11px] font-medium leading-tight mt-1 transition-colors ${currentStep >= s.id ? 'text-text-muted' : 'text-white/10'}`}>
                                        {s.desc}
                                    </p>
                                </div>

                                {currentStep > s.id && (
                                    <CheckCircle size={16} className="text-dash-accent absolute -right-2 top-0" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                        <div className="flex items-center gap-3 text-white/40 mb-3">
                             <Lock size={14} />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Security Note</span>
                        </div>
                        <p className="text-[11px] text-text-muted/60 leading-relaxed font-medium">
                            Your data is encrypted end-to-end. We use bank-level security to protect your sensitive information.
                        </p>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-[#0C101A]/50 border border-white/5 rounded-[40px] p-8 sm:p-12 shadow-2xl relative overflow-hidden min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <span className="text-dash-accent font-bold text-xs uppercase tracking-[0.2em] mb-3 block">Step 01 / 03</span>
                                        <h2 className="text-2xl font-bold text-white mb-3">Personal Details</h2>
                                        <p className="text-text-muted text-sm leading-relaxed">Please ensure the information matches your government-issued ID.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Legal Full Name</label>
                                            <div className="relative group">
                                                <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-dash-accent transition-colors" />
                                                <input 
                                                    type="text" 
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                                    placeholder="John Doe"
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-dash-accent/40 focus:bg-white/[0.04] transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Date of Birth</label>
                                            <div className="relative group">
                                                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-dash-accent transition-colors" />
                                                <input 
                                                    type="date" 
                                                    value={formData.dob}
                                                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-dash-accent/40 focus:bg-white/[0.04] transition-all [color-scheme:dark]"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Residential Address</label>
                                            <div className="relative group">
                                                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-dash-accent transition-colors" />
                                                <input 
                                                    type="text" 
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                    placeholder="123 Financial St, London, UK"
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-dash-accent/40 focus:bg-white/[0.04] transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <span className="text-dash-accent font-bold text-xs uppercase tracking-[0.2em] mb-3 block">Step 02 / 03</span>
                                        <h2 className="text-2xl font-bold text-white mb-3">Include a photo</h2>
                                        <p className="text-text-muted text-sm leading-relaxed">Provide high-quality photos of your valid identity document.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {['passport', 'national_id', 'drivers_license'].map((type) => (
                                                <button 
                                                    key={type}
                                                    onClick={() => setFormData({...formData, idType: type})}
                                                    className={`p-4 rounded-2xl border transition-all text-sm font-bold capitalize flex items-center justify-center gap-3 ${
                                                        formData.idType === type 
                                                        ? 'bg-dash-accent/10 border-dash-accent text-dash-accent' 
                                                        : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:border-white/10'
                                                    }`}
                                                >
                                                    {type.replace('_', ' ')}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Front Upload */}
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold text-white/60 text-center uppercase tracking-widest">Document Front</p>
                                                <div 
                                                    onClick={() => frontInputRef.current?.click()}
                                                    className={`aspect-[3/2] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group transition-all relative overflow-hidden ${
                                                        filesPreview.front ? 'border-dash-accent/50 bg-black' : 'border-white/10 bg-white/5 hover:border-dash-accent/30'
                                                    }`}
                                                >
                                                    {filesPreview.front ? (
                                                        <>
                                                            <Image src={filesPreview.front} alt="Front" fill className="object-cover opacity-80" unoptimized />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                                                                <Upload size={24} className="text-white" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                                <ImageIcon size={24} className="text-white/20 group-hover:text-dash-accent" />
                                                            </div>
                                                            <span className="text-xs font-bold text-white/40 group-hover:text-white">Upload Front</span>
                                                            <span className="text-[10px] text-white/20 mt-1 uppercase tracking-tighter">JPG, PNG or PDF</span>
                                                        </>
                                                    )}
                                                </div>
                                                <input type="file" ref={frontInputRef} onChange={(e) => handleFileChange('front', e)} className="hidden" accept="image/*,.pdf" />
                                            </div>

                                            {/* Back Upload */}
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold text-white/60 text-center uppercase tracking-widest">Document Back</p>
                                                <div 
                                                    onClick={() => backInputRef.current?.click()}
                                                    className={`aspect-[3/2] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group transition-all relative overflow-hidden ${
                                                        filesPreview.back ? 'border-dash-accent/50 bg-black' : 'border-white/10 bg-white/5 hover:border-dash-accent/30'
                                                    }`}
                                                >
                                                    {filesPreview.back ? (
                                                        <>
                                                            <Image src={filesPreview.back} alt="Back" fill className="object-cover opacity-80" unoptimized />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                                                                <Upload size={24} className="text-white" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                                <ImageIcon size={24} className="text-white/20 group-hover:text-dash-accent" />
                                                            </div>
                                                            <span className="text-xs font-bold text-white/40 group-hover:text-white">Upload Back</span>
                                                            <span className="text-[10px] text-white/20 mt-1 uppercase tracking-tighter">Optional if Passport</span>
                                                        </>
                                                    )}
                                                </div>
                                                <input type="file" ref={backInputRef} onChange={(e) => handleFileChange('back', e)} className="hidden" accept="image/*,.pdf" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <span className="text-dash-accent font-bold text-xs uppercase tracking-[0.2em] mb-3 block">Step 03 / 03</span>
                                        <h2 className="text-2xl font-bold text-white mb-3">Review & Submit</h2>
                                        <p className="text-text-muted text-sm leading-relaxed">Ensure all details are correct before finalizing your submission.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 grid grid-cols-2 gap-y-6 gap-x-12">
                                            <div>
                                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Full Name</span>
                                                <span className="text-white font-bold">{formData.fullName}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Date of Birth</span>
                                                <span className="text-white font-bold">{formData.dob}</span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Address</span>
                                                <span className="text-white font-bold">{formData.address}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">ID Type</span>
                                                <span className="text-white font-bold capitalize">{formData.idType.replace('_', ' ')}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Documents</span>
                                                <div className="flex gap-2 mt-1">
                                                    <div className={`w-8 h-8 rounded-lg ${files.front ? 'bg-dash-accent/20 text-dash-accent' : 'bg-red-500/20 text-red-500'} flex items-center justify-center`}>
                                                        {files.front ? <CheckCircle size={14} /> : <X size={14} />}
                                                    </div>
                                                    <div className={`w-8 h-8 rounded-lg ${files.back ? 'bg-dash-accent/20 text-dash-accent' : 'bg-white/5 text-white/20'} flex items-center justify-center`}>
                                                        {files.back ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-dash-accent/5 border border-dash-accent/20 rounded-2xl">
                                            <AlertCircle size={20} className="text-dash-accent shrink-0" />
                                            <p className="text-[11px] font-medium text-dash-accent/80 leading-relaxed">
                                                By clicking submit, you confirm that the provided documents are yours and valid. 
                                                False submissions may lead to account suspension.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Pagination Buttons */}
                        <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/5">
                            <button 
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className={`flex items-center gap-2 font-bold text-sm transition-all ${currentStep === 1 ? 'opacity-0' : 'text-white hover:text-dash-accent'}`}
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>

                            {currentStep === 3 ? (
                                <button 
                                    onClick={handleSubmit}
                                    className="px-10 py-4 bg-dash-accent text-bg-primary rounded-2xl font-bold flex items-center gap-2 hover:bg-white active:scale-95 transition-all shadow-xl shadow-dash-accent/20"
                                >
                                    Submit for Verification
                                    <CheckCircle size={18} />
                                </button>
                            ) : (
                                <button 
                                    onClick={handleNext}
                                    className="px-10 py-4 bg-dash-accent text-bg-primary rounded-2xl font-bold flex items-center gap-2 hover:bg-white active:scale-95 transition-all shadow-xl shadow-dash-accent/20"
                                >
                                    Next Step
                                    <ArrowRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
