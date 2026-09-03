import Image from "next/image";
import { 
  Sparkles, 
  LogOut, 
  Trash2,
  FileText,
  Plus,
  Calendar
} from "lucide-react";

interface HeaderProps {
  scheduleCount: number;
  onAutoGenerate: () => void;
  onAddDates: () => void;
  onClearAll: () => void;
  onExport: () => void;
}

export default function Header({ 
  scheduleCount, 
  onAutoGenerate, 
  onAddDates,
  onClearAll,
  onExport
}: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-blue-100/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-md" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Image
                  src="/rccg.png"
                  alt="RCCG Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight truncate">
                RCCG David's Pavilion
              </h1>
              <p className="text-[10px] sm:text-xs text-blue-600 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="truncate">Bible Study - Digging Deep</span>
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 hidden sm:inline" />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="hidden sm:block bg-blue-50 px-2 py-1 rounded-lg text-xs font-medium text-blue-700">
              {scheduleCount} Sessions
            </div>
            
            <button
              onClick={onExport}
              className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all"
              title="Export PDF"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={onAutoGenerate}
              className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all"
              title="Auto-Generate"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={onAddDates}
              className="p-2 bg-white border-2 border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all"
              title="Add Dates"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
  onClick={() => {
    localStorage.removeItem('rccg_auth');
    window.location.reload();
  }}
  className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
  title="Logout"
>
  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
</button>

            <button
              onClick={onClearAll}
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Clear All"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}