"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from "motion/react";
import { User, Mail, Globe, Users, Lock, EyeOff, ArrowRight } from 'lucide-react';
import { signUp } from '@/app/actions/auth';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } 
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-bg-primary flex items-center justify-center p-4 sm:p-6 lg:p-8 font-outfit">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-green/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-green/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const }}
        className="w-full max-w-[1100px] bg-[#0A0E1A]/80 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px] relative z-20"
      >
        {/* Left Side: Form Area */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col">
          {/* Logo Area */}
          <div className="flex items-center gap-0 mb-12 sm:mb-16">
            <span className="text-accent-green text-[28px] font-pacifico -mr-1">Provest</span>
            <span className="text-white text-[28px] font-bold font-outfit">Markets</span>
          </div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <h1 className="text-white text-[32px] sm:text-[40px] font-bold mb-8 leading-tight">
              Sign Up
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Login/Name Field */}
              <div className="space-y-2 group">
                <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1 group-focus-within:text-accent-green transition-colors">
                  Login <span className="text-accent-green">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-green transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    name="fullName"
                    type="text" 
                    placeholder="Enter your username"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent-green/40 focus:bg-white/[0.05] transition-all font-outfit"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2 group">
                <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1 group-focus-within:text-accent-green transition-colors">
                  Email <span className="text-accent-green">*</span>
                  <span className="capitalize text-[10px] font-medium ml-2 text-white/20 font-sans tracking-normal">You will receive an email confirmation</span>
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-green transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="Enter your email"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent-green/40 focus:bg-white/[0.05] transition-all font-outfit"
                  />
                </div>
              </div>

              {/* Country Field */}
              <div className="space-y-2 group">
                <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1">
                  Country
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20">
                    <Globe size={18} />
                  </div>
                  <select 
                    name="country"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-white outline-none focus:border-accent-green/40 transition-all font-outfit appearance-none"
                  >
                    <option value="" className="bg-[#0A0E1A]">Select Country</option>
                    <option value="AF" className="bg-[#0A0E1A]">Afghanistan</option>
                    <option value="AL" className="bg-[#0A0E1A]">Albania</option>
                    <option value="DZ" className="bg-[#0A0E1A]">Algeria</option>
                    <option value="AD" className="bg-[#0A0E1A]">Andorra</option>
                    <option value="AO" className="bg-[#0A0E1A]">Angola</option>
                    <option value="AG" className="bg-[#0A0E1A]">Antigua and Barbuda</option>
                    <option value="AR" className="bg-[#0A0E1A]">Argentina</option>
                    <option value="AM" className="bg-[#0A0E1A]">Armenia</option>
                    <option value="AU" className="bg-[#0A0E1A]">Australia</option>
                    <option value="AT" className="bg-[#0A0E1A]">Austria</option>
                    <option value="AZ" className="bg-[#0A0E1A]">Azerbaijan</option>
                    <option value="BS" className="bg-[#0A0E1A]">Bahamas</option>
                    <option value="BH" className="bg-[#0A0E1A]">Bahrain</option>
                    <option value="BD" className="bg-[#0A0E1A]">Bangladesh</option>
                    <option value="BB" className="bg-[#0A0E1A]">Barbados</option>
                    <option value="BY" className="bg-[#0A0E1A]">Belarus</option>
                    <option value="BE" className="bg-[#0A0E1A]">Belgium</option>
                    <option value="BZ" className="bg-[#0A0E1A]">Belize</option>
                    <option value="BJ" className="bg-[#0A0E1A]">Benin</option>
                    <option value="BT" className="bg-[#0A0E1A]">Bhutan</option>
                    <option value="BO" className="bg-[#0A0E1A]">Bolivia</option>
                    <option value="BA" className="bg-[#0A0E1A]">Bosnia and Herzegovina</option>
                    <option value="BW" className="bg-[#0A0E1A]">Botswana</option>
                    <option value="BR" className="bg-[#0A0E1A]">Brazil</option>
                    <option value="BN" className="bg-[#0A0E1A]">Brunei</option>
                    <option value="BG" className="bg-[#0A0E1A]">Bulgaria</option>
                    <option value="BF" className="bg-[#0A0E1A]">Burkina Faso</option>
                    <option value="BI" className="bg-[#0A0E1A]">Burundi</option>
                    <option value="CV" className="bg-[#0A0E1A]">Cabo Verde</option>
                    <option value="KH" className="bg-[#0A0E1A]">Cambodia</option>
                    <option value="CM" className="bg-[#0A0E1A]">Cameroon</option>
                    <option value="CA" className="bg-[#0A0E1A]">Canada</option>
                    <option value="CF" className="bg-[#0A0E1A]">Central African Republic</option>
                    <option value="TD" className="bg-[#0A0E1A]">Chad</option>
                    <option value="CL" className="bg-[#0A0E1A]">Chile</option>
                    <option value="CN" className="bg-[#0A0E1A]">China</option>
                    <option value="CO" className="bg-[#0A0E1A]">Colombia</option>
                    <option value="KM" className="bg-[#0A0E1A]">Comoros</option>
                    <option value="CG" className="bg-[#0A0E1A]">Congo</option>
                    <option value="CD" className="bg-[#0A0E1A]">Congo (DRC)</option>
                    <option value="CR" className="bg-[#0A0E1A]">Costa Rica</option>
                    <option value="CI" className="bg-[#0A0E1A]">Côte d'Ivoire</option>
                    <option value="HR" className="bg-[#0A0E1A]">Croatia</option>
                    <option value="CU" className="bg-[#0A0E1A]">Cuba</option>
                    <option value="CY" className="bg-[#0A0E1A]">Cyprus</option>
                    <option value="CZ" className="bg-[#0A0E1A]">Czech Republic</option>
                    <option value="DK" className="bg-[#0A0E1A]">Denmark</option>
                    <option value="DJ" className="bg-[#0A0E1A]">Djibouti</option>
                    <option value="DM" className="bg-[#0A0E1A]">Dominica</option>
                    <option value="DO" className="bg-[#0A0E1A]">Dominican Republic</option>
                    <option value="EC" className="bg-[#0A0E1A]">Ecuador</option>
                    <option value="EG" className="bg-[#0A0E1A]">Egypt</option>
                    <option value="SV" className="bg-[#0A0E1A]">El Salvador</option>
                    <option value="GQ" className="bg-[#0A0E1A]">Equatorial Guinea</option>
                    <option value="ER" className="bg-[#0A0E1A]">Eritrea</option>
                    <option value="EE" className="bg-[#0A0E1A]">Estonia</option>
                    <option value="SZ" className="bg-[#0A0E1A]">Eswatini</option>
                    <option value="ET" className="bg-[#0A0E1A]">Ethiopia</option>
                    <option value="FJ" className="bg-[#0A0E1A]">Fiji</option>
                    <option value="FI" className="bg-[#0A0E1A]">Finland</option>
                    <option value="FR" className="bg-[#0A0E1A]">France</option>
                    <option value="GA" className="bg-[#0A0E1A]">Gabon</option>
                    <option value="GM" className="bg-[#0A0E1A]">Gambia</option>
                    <option value="GE" className="bg-[#0A0E1A]">Georgia</option>
                    <option value="DE" className="bg-[#0A0E1A]">Germany</option>
                    <option value="GH" className="bg-[#0A0E1A]">Ghana</option>
                    <option value="GR" className="bg-[#0A0E1A]">Greece</option>
                    <option value="GD" className="bg-[#0A0E1A]">Grenada</option>
                    <option value="GT" className="bg-[#0A0E1A]">Guatemala</option>
                    <option value="GN" className="bg-[#0A0E1A]">Guinea</option>
                    <option value="GW" className="bg-[#0A0E1A]">Guinea-Bissau</option>
                    <option value="GY" className="bg-[#0A0E1A]">Guyana</option>
                    <option value="HT" className="bg-[#0A0E1A]">Haiti</option>
                    <option value="HN" className="bg-[#0A0E1A]">Honduras</option>
                    <option value="HU" className="bg-[#0A0E1A]">Hungary</option>
                    <option value="IS" className="bg-[#0A0E1A]">Iceland</option>
                    <option value="IN" className="bg-[#0A0E1A]">India</option>
                    <option value="ID" className="bg-[#0A0E1A]">Indonesia</option>
                    <option value="IR" className="bg-[#0A0E1A]">Iran</option>
                    <option value="IQ" className="bg-[#0A0E1A]">Iraq</option>
                    <option value="IE" className="bg-[#0A0E1A]">Ireland</option>
                    <option value="IL" className="bg-[#0A0E1A]">Israel</option>
                    <option value="IT" className="bg-[#0A0E1A]">Italy</option>
                    <option value="JM" className="bg-[#0A0E1A]">Jamaica</option>
                    <option value="JP" className="bg-[#0A0E1A]">Japan</option>
                    <option value="JO" className="bg-[#0A0E1A]">Jordan</option>
                    <option value="KZ" className="bg-[#0A0E1A]">Kazakhstan</option>
                    <option value="KE" className="bg-[#0A0E1A]">Kenya</option>
                    <option value="KI" className="bg-[#0A0E1A]">Kiribati</option>
                    <option value="KP" className="bg-[#0A0E1A]">Korea (North)</option>
                    <option value="KR" className="bg-[#0A0E1A]">Korea (South)</option>
                    <option value="KW" className="bg-[#0A0E1A]">Kuwait</option>
                    <option value="KG" className="bg-[#0A0E1A]">Kyrgyzstan</option>
                    <option value="LA" className="bg-[#0A0E1A]">Laos</option>
                    <option value="LV" className="bg-[#0A0E1A]">Latvia</option>
                    <option value="LB" className="bg-[#0A0E1A]">Lebanon</option>
                    <option value="LS" className="bg-[#0A0E1A]">Lesotho</option>
                    <option value="LR" className="bg-[#0A0E1A]">Liberia</option>
                    <option value="LY" className="bg-[#0A0E1A]">Libya</option>
                    <option value="LI" className="bg-[#0A0E1A]">Liechtenstein</option>
                    <option value="LT" className="bg-[#0A0E1A]">Lithuania</option>
                    <option value="LU" className="bg-[#0A0E1A]">Luxembourg</option>
                    <option value="MG" className="bg-[#0A0E1A]">Madagascar</option>
                    <option value="MW" className="bg-[#0A0E1A]">Malawi</option>
                    <option value="MY" className="bg-[#0A0E1A]">Malaysia</option>
                    <option value="MV" className="bg-[#0A0E1A]">Maldives</option>
                    <option value="ML" className="bg-[#0A0E1A]">Mali</option>
                    <option value="MT" className="bg-[#0A0E1A]">Malta</option>
                    <option value="MH" className="bg-[#0A0E1A]">Marshall Islands</option>
                    <option value="MR" className="bg-[#0A0E1A]">Mauritania</option>
                    <option value="MU" className="bg-[#0A0E1A]">Mauritius</option>
                    <option value="MX" className="bg-[#0A0E1A]">Mexico</option>
                    <option value="FM" className="bg-[#0A0E1A]">Micronesia</option>
                    <option value="MD" className="bg-[#0A0E1A]">Moldova</option>
                    <option value="MC" className="bg-[#0A0E1A]">Monaco</option>
                    <option value="MN" className="bg-[#0A0E1A]">Mongolia</option>
                    <option value="ME" className="bg-[#0A0E1A]">Montenegro</option>
                    <option value="MA" className="bg-[#0A0E1A]">Morocco</option>
                    <option value="MZ" className="bg-[#0A0E1A]">Mozambique</option>
                    <option value="MM" className="bg-[#0A0E1A]">Myanmar</option>
                    <option value="NA" className="bg-[#0A0E1A]">Namibia</option>
                    <option value="NR" className="bg-[#0A0E1A]">Nauru</option>
                    <option value="NP" className="bg-[#0A0E1A]">Nepal</option>
                    <option value="NL" className="bg-[#0A0E1A]">Netherlands</option>
                    <option value="NZ" className="bg-[#0A0E1A]">New Zealand</option>
                    <option value="NI" className="bg-[#0A0E1A]">Nicaragua</option>
                    <option value="NE" className="bg-[#0A0E1A]">Niger</option>
                    <option value="NG" className="bg-[#0A0E1A]">Nigeria</option>
                    <option value="MK" className="bg-[#0A0E1A]">North Macedonia</option>
                    <option value="NO" className="bg-[#0A0E1A]">Norway</option>
                    <option value="OM" className="bg-[#0A0E1A]">Oman</option>
                    <option value="PK" className="bg-[#0A0E1A]">Pakistan</option>
                    <option value="PW" className="bg-[#0A0E1A]">Palau</option>
                    <option value="PS" className="bg-[#0A0E1A]">Palestine</option>
                    <option value="PA" className="bg-[#0A0E1A]">Panama</option>
                    <option value="PG" className="bg-[#0A0E1A]">Papua New Guinea</option>
                    <option value="PY" className="bg-[#0A0E1A]">Paraguay</option>
                    <option value="PE" className="bg-[#0A0E1A]">Peru</option>
                    <option value="PH" className="bg-[#0A0E1A]">Philippines</option>
                    <option value="PL" className="bg-[#0A0E1A]">Poland</option>
                    <option value="PT" className="bg-[#0A0E1A]">Portugal</option>
                    <option value="QA" className="bg-[#0A0E1A]">Qatar</option>
                    <option value="RO" className="bg-[#0A0E1A]">Romania</option>
                    <option value="RU" className="bg-[#0A0E1A]">Russia</option>
                    <option value="RW" className="bg-[#0A0E1A]">Rwanda</option>
                    <option value="KN" className="bg-[#0A0E1A]">Saint Kitts and Nevis</option>
                    <option value="LC" className="bg-[#0A0E1A]">Saint Lucia</option>
                    <option value="VC" className="bg-[#0A0E1A]">Saint Vincent and the Grenadines</option>
                    <option value="WS" className="bg-[#0A0E1A]">Samoa</option>
                    <option value="SM" className="bg-[#0A0E1A]">San Marino</option>
                    <option value="ST" className="bg-[#0A0E1A]">São Tomé and Príncipe</option>
                    <option value="SA" className="bg-[#0A0E1A]">Saudi Arabia</option>
                    <option value="SN" className="bg-[#0A0E1A]">Senegal</option>
                    <option value="RS" className="bg-[#0A0E1A]">Serbia</option>
                    <option value="SC" className="bg-[#0A0E1A]">Seychelles</option>
                    <option value="SL" className="bg-[#0A0E1A]">Sierra Leone</option>
                    <option value="SG" className="bg-[#0A0E1A]">Singapore</option>
                    <option value="SK" className="bg-[#0A0E1A]">Slovakia</option>
                    <option value="SI" className="bg-[#0A0E1A]">Slovenia</option>
                    <option value="SB" className="bg-[#0A0E1A]">Solomon Islands</option>
                    <option value="SO" className="bg-[#0A0E1A]">Somalia</option>
                    <option value="ZA" className="bg-[#0A0E1A]">South Africa</option>
                    <option value="SS" className="bg-[#0A0E1A]">South Sudan</option>
                    <option value="ES" className="bg-[#0A0E1A]">Spain</option>
                    <option value="LK" className="bg-[#0A0E1A]">Sri Lanka</option>
                    <option value="SD" className="bg-[#0A0E1A]">Sudan</option>
                    <option value="SR" className="bg-[#0A0E1A]">Suriname</option>
                    <option value="SE" className="bg-[#0A0E1A]">Sweden</option>
                    <option value="CH" className="bg-[#0A0E1A]">Switzerland</option>
                    <option value="SY" className="bg-[#0A0E1A]">Syria</option>
                    <option value="TW" className="bg-[#0A0E1A]">Taiwan</option>
                    <option value="TJ" className="bg-[#0A0E1A]">Tajikistan</option>
                    <option value="TZ" className="bg-[#0A0E1A]">Tanzania</option>
                    <option value="TH" className="bg-[#0A0E1A]">Thailand</option>
                    <option value="TL" className="bg-[#0A0E1A]">Timor-Leste</option>
                    <option value="TG" className="bg-[#0A0E1A]">Togo</option>
                    <option value="TO" className="bg-[#0A0E1A]">Tonga</option>
                    <option value="TT" className="bg-[#0A0E1A]">Trinidad and Tobago</option>
                    <option value="TN" className="bg-[#0A0E1A]">Tunisia</option>
                    <option value="TR" className="bg-[#0A0E1A]">Turkey</option>
                    <option value="TM" className="bg-[#0A0E1A]">Turkmenistan</option>
                    <option value="TV" className="bg-[#0A0E1A]">Tuvalu</option>
                    <option value="UG" className="bg-[#0A0E1A]">Uganda</option>
                    <option value="UA" className="bg-[#0A0E1A]">Ukraine</option>
                    <option value="AE" className="bg-[#0A0E1A]">United Arab Emirates</option>
                    <option value="GB" className="bg-[#0A0E1A]">United Kingdom</option>
                    <option value="US" className="bg-[#0A0E1A]">United States</option>
                    <option value="UY" className="bg-[#0A0E1A]">Uruguay</option>
                    <option value="UZ" className="bg-[#0A0E1A]">Uzbekistan</option>
                    <option value="VU" className="bg-[#0A0E1A]">Vanuatu</option>
                    <option value="VA" className="bg-[#0A0E1A]">Vatican City</option>
                    <option value="VE" className="bg-[#0A0E1A]">Venezuela</option>
                    <option value="VN" className="bg-[#0A0E1A]">Vietnam</option>
                    <option value="YE" className="bg-[#0A0E1A]">Yemen</option>
                    <option value="ZM" className="bg-[#0A0E1A]">Zambia</option>
                    <option value="ZW" className="bg-[#0A0E1A]">Zimbabwe</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Referrer Field */}
              <div className="space-y-2 group">
                <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1">
                  Referrer
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20">
                    <Users size={18} />
                  </div>
                  <input 
                    name="referrer"
                    type="text" 
                    placeholder="Enter referral code (Optional)"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-accent-green/40 transition-all font-outfit"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 group">
                <label className="text-white/40 text-[12px] font-space uppercase font-bold tracking-widest ml-1 group-focus-within:text-accent-green transition-colors">
                  Password <span className="text-accent-green">*</span>
                  <span className="capitalize text-[10px] font-medium ml-2 text-white/20 font-sans tracking-normal">(At least 8 symbols)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-green transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white outline-none focus:border-accent-green/40 transition-all font-outfit"
                  />
                  <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                    <EyeOff size={18} />
                  </button>
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[14px] font-sans">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 rounded-xl bg-accent-green/10 border border-accent-green/20 text-accent-green text-[14px] font-sans">
                  Success! Please check your email for verification.
                </div>
              )}

              {/* Terms Checkbox/Text placeholder */}
              <p className="text-[13px] text-white/30 leading-relaxed font-sans mt-8">
                By clicking "Sign Up" button, you agree to our <Link href="/terms" className="text-accent-green underline hover:text-white transition-colors">Terms of use</Link>
              </p>

              <button 
                type="submit"
                disabled={loading || success}
                className="w-full py-5 rounded-2xl bg-accent-green text-bg-primary font-bold text-[17px] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-[0_20px_40px_-10px_rgba(163,240,193,0.3)] mt-8"
              >
                {loading ? 'Processing...' : 'Sign Up'}
              </button>

              <div className="mt-8 text-center lg:hidden">
                <p className="text-white/40 text-[14px]">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-accent-green underline font-bold">
                    Sign In here
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Right Side: Visual Brand Area */}
        <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-accent-green/10 via-[#0A0E1A] to-[#0A0E1A]">
          {/* Decorative Pattern Layer */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(163,240,193,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-16 text-center">
            {/* Illustration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="w-full max-w-[320px] mb-12"
            >
              <img src="/sign-up.svg" alt="Sign Up Illustration" className="w-full h-auto drop-shadow-2xl" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="text-white text-[32px] font-bold mb-4 leading-tight">
                Hello! Welcome to the <br /> <span className="text-accent-green">ProvestMarkets</span> platform
              </h2>
              <p className="text-white/40 text-[16px] mb-10 font-sans">
                If you already have an account
              </p>

              <Link 
                href="/signin"
                className="group flex items-center gap-3 px-10 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-bold text-[16px] hover:bg-accent-green hover:text-bg-primary hover:border-accent-green transition-all shadow-xl"
              >
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Abstract Provest Shapes */}
          <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-accent-green/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-5%] left-[-10%] w-[250px] h-[250px] bg-accent-green/5 blur-[80px] rounded-full" />
        </div>
      </motion.div>
    </main>
  );
}
