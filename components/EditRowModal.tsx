"use client";

import { useState } from "react";
import { X, Save, User, Music, Church, Loader2 } from "lucide-react";
import { ScheduleItem } from "./Dashboard";

interface EditRowModalProps {
  item: ScheduleItem;
  onClose: () => void;
  onSave: (item: ScheduleItem) => void;
  isSaving?: boolean;
}

export default function EditRowModal({ 
  item, 
  onClose, 
  onSave,
  isSaving = false
}: EditRowModalProps) {
  const [form, setForm] = useState({
    leadMinister: item.leadMinister || "",
    praiseWorship: item.praiseWorship || "",
    closingPrayer: item.closingPrayer || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      ...form,
    });
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-white/20 animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Session</h2>
              <p className="text-sm text-white/80 mt-1">
                {item.date.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })} - {item.dayType}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 text-blue-500" />
              Lead Minister
            </label>
            <input
              type="text"
              value={form.leadMinister}
              onChange={(e) => setForm({ ...form, leadMinister: e.target.value })}
              disabled={isSaving}
              className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 disabled:opacity-50"
              placeholder="Enter lead minister name"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Music className="w-4 h-4 text-purple-500" />
              Praise/Worship
            </label>
            <input
              type="text"
              value={form.praiseWorship}
              onChange={(e) => setForm({ ...form, praiseWorship: e.target.value })}
              disabled={isSaving}
              className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 disabled:opacity-50"
              placeholder="Enter praise/worship leader"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Church className="w-4 h-4 text-pink-500" />
              Closing Prayer
            </label>
            <input
              type="text"
              value={form.closingPrayer}
              onChange={(e) => setForm({ ...form, closingPrayer: e.target.value })}
              disabled={isSaving}
              className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-200 text-gray-900 disabled:opacity-50"
              placeholder="Enter closing prayer minister"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-purple-200 hover:scale-[1.02]'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}