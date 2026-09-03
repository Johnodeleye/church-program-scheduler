import { ScheduleItem } from "./Dashboard";
import { Edit, Calendar, Clock, Trash2 } from "lucide-react";

interface ScheduleTableProps {
  schedule: ScheduleItem[];
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

export default function ScheduleTable({ schedule, onEdit, onDelete }: ScheduleTableProps) {
  if (schedule.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-12 text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No Schedule Created Yet
        </h3>
        <p className="text-gray-600 mb-6">
          Click the <span className="font-semibold text-blue-600">Auto-Generate</span> button to create your schedule
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Generate all Mondays & Fridays for any date range</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden relative">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                S/N
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Lead Minister
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Praise/Worship
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Closing Prayer
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedule.map((item, index) => (
              <tr 
                key={item.id}
                className={`hover:bg-blue-50/50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-600">
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
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.dayType === 'Monday' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {item.dayType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.leadMinister || <span className="text-gray-400">—</span>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.praiseWorship || <span className="text-gray-400">—</span>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.closingPrayer || <span className="text-gray-400">—</span>}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all group"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 group-hover:scale-110 transition" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all group"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition" />
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