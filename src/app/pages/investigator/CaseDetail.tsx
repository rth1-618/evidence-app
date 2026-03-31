import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCases } from '../../hooks/useCases';
import { useUsers } from '../../hooks/useUsers';
import { useEvidence } from '../../hooks/useEvidence';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';

import {
  ArrowLeft, Search, CheckCircle2, XCircle, Trash2,
  MapPin, Shield, Loader2, Plus, Link2, FileText,
  Calendar, User, Users, ClipboardList, Info, Phone, Home,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import EvidenceDetail from '../field-officer/EvidenceDetail';

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // States
  const [officerSearch, setOfficerSearch] = useState('');
  const [showPOIModal, setShowPOIModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [caseForm, setCaseForm] = useState({ description: '', notes: '', priority: 'medium' });
  const [newPerson, setNewPerson] = useState({ name: '', dob: '', role: 'Other', address: '', contact: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [caseClose, setCaseClose] = useState(false);
  const [showCaseClose, setshowCaseClose] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);



  // Data
  const { selectedCaseData: caseData, detailLoading, assignOfficer, updateCase, addPOI } = useCases(id);
  const { unassignedEvidence, updateStatus } = useEvidence(searchQuery);
  const { officerResults, isSearching } = useUsers(officerSearch);

  useEffect(() => {
    if (caseData) {
      setCaseForm({
        description: caseData.description || '',
        notes: caseData.notes || '',
        priority: caseData.priority || 'medium'
      });
    }
  }, [caseData]);

  if (detailLoading) return (
    <div className="h-[50vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  const handleOfficerSelect = (off: any) => {
    const currentIds = caseData?.assignedOfficers?.map((o: any) => o?._id) || [];
    if (currentIds.includes(off?._id)) return toast.error("Already assigned");
    assignOfficer.mutate([...currentIds, off?._id], {
      onSuccess: () => { setOfficerSearch(''); toast.success("Officer added"); }
    });
  };
  const handlePOISubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPOI.mutate(newPerson, {
      onSuccess: () => {
        setShowPOIModal(false);
        toast.success("Subject added to case");
      }
    });
  }

  if (!caseData) return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-6 animate-in fade-in zoom-in-95">
      <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-red-500">
        <AlertCircle size={32} />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Case Record Not Found</h2>
        <p className="text-gray-500 text-sm">The requested ID does not exist in the active registry.</p>
      </div>
      <button
        onClick={() => navigate('/investigator/cases')}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
      >
        <ArrowLeft size={16} /> Return to Case Registry
      </button>
    </div>
  );
  // close data
  const caseClosed = (isOpen: boolean) => {    if (isOpen) {
    if (caseClose) setCaseClose(true);{
      updateCase.mutate({ status: 'closed' }, {
        onSuccess: () => {
          toast.success("Case closed successfully");
          setHideButtons(true);
          //navigate('/investigator/cases');
        },
        onError: () => toast.error("Failed to close case. Please try again.")
      });
    }}}
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 text-slate-800 bg-slate-50/30 rounded-3xl">

      {/* 1. CLEAN HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white hover:shadow-md rounded-2xl border border-transparent transition-all">
            <ArrowLeft size={22} className="text-slate-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{caseData?.caseId}</h1>
            <p className="text-slate-400 font-medium">{caseData?.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge color={caseData?.status} size="md" />
          {/** open the alert window  and change status */}
          <button onClick={() => setshowCaseClose(true)} 
          className={`flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-sm" ${hideButtons ? 'hidden' : ''}`}
          >
            close case
            <Info size={16} />
          </button>
        </div>
      </div>

      {/* 2. CASE INFO & PERSONNEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Compact Metadata */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-blue-500">
            <div className="p-2.5 bg-blue-50 rounded-xl"><FileText size={18} /></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Classification</span>
              <span className="text-sm font-semibold">{caseData?.types}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-emerald-500">
            <div className="p-2.5 bg-emerald-50 rounded-xl"><Calendar size={18} /></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Created Date</span>
              <span className="text-sm font-semibold">{new Date(caseData?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Floating Personnel Dropdown Search */}
        <div className="md:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Personnel assigned</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-300" size={14} />
              <input
                value={officerSearch}
                onChange={e => setOfficerSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs w-48 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Assign Officer..."
              />
              {officerSearch.length > 1 && (
                <div className="absolute z-[100] right-0 mt-3 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl animate-in zoom-in-95">
                  {isSearching ? <div className="p-4 text-center"><Loader2 size={16} className="animate-spin inline text-blue-500" /></div> :
                    officerResults?.map((off: any) => (
                      <button key={off._id} onClick={() => handleOfficerSelect(off)} className="w-full p-4 hover:bg-slate-50 flex items-center justify-between border-b last:border-0 first:rounded-t-2xl last:rounded-b-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                            {off.name.charAt(0)}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-gray-900">{off.name}</p>
                            <p className="text-[10px] text-gray-500">{off.email}</p>
                          </div>
                        </div>
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-mono px-2 py-1 rounded-md border border-gray-200">
                          {off.badge}
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {caseData?.assignedOfficers?.map((off: any) => (
              <div key={off._id} className="flex items-center gap-3 bg-slate-50/50 pr-2 pl-1 py-1 rounded-full border border-slate-100 group">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center font-bold text-[9px] text-white shadow-sm uppercase">{off.name?.charAt(0)}</div>
                <span className="text-xs font-medium">{off.name}</span>
                {/* <button className="p-1 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button> */}
                <ShieldCheck size={14} className="text-blue-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. LOGISTICS FORM */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-2">
        <div className="flex items-center gap-3 border-b border-slate-50">
          <ClipboardList size={20} className="text-slate-300" />
          <h3 className="font-bold text-slate-800">Investigation Logistics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <input className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10" value={caseForm.description} onChange={e => setCaseForm({ ...caseForm, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Priority</label>
            <select
              className={`w-full border p-4 text-sm outline-none appearance-none rounded-2xl transition-colors font-bold shadow-lg 
    ${caseForm.priority === 'high'
                  ? 'bg-red-50 border-red-200 text-red-700 '
                  : caseForm.priority === 'medium'
                    ? 'bg-amber-50 border-amber-200 text-amber-700 '
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 '
                } `
              }
              value={caseForm.priority}
              onChange={e => setCaseForm({ ...caseForm, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Field Intelligence</label>
          <textarea className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-3 text-sm h-32 outline-none focus:ring-2 focus:ring-blue-500/10" rows={6} value={caseForm.notes} onChange={e => setCaseForm({ ...caseForm, notes: e.target.value })} placeholder="Record observations..." />
        </div>
        <div className="flex justify-end pt-1"><button onClick={() => updateCase.mutate(caseForm)} className={`bg-slate-900 text-white px-10 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all ${hideButtons ? 'hidden' : ''}`}>Synchronize record</button></div>
      </div>

      {/* 4. EVIDENCE CARDS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
              <Shield size={24} className="text-amber-500" /> Evidence vault
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Verified Assets Registry
            </p>
          </div>
          <button
            onClick={() => setShowEvidenceModal(true)}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 bg-amber-500 text-white px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 ${hideButtons ? 'hidden' : ''}`}
          >
            <Link2 size={16} /> Secure Asset
          </button>
        </div>
        {/* EVIDENCE VAULT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {caseData?.evidenceIds?.map((ev: any) => {

            // if (ev.status === 'unassigned') return null;
            let isActive = ev.status === 'active';

            return (
              <div
                key={ev._id}
                onClick={() => navigate(`/investigator/evidence/${ev.evidenceId}`)} // Navigate using DB ID
                className={`bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-blue-400 transition-all group cursor-pointer relative overflow-hidden flex flex-col justify-between h-full ${isActive ? 'shadow-xl shadow-green-200' : 'opacity-50'}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                      <div>
                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase w-fit ">
                          {ev.evidenceId}
                        </span> • &nbsp;
                        <StatusBadge color={ev.status === 'unassigned' ? 'inactive' : ev.status} status={ev.status} size="sm" />
                      </div>
                      <h4 className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {ev.title}
                      </h4>
                    </div>

                    {/* Quick Action Buttons - stopPropagation prevents navigation */}
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      {ev.status !== 'active' ? (
                        <button
                          title="Verify Evidence"
                          onClick={() => updateStatus.mutate({ id: ev._id, status: 'active', caseId: caseData.caseId })}
                          className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      ) : (
                        <button
                          title="Reject/Unassign"
                          onClick={() => updateStatus.mutate({ id: ev._id, status: 'unassigned' })}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <XCircle size={14} />
                        </button>)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mb-4">
                    <MapPin size={12} className="flex-shrink-0 text-slate-300" />
                    <span className="truncate">{ev.locationFound?.address || 'No Location Logged'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-50 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center text-[8px] font-black text-blue-600 uppercase border border-blue-100">
                        {ev.type?.charAt(0) || 'E'}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{ev.type}</span>
                    </div>

                    {/* CONSPICUOUS FO BADGE (UNIT) */}
                    <div className="flex items-center gap-1 bg-slate-900 text-white px-2 py-1 rounded-full shadow-sm">
                      <User size={10} className="text-blue-400" />
                      <span className="text-[9px] font-black tracking-widest uppercase">
                        {ev.submittedBy?.badge || ev.submittedByBadge || 'UNIT-000'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>


      </div>

      {/* 5. POI CARDS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
              <Users size={24} className="text-blue-500" /> Persons of Interest
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Linked Subjects & Witnesses
            </p>
          </div>
          <button
            onClick={() => {setShowPOIModal(true) }}
             className={`w-full sm:w-auto flex items-center justify-center gap-3 bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm ${hideButtons ? 'hidden' : ''}`}
          >
            <Plus size={16} /> Register Subject
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {caseData?.poiIds?.map((poi: any) => (
            <div
              key={poi._id}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-all group relative"
            >
              {/* TOP SECTION: Avatar, Info, and Corner Date */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex-shrink-0 flex items-center justify-center font-bold text-slate-300 text-xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors uppercase">
                  {poi.name?.charAt(0) || '?'}
                </div>

                {/* Name & Role Container */}
                <div className="flex-1 min-w-0 pr-16"> {/* pr-16 ensures text doesn't overlap the date */}
                  <h4 className="font-bold text-slate-900 leading-tight truncate">{poi.name}</h4>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">{poi.role}</p>
                </div>

                {/* B-Date in Top Right Corner */}
                <div className="absolute top-6 right-6 text-right">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={10} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                      {new Date(poi.dob).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* BOTTOM SECTION: Contact & Address */}
              <div className="space-y-2 pt-4 border-t border-slate-50">
                {poi.contact && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone size={12} className="text-slate-400" />
                    <span className="text-[11px] font-medium">{poi.contact}</span>
                  </div>
                )}

                {poi.address && (
                  <div className="flex items-start gap-2 text-slate-500">
                    <MapPin size={12} className="text-slate-400 mt-0.5" />
                    <span className="text-[11px] font-medium leading-relaxed">{poi.address}</span>
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-300 uppercase tracking-tighter">
                    Ref: {poi._id.slice(-8)}
                  </span>
                  {/* <button className="text-slate-200 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button> */}
                </div>
              </div>
            </div>

          ))}
        </div>
      </div>


      {/* MODAL: FULL POI FORM */}
      <Modal isOpen={showPOIModal} onClose={() => setShowPOIModal(false)} title="Register Investigation Subject">
        <form className="space-y-5" onSubmit={handlePOISubmit}>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
            <input className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10" required placeholder="John Doe" onChange={e => setNewPerson({ ...newPerson, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
              <input type="date" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" required onChange={e => setNewPerson({ ...newPerson, dob: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
              <select defaultValue={"Other"} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" onChange={e => setNewPerson({ ...newPerson, role: e.target.value })}>
                <option value="Suspect">Suspect</option>
                <option value="Witness">Witness</option>
                <option value="Victim">Victim</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Home size={10} /> Last Known Residence</label>
            <input className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" placeholder="Address" onChange={e => setNewPerson({ ...newPerson, address: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Phone size={10} /> Contact Intelligence</label>
            <input className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" placeholder="Phone or Email" onChange={e => setNewPerson({ ...newPerson, contact: e.target.value })} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest mt-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">Add to Record</button>
        </form>
      </Modal>
      {/* --- MODALS --- */}

      {/* EVIDENCE POOL MODAL */}
      <Modal isOpen={showEvidenceModal} onClose={() => setShowEvidenceModal(false)} title="Secure Investigative Evidence">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm" placeholder="Search by Asset ID or Found Location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {unassignedEvidence?.map((ev: any) => (
              <button
                key={ev._id}
                onClick={() => { updateStatus.mutate({ id: ev._id, status: 'active', caseId: caseData.caseId }); setShowEvidenceModal(false); }}
                className="w-full p-5 bg-white border border-gray-100 rounded-[1.5rem] hover:border-amber-500 hover:bg-amber-50 transition-all text-left flex justify-between items-center"
              >
                <div>
                  <p className="text-[10px] font-black text-amber-600 uppercase mb-1">{ev.evidenceId}</p>
                  <p className="text-sm font-bold text-gray-900">{ev.title}</p>
                  <p className="text-[12px] text-gray-700 font-bold mt-1 uppercase flex items-center gap-1"><User size={12} /> FO Unit: {ev.submittedByBadge || 'Assigned'} <MapPin size={12} className="inline text-gray-400" /> <span className="truncate"> {"(" + ev.locationFound?.lat + ', ' + ev.locationFound?.lng + ") " + ev.locationFound?.address.split(', ').slice(0, 1) || 'No Location Logged'}</span></p>
                </div>
                <Link2 size={18} className="text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      </Modal>
      {/* --- MODALS of Close Case --- */}
        <Modal isOpen={showCaseClose} onClose={() => setshowCaseClose(false)} title="Close Case Confirmation">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-red-500">
            <div className="p-3 bg-red-50 rounded-full">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Are you sure you want to close this case?</h3>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone. Make sure all necessary information is recorded before proceeding.</p>
              <button onClick={() => {caseClosed(true);setshowCaseClose(false)}} className="mt-4 inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-sm">
                Yes, Close Case
                <CheckCircle2 size={16} />
              </button>
              <button onClick={() => setshowCaseClose(false)} className="mt-4 ml-4 inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-gray-300 transition-all shadow-sm">
                No, Keep Open
                <XCircle size={16} />
              </button>
            </div>  
          </div>
          </div>
          </Modal>      
    </div>
  );
}
