"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface AutoGenerateModalProps {
  onClose: () => void;
  onGenerate: (start: Date, end: Date) => void;
}

export default function AutoGenerateModal({ onClose, onGenerate }: AutoGenerateModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [tempStart, setTempStart] = useState<Date | null>(null);
  const [tempEnd, setTempEnd] = useState<Date | null>(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getDayColor = (day: number) => {
    if (day === 0) return "bg-gradient-to-br from-rose-500 to-pink-500";
    if (day === 1) return "bg-gradient-to-br from-blue-500 to-cyan-500";
    if (day === 3) return "bg-gradient-to-br from-emerald-500 to-teal-500";
    if (day === 5) return "bg-gradient-to-br from-violet-500 to-purple-500";
    return null;
  };

  const isHighlightedDay = (day: number) => {
    return day === 0 || day === 1 || day === 3 || day === 5;
  };

  const handleDateClick = (date: Date) => {
    if (selecting === "start") {
      setTempStart(date);
      if (tempEnd && date > tempEnd) {
        setTempEnd(null);
      }
    } else {
      if (tempStart && date < tempStart) {
        setTempStart(date);
      }
      setTempEnd(date);
    }
  };

  const handleConfirm = () => {
    if (tempStart && tempEnd) {
      onGenerate(tempStart, tempEnd);
    }
  };

  const isInRange = (date: Date) => {
    if (!tempStart || !tempEnd) return false;
    return date >= tempStart && date <= tempEnd;
  };

  const isEdgeDate = (date: Date) => {
    if (!tempStart || !tempEnd) return false;
    return date.getTime() === tempStart.getTime() || date.getTime() === tempEnd.getTime();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 animate-in zoom-in-95 duration-300">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl animate-pulse">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Auto-Generate Schedule</h2>
                <p className="text-sm text-white/80 mt-0.5">Smart schedule creation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <button
                onClick={() => setSelecting("start")}
                className={`w-full px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
                  selecting === "start"
                    ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-lg shadow-indigo-100"
                    : "border-gray-200 hover:border-indigo-300 bg-white"
                }`}
              >
                {tempStart ? tempStart.toLocaleDateString() : "Select start date"}
              </button>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <button
                onClick={() => setSelecting("end")}
                className={`w-full px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
                  selecting === "end"
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-lg shadow-purple-100"
                    : "border-gray-200 hover:border-purple-300 bg-white"
                }`}
              >
                {tempEnd ? tempEnd.toLocaleDateString() : "Select end date"}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2.5 hover:bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2.5 hover:bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-3">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
                <div key={day} className={`text-center text-xs font-bold py-2 ${
                  isHighlightedDay(idx) ? "text-purple-600" : "text-gray-400"
                }`}>
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => (
                <div key={index} className="aspect-square">
                  {date ? (
                    <button
                      onClick={() => handleDateClick(date)}
                      className={`w-full h-full rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                        isEdgeDate(date)
                          ? "bg-gradient-to-br from-indigo-600 to-pink-600 text-white shadow-lg scale-105 ring-4 ring-purple-200"
                          : isInRange(date)
                          ? "bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700"
                          : "hover:bg-gradient-to-br hover:from-gray-100 hover:to-purple-50 text-gray-700 hover:scale-105"
                      } ${
                        isHighlightedDay(date.getDay())
                          ? "ring-2 ring-purple-300/30"
                          : ""
                      }`}
                    >
                      {date.getDate()}
                      {getDayColor(date.getDay()) && (
                        <span className={`absolute top-0 right-0 w-2 h-2 ${getDayColor(date.getDay())} rounded-full ring-2 ring-white shadow-sm`} />
                      )}
                    </button>
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-6 text-xs flex-wrap justify-center">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
                <span className="w-3 h-3 rounded-full bg-gradient-to-br from-rose-500 to-pink-500" />
                Sunday
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
                <span className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500" />
                Monday
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
                <span className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500" />
                Wednesday
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
                <span className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-500 to-purple-500" />
                Friday
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!tempStart || !tempEnd}
              className={`flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                !tempStart || !tempEnd
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-xl hover:shadow-purple-200 hover:scale-[1.02]"
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}