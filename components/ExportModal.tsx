"use client";

import { useState } from "react";
import { X, FileText, Calendar, Download, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
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

  const isSelected = (date: Date) => {
    if (!tempStart || !tempEnd) return false;
    const d = new Date(date);
    const start = new Date(tempStart);
    const end = new Date(tempEnd);
    return d >= start && d <= end;
  };

  const isInRange = (date: Date) => {
    if (!tempStart || !tempEnd) return false;
    const d = new Date(date);
    const start = new Date(tempStart);
    const end = new Date(tempEnd);
    return d >= start && d <= end;
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Export Schedule</h2>
              <p className="text-sm text-gray-500">Export as PDF with church template</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {schedule.length === 0 ? (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="font-bold text-amber-700 text-lg">No Schedule Data</h3>
              <p className="text-amber-600 text-sm mt-1">
                Please generate a schedule first before exporting.
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-3">
                <button
                  onClick={() => setMode("all")}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                    mode === "all"
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Export All ({schedule.length})
                </button>
                <button
                  onClick={() => setMode("range")}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                    mode === "range"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Date Range
                </button>
              </div>

              {mode === "range" && (
                <>
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Start Date
                      </label>
                      <button
                        onClick={() => setSelecting("start")}
                        className={`w-full px-4 py-2.5 rounded-xl border-2 text-left transition ${
                          selecting === "start"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {tempStart ? tempStart.toLocaleDateString() : "Select date"}
                      </button>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        End Date
                      </label>
                      <button
                        onClick={() => setSelecting("end")}
                        className={`w-full px-4 py-2.5 rounded-xl border-2 text-left transition ${
                          selecting === "end"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {tempEnd ? tempEnd.toLocaleDateString() : "Select date"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="p-2 hover:bg-white rounded-xl transition"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </h3>
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="p-2 hover:bg-white rounded-xl transition"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-400 py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {days.map((date, index) => (
                        <div key={index} className="aspect-square p-1">
                          {date ? (
                            <button
                              onClick={() => handleDateClick(date)}
                              className={`w-full h-full rounded-xl text-sm font-medium transition-all relative ${
                                isSelected(date)
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                                  : isInRange(date)
                                  ? "bg-blue-100 text-blue-700"
                                  : "hover:bg-blue-50 text-gray-700"
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

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={!canExport || isExporting}
                  className={`flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                    !canExport || isExporting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg hover:shadow-green-200"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? "Generating..." : "Export PDF"}
                </button>
              </div>

              {mode === "range" && !tempStart && !tempEnd && (
                <p className="text-center text-xs text-gray-400">
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