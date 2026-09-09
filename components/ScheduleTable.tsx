import { ScheduleItem } from "./Dashboard";
import { Edit, Calendar, Clock, Trash2, Loader2 } from "lucide-react";

interface ScheduleTableProps {
  schedule: ScheduleItem[];
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
  deletingRowId?: string | null;
}

export default function ScheduleTable({ 
  schedule, 
  onEdit, 
  onDelete,
  deletingRowId = null
}: ScheduleTableProps) {
  if (schedule.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12 text-center">
        <div className="w-28 h-28 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Calendar className="w-14 h-14 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          No Schedule Created Yet
        </h3>
        <p className="text-gray-600 mb-6 text-lg">
          Click the <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Auto-Generate</span> button to create your schedule
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Generate all Sundays, Mondays, Wednesdays & Fridays for any date range</span>
        </div>
      </div>
    );
  }

  const getDayColor = (dayType: string) => {
    switch(dayType) {
      case 'Sunday': return 'bg-gradient-to-br from-rose-100 to-pink-100 text-rose-700';
      case 'Monday': return 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700';
      case 'Wednesday': return 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700';
      case 'Friday': return 'bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                S/N
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Lead Minister
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Praise/Worship
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Closing Prayer
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedule.map((item, index) => (
              <tr 
                key={item.id}
                className={`hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                } ${deletingRowId === item.id ? 'opacity-50' : ''}`}
              >
                <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${getDayColor(item.dayType)}`}>
                    {item.dayType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {item.leadMinister || <span className="text-gray-400">—</span>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {item.praiseWorship || <span className="text-gray-400">—</span>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {item.closingPrayer || <span className="text-gray-400">—</span>}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      disabled={deletingRowId === item.id}
                      className={`p-2 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-200 hover:scale-110 group ${
                        deletingRowId === item.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      disabled={deletingRowId === item.id}
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 group ${
                        deletingRowId === item.id 
                          ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                          : 'bg-gradient-to-br from-red-500 to-pink-500 text-white hover:shadow-lg hover:shadow-red-200'
                      }`}
                      title="Delete"
                    >
                      {deletingRowId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}