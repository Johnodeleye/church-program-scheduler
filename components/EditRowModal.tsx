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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Session</h2>
            <p className="text-xs text-gray-500">
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
            className="p-1.5 hover:bg-gray-100 rounded-xl transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <User className="w-3.5 h-3.5 inline mr-1.5 text-blue-500" />
              Lead Minister
            </label>
            <input
              type="text"
              value={form.leadMinister}
              onChange={(e) => setForm({ ...form, leadMinister: e.target.value })}
              disabled={isSaving}
              className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-gray-900 text-sm disabled:opacity-50"
              placeholder="Enter lead minister name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <Music className="w-3.5 h-3.5 inline mr-1.5 text-blue-500" />
              Praise/Worship
            </label>
            <input
              type="text"
              value={form.praiseWorship}
              onChange={(e) => setForm({ ...form, praiseWorship: e.target.value })}
              disabled={isSaving}
              className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-gray-900 text-sm disabled:opacity-50"
              placeholder="Enter praise/worship leader"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <Church className="w-3.5 h-3.5 inline mr-1.5 text-blue-500" />
              Closing Prayer
            </label>
            <input
              type="text"
              value={form.closingPrayer}
              onChange={(e) => setForm({ ...form, closingPrayer: e.target.value })}
              disabled={isSaving}
              className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-gray-900 text-sm disabled:opacity-50"
              placeholder="Enter closing prayer minister"
            />
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-1.5 text-sm ${
                isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-blue-200'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
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