import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Shield, Users, Settings, Activity, Server, Lock, UserPlus, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const TABS = [
  { id: 'system', label: 'SYSTEM_STATUS', icon: Activity },
  { id: 'users', label: 'USER_MANIFEST', icon: Users },
  { id: 'security', label: 'ACCESS_CONTROL', icon: Shield },
  { id: 'panel', label: 'PANEL_CONFIG', icon: Settings },
];

interface SettingsType {
  onboarding: boolean;
  loginAnim: boolean;
  bgBlur: boolean;
}

function SystemStatus() {
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const [updateError, setUpdateError] = useState('');

  const triggerUpdate = async () => {
    setUpdating(true);
    setProgress(0);
    setLogs(['Initiating sequence...', 'Bypassing local proxies...', 'Injecting payload...']);
    setUpdateError('');
    try {
      await axios.post('/api/system/update');
    } catch (error: any) {
      setUpdating(false);
      setUpdateError(error.response?.data?.error || 'System update could not be initialized.');
      return;
    }

    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 15) + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUpdating(false);
          setLogs(l => [...l, 'System optimal.']);
        }, 1500);
      }
      setProgress(p);
      setLogs(l => [...l, `Patching module 0x${Math.floor(Math.random()*10000).toString(16).toUpperCase()}...`]);
    }, 400);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="col-span-2 space-y-8">
        <div>
          <h1 className="text-2xl font-dossier italic text-[#d6d1c4] mb-2">System Status</h1>
          <p className="text-xs text-[#6b665c] tracking-widest uppercase">Overview and Maintenance</p>
        </div>

        <div className="border border-[#231f20] bg-[#0c0b0b] p-6 relative group shadow-xl">
           <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#6b665c]"></div>
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#6b665c]"></div>

           <h2 className="text-[10px] text-[#6b665c] tracking-[0.3em] mb-6">NETWORK // PLAYIT_TUNNEL</h2>
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 border border-[#5c0a0a] flex items-center justify-center bg-[#141212] relative">
                 <div className="absolute inset-0 bg-[#a31515]/10 animate-pulse"></div>
                 <Server className="text-[#a31515] w-6 h-6 relative z-10" />
              </div>
              <div>
                <div className="text-xl text-[#d6d1c4] font-dossier tracking-wide">CONNECTED</div>
                <div className="text-xs text-[#6b665c] mt-1">Tunnel active on port 25565</div>
              </div>
              <div className="ml-auto flex items-center gap-3 text-[#a31515] text-[10px] tracking-[0.2em] px-3 py-1 border border-[#5c0a0a] bg-[#141212]">
                <span className="w-1.5 h-1.5 bg-[#a31515] animate-pulse"></span>
                LIVE
              </div>
           </div>
        </div>

        <div className="border border-[#231f20] bg-[#0c0b0b] p-6 shadow-xl">
           <h2 className="text-[10px] text-[#6b665c] tracking-[0.3em] mb-6">MAINTENANCE // KERNEL</h2>
           {updateError && <div className="mb-4 border border-[#5c0a0a] bg-[#5c0a0a]/10 p-3 text-xs text-[#d6d1c4]">{updateError}</div>}
           {updating ? (
             <div className="space-y-4">
                <div className="flex justify-between text-[10px] text-[#a31515] tracking-widest mb-2">
                  <span>UPDATING SYSTEM...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 w-full bg-[#141212] relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-[#a31515] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="h-40 bg-[#050505] border border-[#231f20] p-4 text-[10px] text-[#6b665c] overflow-y-auto flex flex-col font-panel space-y-1">
                  {logs.map((l, i) => <div key={i} className={i === logs.length -1 ? 'text-[#d6d1c4]' : 'opacity-60'}>{`> `}{l}</div>)}
                  <div ref={logsEndRef} />
                </div>
             </div>
           ) : (
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                  <div className="text-[#d6d1c4] mb-1 font-dossier text-lg tracking-wide">Update Available: v2.4.0-DEATH</div>
                  <div className="text-xs text-[#6b665c]">Security patches and entity definition updates.</div>
               </div>
               <button onClick={triggerUpdate} className="px-6 py-3 bg-[#141212] text-[#a31515] border border-[#5c0a0a] hover:bg-[#5c0a0a]/30 transition-all text-[10px] tracking-[0.2em]">
                 INITIALIZE
               </button>
             </div>
           )}
        </div>
      </div>

      <div className="col-span-1 min-h-[400px]">
        <div className="border border-[#231f20] bg-[#0c0b0b] p-2 relative shadow-2xl h-full flex flex-col group">
          <div className="p-4 border-b border-[#231f20] flex justify-between items-center bg-[#080707]">
            <span className="text-[10px] text-[#6b665c] tracking-[0.2em]">ASSET_REF // NULL_ENTITY</span>
            <Lock className="w-3 h-3 text-[#5c0a0a]" />
          </div>

          <div className="relative flex-1 w-full flex items-center justify-center bg-[#050505] overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

             <img
                src="/images/shinigami-reference.png"
                className="absolute inset-0 w-full h-full object-cover object-top invert opacity-40 mix-blend-lighten filter contrast-125 group-hover:opacity-70 group-hover:scale-105 transition-all duration-1000 ease-out"
                alt="Entity Reference"
             />

             <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0b] via-transparent to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-b from-[#0c0b0b] via-transparent to-transparent opacity-50"></div>
          </div>

          <div className="p-6 bg-[#080707] border-t border-[#231f20] relative">
            <div className="font-dossier italic text-[#a31515] text-xl leading-snug">
              "Tethered to Operator.<br/>Do not sever the link."
            </div>
            <div className="absolute -bottom-2 -right-2 text-[10px] text-[#5c0a0a] transform -rotate-6 font-dossier italic">
              confirmed.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserManifest() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/system/users');
      setUsers(response.data);
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'Unable to load user manifest.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirmId === id) {
      setDeletingId(id);
      try {
        await axios.delete(`/api/system/users/${id}`);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (requestError: any) {
        setError(requestError.response?.data?.error || 'Unable to revoke access.');
      } finally {
        setDeletingId(null);
        setConfirmId(null);
      }
    } else {
      setConfirmId(id);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/system/users', { username: newUser, password: newPassword, role: newRole });
      await fetchUsers();
      setNewUser('');
      setNewPassword('');
      setNewRole('user');
      setIsAdding(false);
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'Unable to create user.');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-2xl font-dossier italic text-[#d6d1c4] mb-2">User Manifest</h1>
        <p className="text-xs text-[#6b665c] tracking-widest uppercase mb-8">Active Entities</p>
      </div>

      <div className="border border-[#231f20] bg-[#0c0b0b] shadow-2xl relative">
        <div className="absolute inset-0 bg-[#d6d1c4] opacity-[0.02] pointer-events-none mix-blend-overlay"></div>

        <div className="p-6 border-b border-[#231f20] flex flex-col sm:flex-row sm:items-center justify-between bg-[#080707] gap-4">
          <div>
            <h2 className="text-[10px] text-[#6b665c] tracking-[0.2em]">MANIFEST // ALL_RECORDS</h2>
            <div className="font-dossier italic text-[#a31515] mt-1 text-lg">{users.length} recorded. Proceed with caution.</div>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 border border-[#231f20] bg-[#141212] text-[10px] tracking-[0.2em] text-[#d6d1c4] hover:text-white hover:border-[#6b665c] transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            {isAdding ? <X className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
            {isAdding ? 'ABORT' : 'ADD ENTRY'}
          </button>
        </div>

        {isAdding && (
          <div className="p-6 border-b border-[#231f20] bg-[#141212] animate-in slide-in-from-top-2">
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
              <input
                autoFocus
                type="text"
                required
                value={newUser}
                onChange={e => setNewUser(e.target.value)}
                placeholder="ENTER_NAME..."
                className="flex-1 bg-[#050505] border border-[#231f20] px-4 py-3 text-sm text-[#d6d1c4] focus:outline-none focus:border-[#5c0a0a] focus:ring-1 focus:ring-[#5c0a0a] placeholder:text-[#6b665c] font-panel"
              />
              <input
                required
                minLength={8}
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="PASSWORD..."
                className="flex-1 bg-[#050505] border border-[#231f20] px-4 py-3 text-sm text-[#d6d1c4] focus:outline-none focus:border-[#5c0a0a] focus:ring-1 focus:ring-[#5c0a0a] placeholder:text-[#6b665c] font-panel"
              />
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="bg-[#050505] border border-[#231f20] px-3 py-3 text-xs text-[#d6d1c4] font-panel"
              >
                <option value="user">USER</option>
                <option value="admin">ADMIN</option>
                <option value="owner">OWNER</option>
              </select>
              <button type="submit" className="px-8 py-3 bg-[#141212] border border-[#5c0a0a] text-[#a31515] text-[10px] tracking-[0.2em] hover:bg-[#5c0a0a]/30 transition-colors">
                COMMIT
              </button>
            </form>
          </div>
        )}

        <div className="divide-y divide-[#231f20]/50 relative z-10">
          {error && <div className="p-4 text-xs text-[#d6d1c4] border-b border-[#5c0a0a] bg-[#5c0a0a]/10">{error}</div>}
          {users.map((manifestUser, idx) => (
            <div key={manifestUser.id} className={`p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between group transition-all duration-300 ${deletingId === manifestUser.id ? 'opacity-0 translate-x-4' : 'opacity-100'} hover:bg-[#141212]/50 gap-4`}>
               <div className={`flex items-center gap-4 sm:gap-6 ${confirmId === manifestUser.id ? 'animate-pulse' : ''}`}>
                  <div className="text-[#6b665c] text-[10px] w-6 tracking-widest">{(idx + 1).toString().padStart(2, '0')}</div>

                   <div className={`font-dossier text-2xl tracking-wide ${confirmId === manifestUser.id ? 'text-[#a31515]' : 'text-[#d6d1c4]'} ${deletingId === manifestUser.id ? 'animate-strike' : ''}`}>
                     {manifestUser.username}
                  </div>

                  <div className="text-[9px] tracking-[0.2em] px-2 py-1 bg-[#050505] border border-[#231f20] text-[#6b665c]">
                     {manifestUser.role}
                  </div>
               </div>

               <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pl-10 sm:pl-0">
                  <div className="text-[10px] text-[#6b665c] tracking-widest">
                     STATUS: <span className="text-[#a31515]">ACTIVE</span>
                  </div>

                   {manifestUser.id === user?.id ? (
                     <span className="text-[10px] tracking-[0.2em] text-[#6b665c]">CURRENT_OPERATOR</span>
                   ) : confirmId === manifestUser.id ? (
                     <button
                        onClick={() => handleDelete(manifestUser.id)}
                       className="text-[10px] tracking-[0.2em] text-[#a31515] border border-[#5c0a0a] px-4 py-2 bg-[#141212] hover:bg-[#5c0a0a]/30 transition-colors"
                     >
                       CONFIRM ELIMINATION
                     </button>
                  ) : (
                     <button
                        onClick={() => handleDelete(manifestUser.id)}
                       className="text-[#6b665c] hover:text-[#a31515] transition-colors p-2 sm:opacity-0 group-hover:opacity-100"
                       title="Eliminate"
                     >
                       <X className="w-5 h-5" />
                     </button>
                  )}
               </div>
            </div>
          ))}
          <div className="p-5 text-center text-[10px] text-[#6b665c] tracking-[0.3em] bg-[#050505] border-t border-[#231f20]">
             LIVE ACCESS RECORDS
          </div>
        </div>
      </div>
    </div>
  )
}

function AccessControl() {
  const { user, logout } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [passcodes, setPasscodes] = useState({ current: '', new: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetting(true);
    setError('');
    try {
      await axios.put('/api/auth/password', {
        oldPassword: passcodes.current,
        newPassword: passcodes.new,
      });
      setResetting(false);
      setShowPass(false);
      setPasscodes({ current: '', new: '' });
      setTimeout(() => logout(), 700);
    } catch (requestError: any) {
      setResetting(false);
      setError(requestError.response?.data?.error || 'Passcode modification failed.');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl">
      <div>
        <h1 className="text-2xl font-dossier italic text-[#d6d1c4] mb-2">Access Control</h1>
        <p className="text-xs text-[#6b665c] tracking-widest uppercase mb-8">Security & Authentication</p>
      </div>

      <div className="border border-[#231f20] bg-[#0c0b0b] p-8 relative shadow-2xl overflow-hidden">
        <div className="absolute top-8 right-8 border-2 border-[#5c0a0a]/20 text-[#5c0a0a]/20 p-2 transform rotate-[15deg] text-xl font-dossier italic tracking-widest pointer-events-none select-none">
          RESTRICTED
        </div>

        <div className="mb-10 relative z-10">
          <h2 className="text-[10px] text-[#6b665c] tracking-[0.2em] mb-1">SECURITY // CREDENTIALS</h2>
          <div className="font-dossier italic text-[#d6d1c4] text-lg">Maintain absolute secrecy.</div>
        </div>

        <div className="space-y-10 relative z-10">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div>
                <div className="text-sm text-[#d6d1c4] font-panel">Passcode Modification</div>
                <div className="text-xs text-[#6b665c] mt-1">Last changed 42 days ago</div>
              </div>
              <button
                onClick={() => setShowPass(!showPass)}
                className="px-5 py-2 border border-[#231f20] bg-[#141212] text-[10px] tracking-[0.2em] text-[#d6d1c4] hover:text-white hover:border-[#6b665c] transition-colors self-start sm:self-auto"
              >
                {showPass ? 'ABORT' : 'MODIFY'}
              </button>
            </div>

             {error && <div className="mb-4 border border-[#5c0a0a] bg-[#5c0a0a]/10 p-3 text-xs text-[#d6d1c4]">{error}</div>}
             {showPass && (
              <form onSubmit={handleSubmit} className="space-y-5 mt-6 p-6 border border-[#231f20] bg-[#050505] animate-in slide-in-from-top-2">
                <div>
                  <label className="block text-[10px] text-[#6b665c] tracking-[0.2em] mb-3">CURRENT PASSCODE</label>
                  <div className="relative">
                     <Lock className="absolute left-4 top-3 w-4 h-4 text-[#6b665c]" />
                     <input
                       type="password"
                       required
                       value={passcodes.current}
                       onChange={e => setPasscodes({...passcodes, current: e.target.value})}
                       className="w-full bg-[#141212] border border-[#231f20] px-12 py-3 text-sm text-[#d6d1c4] focus:outline-none focus:border-[#5c0a0a] font-panel transition-colors"
                     />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-[#6b665c] tracking-[0.2em] mb-3">NEW PASSCODE</label>
                  <div className="relative">
                     <Lock className="absolute left-4 top-3 w-4 h-4 text-[#6b665c]" />
                     <input
                       type="password"
                       required
                       value={passcodes.new}
                       onChange={e => setPasscodes({...passcodes, new: e.target.value})}
                       className="w-full bg-[#141212] border border-[#231f20] px-12 py-3 text-sm text-[#d6d1c4] focus:outline-none focus:border-[#5c0a0a] font-panel transition-colors"
                     />
                  </div>
                </div>
                 <button type="submit" disabled={resetting || user?.username === 'admin'} className="w-full mt-4 px-6 py-3 bg-[#141212] border border-[#5c0a0a] text-[#a31515] text-[10px] tracking-[0.2em] hover:bg-[#5c0a0a]/30 transition-all disabled:opacity-50">
                  {resetting ? <span className="animate-pulse">ENCRYPTING...</span> : 'CONFIRM MODIFICATION'}
                </button>
                 {user?.username === 'admin' && <p className="mt-3 text-xs text-[#a31515]">The default admin password cannot be changed.</p>}
              </form>
            )}
          </div>

          <div className="pt-8 border-t border-[#231f20]">
             <div className="text-sm text-[#d6d1c4] font-panel mb-6">Multi-Factor Authentication</div>
             <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 border border-[#231f20] bg-[#050505]">
               <div className="w-12 h-12 flex items-center justify-center border border-[#231f20] bg-[#141212] shrink-0">
                 <Shield className="w-5 h-5 text-[#6b665c]" />
               </div>
               <div>
                  <div className="text-[10px] text-[#6b665c] tracking-[0.2em]">STATUS: <span className="text-[#a31515]">INACTIVE</span></div>
                  <div className="text-xs text-[#6b665c] mt-2">Enable to prevent unauthorized access.</div>
               </div>
               <button className="sm:ml-auto px-6 py-3 border border-[#231f20] bg-[#141212] text-[#d6d1c4] text-[10px] tracking-[0.2em] hover:text-white hover:border-[#6b665c] transition-colors w-full sm:w-auto">
                 ENABLE
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({ label, desc, checked, onChange }: { label: string, desc: string, checked: boolean, onChange: () => void }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer" onClick={onChange}>
      <div className="pr-4">
        <div className="text-sm text-[#d6d1c4] font-panel">{label}</div>
        <div className="text-xs text-[#6b665c] mt-1">{desc}</div>
      </div>
      <button
        className={`w-12 h-6 rounded-full p-1 transition-colors relative border shrink-0 ${checked ? 'bg-[#5c0a0a] border-[#a31515]' : 'bg-[#050505] border-[#231f20]'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-[#d6d1c4] transition-transform ${checked ? 'translate-x-6 bg-white' : 'translate-x-0'}`}></div>
      </button>
    </div>
  )
}

function PanelConfig() {
  const {
    panelName,
    enablePlayit,
    enableTutorial,
    enableLoginAnimation,
    panelBackgroundBlur,
    fetchSettings,
  } = useSettings();
  const [name, setName] = useState(panelName);
  const [playit, setPlayit] = useState(enablePlayit);
  const [tutorial, setTutorial] = useState(enableTutorial);
  const [loginAnim, setLoginAnim] = useState(enableLoginAnimation);
  const [blur, setBlur] = useState(panelBackgroundBlur > 0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(panelName);
    setPlayit(enablePlayit);
    setTutorial(enableTutorial);
    setLoginAnim(enableLoginAnimation);
    setBlur(panelBackgroundBlur > 0);
  }, [panelName, enablePlayit, enableTutorial, enableLoginAnimation, panelBackgroundBlur]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/api/system/settings', {
        panelName: name,
        enablePlayit: playit,
        enableTutorial: tutorial,
        enableLoginAnimation: loginAnim,
        panelBackgroundBlur: blur ? 10 : 0,
      });
      await fetchSettings();
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl">
      <div>
        <h1 className="text-2xl font-dossier italic text-[#d6d1c4] mb-2">Panel Configuration</h1>
        <p className="text-xs text-[#6b665c] tracking-widest uppercase mb-8">Interface & Experience</p>
      </div>

      <div className="border border-[#231f20] bg-[#0c0b0b] p-8 shadow-2xl">
        <div className="mb-10">
          <h2 className="text-[10px] text-[#6b665c] tracking-[0.2em] mb-1">CONFIG // INTERFACE</h2>
          <div className="font-dossier italic text-[#d6d1c4] text-lg">Modify perceptual parameters.</div>
        </div>

         <div className="space-y-8">
           <div className="border-b border-[#231f20] pb-8">
             <label className="block text-[10px] text-[#6b665c] tracking-[0.2em] mb-3">PANEL DESIGNATION</label>
             <input
               value={name}
               onChange={e => setName(e.target.value)}
               className="w-full bg-[#050505] border border-[#231f20] px-4 py-3 text-sm text-[#d6d1c4] focus:outline-none focus:border-[#5c0a0a] font-panel"
             />
           </div>
          <ToggleRow
            label="Onboarding Tutorial"
            desc="Display initial guidance for new operators."
             checked={tutorial}
             onChange={() => setTutorial(value => !value)}
          />
          <ToggleRow
            label="Login Animation"
            desc="Execute graphical sequence upon authentication."
             checked={loginAnim}
             onChange={() => setLoginAnim(value => !value)}
          />
          <ToggleRow
            label="Background Blur"
            desc="Apply perceptual isolation to the interface backdrop."
             checked={blur}
             onChange={() => setBlur(value => !value)}
           />
           <ToggleRow
             label="Playit Tunnel"
             desc="Allow tunnel controls for Minecraft instances."
             checked={playit}
             onChange={() => setPlayit(value => !value)}
          />
        </div>

        <div className="mt-12 pt-8 border-t border-[#231f20] flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`px-8 py-3 text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 w-full sm:w-48 ${
              saved
                ? 'bg-[#141212] text-[#d6d1c4] border border-[#6b665c]'
                : 'bg-[#141212] text-[#a31515] border border-[#5c0a0a] hover:bg-[#5c0a0a]/30'
            }`}
          >
            {saving ? (
              <span className="animate-pulse">COMMITTING...</span>
            ) : saved ? (
              <><Check className="w-4 h-4" /> COMMITTED</>
            ) : (
              'COMMIT CHANGES'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DeathnoteSettings() {
  const { panelBackgroundBlur } = useSettings();
  const [activeTab, setActiveTab] = useState('system');

  return (
    <div className="min-h-screen bg-[#050505] text-[#d6d1c4] font-panel selection:bg-[#a31515]/30 overflow-hidden flex flex-col md:flex-row relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@400;700&display=swap');
        .font-dossier { font-family: 'Crimson Pro', serif; }
        .font-panel { font-family: 'JetBrains Mono', monospace; }

        .crt-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          background-size: 100% 4px, 6px 100%;
          pointer-events: none;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050505; border-left: 1px solid #231f20; }
        ::-webkit-scrollbar-thumb { background: #231f20; }
        ::-webkit-scrollbar-thumb:hover { background: #5c0a0a; }

        @keyframes strike {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .animate-strike {
          position: relative;
          display: inline-block;
        }
        .animate-strike::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 2px;
          background: #a31515;
          animation: strike 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>

      {/* Grid Background */}
      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#231f20 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        {panelBackgroundBlur > 0 && (
          <div className="absolute inset-0 backdrop-blur-[3px] bg-[#050505]/40 transition-all duration-700"></div>
        )}
      </div>

      <div className="fixed inset-0 z-50 crt-overlay mix-blend-overlay pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-full md:w-72 md:h-screen border-r border-[#231f20] bg-[#080707]/90 backdrop-blur-md z-20 flex flex-col relative shadow-[4px_0_24px_rgba(0,0,0,0.5)] flex-shrink-0">
        <div className="p-6 border-b border-[#231f20]">
          <div className="text-[#a31515] text-[10px] font-bold tracking-[0.3em] mb-2">CODEZ // CONTROL</div>
          <div className="font-dossier text-2xl text-[#d6d1c4]">Operator:<br/><span className="italic text-white">Light Yagami</span></div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-x-auto flex md:flex-col items-center md:items-stretch">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex-shrink-0 md:flex-shrink flex items-center gap-4 px-4 py-3 text-xs tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#141212] text-[#a31515] border-b-2 md:border-b-0 md:border-l-2 border-[#a31515]' : 'text-[#6b665c] hover:text-[#d6d1c4] hover:bg-[#141212]/50 border-b-2 md:border-b-0 md:border-l-2 border-transparent'}`}
            >
              <tab.icon className="w-4 h-4 hidden sm:block" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-[#231f20] text-[10px] text-[#6b665c] font-panel hidden md:block">
          <div className="flex justify-between mb-1"><span>SYS.ID:</span> <span>0x99FA</span></div>
          <div className="flex justify-between mb-1"><span>UPTIME:</span> <span className="text-[#d6d1c4]">99.9%</span></div>
          <div className="flex justify-between"><span>LINK:</span> <span className="text-[#a31515] animate-pulse">SECURE</span></div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-8 lg:p-12 min-h-full flex flex-col">
          {activeTab === 'system' && <SystemStatus />}
          {activeTab === 'users' && <UserManifest />}
          {activeTab === 'security' && <AccessControl />}
          {activeTab === 'panel' && <PanelConfig />}
        </div>
      </main>
    </div>
  );
}
