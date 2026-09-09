"use client";

import { useState } from "react";
import { X, FileText, Download, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { ScheduleItem } from "./Dashboard";

interface ExportModalProps {
  onClose: () => void;
  schedule: ScheduleItem[];
  onExport: (start?: Date, end?: Date) => void;
}

export default function ExportModal({ onClose, schedule, onExport }: ExportModalProps) {
  const [mode, setMode] = useState<"all" | "range">("all");
  const [tempStart, setTempStart] = useState<Date | null>(null);
  const [tempEnd, setTempEnd] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [isExporting, setIsExporting] = useState(false);

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

  const isInRange = (date: Date) => {
    if (!tempStart || !tempEnd) return false;
    return date >= tempStart && date <= tempEnd;
  };

  const isEdgeDate = (date: Date) => {
    if (!tempStart || !tempEnd) return false;
    return date.getTime() === tempStart.getTime() || date.getTime() === tempEnd.getTime();
  };

  const days = getDaysInMonth(currentMonth);

  const handleExport = () => {
    if (isExporting) return;
    setIsExporting(true);
    
    if (mode === "all") {
      onExport();
    } else if (tempStart && tempEnd) {
      onExport(tempStart, tempEnd);
    }
    setIsExporting(false);
  };

  const canExport = mode === "all" || (tempStart && tempEnd);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 animate-in zoom-in-95 duration-300">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Export Schedule</h2>
                <p className="text-sm text-white/80 mt-0.5">Download as PDF with church template</p>
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
          {schedule.length === 0 ? (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="font-bold text-amber-700 text-xl">No Schedule Data</h3>
              <p className="text-amber-600 mt-2">
                Please generate a schedule first before exporting.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setMode("all")}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
                    mode === "all"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  Export All ({schedule.length})
                </button>
                <button
                  onClick={() => setMode("range")}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
                    mode === "range"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Download className="w-5 h-5" />
                  Date Range
                </button>
              </div>

              {mode === "range" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date
                      </label>
                      <button
                        onClick={() => setSelecting("start")}
                        className={`w-full px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
                          selecting === "start"
                            ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-lg shadow-emerald-100"
                            : "border-gray-200 hover:border-emerald-300 bg-white"
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
                            ? "border-cyan-500 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-lg shadow-cyan-100"
                            : "border-gray-200 hover:border-cyan-300 bg-white"
                        }`}
                      >
                        {tempEnd ? tempEnd.toLocaleDateString() : "Select end date"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-teal-50/30 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="p-2.5 hover:bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
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
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className="text-center text-xs font-bold text-gray-400 py-2">
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
                              className={`w-full h-full rounded-xl text-sm font-semibold transition-all duration-200 ${
                                isEdgeDate(date)
                                  ? "bg-gradient-to-br from-emerald-600 to-cyan-600 text-white shadow-lg scale-105 ring-4 ring-emerald-200"
                                  : isInRange(date)
                                  ? "bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700"
                                  : "hover:bg-gradient-to-br hover:from-gray-100 hover:to-teal-50 text-gray-700 hover:scale-105"
                              }`}
                            >
                              {date.getDate()}
                            </button>
                          ) : (
                            <div className="w-full h-full" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={!canExport || isExporting}
                  className={`flex-1 px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    !canExport || isExporting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-xl hover:shadow-emerald-200 hover:scale-[1.02]"
                  }`}
                >
                  <Download className="w-5 h-5" />
                  {isExporting ? "Generating..." : "Export PDF"}
                </button>
              </div>

              {mode === "range" && !tempStart && !tempEnd && (
                <p className="text-center text-sm text-gray-400">
                  Select start and end dates from the calendar above
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}