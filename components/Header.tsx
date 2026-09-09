import Image from "next/image";
import { 
  Sparkles, 
  LogOut, 
  Trash2,
  FileText,
  Plus,
  Loader2
} from "lucide-react";

interface HeaderProps {
  scheduleCount: number;
  onAutoGenerate: () => void;
  onAddDates: () => void;
  onClearAll: () => void;
  onExport: () => void;
  isDeletingAll?: boolean;
}

export default function Header({ 
  scheduleCount, 
  onAutoGenerate, 
  onAddDates,
  onClearAll,
  onExport,
  isDeletingAll = false
}: HeaderProps) {
  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-purple-100/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-50" />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Image
                  src="/rccg.png"
                  alt="RCCG Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight truncate">
                RCCG David's Pavilion
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500" />
                <span className="truncate">Bible Study - Digging Deep</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:block bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-xl text-sm font-bold text-purple-700 border border-purple-200">
              {scheduleCount} Sessions
            </div>
            
            <button
              onClick={onExport}
              className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all duration-200 hover:scale-105"
              title="Export PDF"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={onAutoGenerate}
              className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all duration-200 hover:scale-105"
              title="Auto-Generate"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={onAddDates}
              className="p-2.5 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 hover:scale-105"
              title="Add Dates"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => {
                localStorage.removeItem('rccg_auth');
                window.location.reload();
              }}
              className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 hover:scale-105"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={onClearAll}
              disabled={isDeletingAll}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                isDeletingAll 
                  ? 'bg-red-100 text-red-400 cursor-not-allowed' 
                  : 'bg-gradient-to-br from-red-500 to-pink-500 text-white hover:shadow-lg hover:shadow-red-200 hover:scale-105'
              }`}
              title="Clear All"
            >
              {isDeletingAll ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}