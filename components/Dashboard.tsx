"use client";

import { useState, useRef, useEffect } from "react";
import Header from "./Header";
import ScheduleTable from "./ScheduleTable";
import AutoGenerateModal from "./AutoGenerateModal";
import EditRowModal from "./EditRowModal";
import AddDatesModal from "./AddDatesModal";
import ExportModal from "./ExportModal";
import html2pdf from "html2pdf.js";

export interface ScheduleItem {
  id: string;
  date: Date;
  dayType: "Monday" | "Friday";
  leadMinister: string;
  praiseWorship: string;
  closingPrayer: string;
}

export default function Dashboard() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAutoGenerate, setShowAutoGenerate] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddDates, setShowAddDates] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schedule');
      const result = await response.json();
      
      if (result.success) {
        const formattedData = result.data.map((item: any) => ({
          id: item._id,
          date: new Date(item.date),
          dayType: item.dayType,
          leadMinister: item.leadMinister || '',
          praiseWorship: item.praiseWorship || '',
          closingPrayer: item.closingPrayer || '',
        }));
        setSchedule(formattedData);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      alert('Failed to load schedules. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const isDateExists = (dateToCheck: Date): boolean => {
    return schedule.some(item => {
      const existingDate = new Date(item.date);
      return existingDate.getFullYear() === dateToCheck.getFullYear() &&
             existingDate.getMonth() === dateToCheck.getMonth() &&
             existingDate.getDate() === dateToCheck.getDate();
    });
  };

  const generateDates = (startDate: Date, endDate: Date) => {
    const dates: ScheduleItem[] = [];
    let current = new Date(startDate);
    
    while (current <= endDate) {
      const day = current.getDay();
      if (day === 1 || day === 5) {
        if (!isDateExists(current)) {
          dates.push({
            id: `${current.getTime()}-${Math.random()}`,
            date: new Date(current),
            dayType: day === 1 ? "Monday" : "Friday",
            leadMinister: "",
            praiseWorship: "",
            closingPrayer: "",
          });
        }
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const getExistingDatesInRange = (startDate: Date, endDate: Date): Date[] => {
    const existing: Date[] = [];
    let current = new Date(startDate);
    
    while (current <= endDate) {
      const day = current.getDay();
      if (day === 1 || day === 5) {
        if (isDateExists(current)) {
          existing.push(new Date(current));
        }
      }
      current.setDate(current.getDate() + 1);
    }
    return existing;
  };

  const saveToDatabase = async (schedules: ScheduleItem[]) => {
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedules }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to save');
      }
      
      return result;
    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
  };

  const updateInDatabase = async (id: string, data: Partial<ScheduleItem>) => {
    try {
      const response = await fetch(`/api/schedule/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update');
      }
      
      return result;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  };

  const deleteFromDatabase = async (id: string) => {
    try {
      const response = await fetch(`/api/schedule/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete');
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  };

  const handleAutoGenerate = async (start: Date, end: Date) => {
    const newDates = generateDates(start, end);
    
    if (newDates.length === 0) {
      const existingDates = getExistingDatesInRange(start, end);
      if (existingDates.length > 0) {
        const dateList = existingDates.map(d => 
          d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        ).join(', ');
        alert(`These dates already exist in your schedule:\n${dateList}\n\nPlease choose a different range.`);
      } else {
        alert('No new dates to add in this range!');
      }
      setShowAutoGenerate(false);
      return;
    }
    
    const totalPossible = getDaysCount(start, end);
    if (newDates.length < totalPossible) {
      const existingCount = totalPossible - newDates.length;
      if (existingCount > 0) {
        if (!confirm(`${existingCount} date(s) already exist in your schedule and will be skipped.\n\n${newDates.length} new date(s) will be added.\n\nContinue?`)) {
          return;
        }
      }
    }
    
    try {
      const result = await saveToDatabase(newDates);
      await fetchSchedules();
      setShowAutoGenerate(false);
      
      if (result.inserted > 0) {
        alert(`✅ Successfully added ${result.inserted} new date(s)!`);
      }
    } catch (error) {
      alert('Failed to save to database. Please try again.');
    }
  };

  const getDaysCount = (startDate: Date, endDate: Date): number => {
    let count = 0;
    let current = new Date(startDate);
    while (current <= endDate) {
      const day = current.getDay();
      if (day === 1 || day === 5) count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  const handleEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updated: ScheduleItem) => {
    try {
      await updateInDatabase(updated.id, {
        leadMinister: updated.leadMinister,
        praiseWorship: updated.praiseWorship,
        closingPrayer: updated.closingPrayer,
      });
      await fetchSchedules();
      setShowEditModal(false);
      setEditingItem(null);
    } catch (error) {
      alert('Failed to update. Please try again.');
    }
  };

  const handleAddDates = async (start: Date, end: Date) => {
    const existingDates = getExistingDatesInRange(start, end);
    const newDates = generateDates(start, end);
    
    if (newDates.length === 0) {
      if (existingDates.length > 0) {
        const dateList = existingDates.map(d => 
          d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        ).join(', ');
        alert(`❌ All dates in this range already exist!\n\nExisting dates:\n${dateList}\n\nPlease choose a different range.`);
      } else {
        alert('No new dates to add in this range!');
      }
      setShowAddDates(false);
      return;
    }

    if (existingDates.length > 0) {
      const dateList = existingDates.map(d => 
        d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      ).join(', ');
      
      const confirmMsg = `⚠️ Some dates already exist!\n\nExisting (will be skipped):\n${dateList}\n\nNew dates to add: ${newDates.length}\n\nContinue adding new dates?`;
      
      if (!confirm(confirmMsg)) {
        setShowAddDates(false);
        return;
      }
    }

    try {
      const result = await saveToDatabase(newDates);
      await fetchSchedules();
      setShowAddDates(false);
      
      if (existingDates.length > 0) {
        alert(`✅ Added ${newDates.length} new date(s)! (${existingDates.length} duplicate(s) skipped)`);
      } else {
        alert(`✅ Successfully added ${newDates.length} new date(s)!`);
      }
    } catch (error) {
      alert('Failed to save to database. Please try again.');
    }
  };

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear all schedule data from the database?")) {
      try {
        for (const item of schedule) {
          await deleteFromDatabase(item.id);
        }
        await fetchSchedules();
        alert('✅ All schedules cleared successfully!');
      } catch (error) {
        alert('Failed to clear schedules. Please try again.');
      }
    }
  };

  const handleDeleteRow = async (id: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteFromDatabase(id);
        await fetchSchedules();
      } catch (error) {
        alert('Failed to delete. Please try again.');
      }
    }
  };

  const generatePDF = (data: ScheduleItem[], start?: Date, end?: Date) => {
    if (data.length === 0) {
      alert("No data to export!");
      return;
    }

    const previewWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!previewWindow) {
      alert('Please allow popups to preview PDF');
      return;
    }

    // Calculate font size based on data length - SMALLER font for more rows
    let fontSize = 10;
    let padding = 4;
    if (data.length > 40) {
      fontSize = 7;
      padding = 2;
    } else if (data.length > 30) {
      fontSize = 8;
      padding = 3;
    } else if (data.length > 20) {
      fontSize = 9;
      padding = 3;
    }

    const tableRows = data.map((item, index) => `
      <tr>
        <td style="padding: ${padding}px 6px; border: 1px solid #ddd; text-align: center; font-size: ${fontSize}px;">${index + 1}</td>
        <td style="padding: ${padding}px 6px; border: 1px solid #ddd; font-size: ${fontSize}px;">${item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
        <td style="padding: ${padding}px 6px; border: 1px solid #ddd; text-align: center; font-size: ${fontSize}px;">${item.dayType}</td>
        <td style="padding: ${padding}px 6px; border: 1px solid #ddd; font-size: ${fontSize}px;">${item.leadMinister || '—'}</td>
        <td style="padding: ${padding}px 6px; border: 1px solid #ddd; font-size: ${fontSize}px;">${item.praiseWorship || '—'}</td>
        <td style="padding: ${padding}px 6px; border: 1px solid #ddd; font-size: ${fontSize}px;">${item.closingPrayer || '—'}</td>
      </tr>
    `).join('');

    previewWindow.document.write(`
      <html>
        <head>
          <title>RCCG David's Pavilion - Bible Study Schedule</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, Helvetica, sans-serif;
              background: white;
              padding: 0;
              margin: 0;
              display: flex;
              justify-content: center;
              min-height: 100vh;
            }
            .pdf-container {
              max-width: 1100px;
              width: 100%;
              background: white;
              padding: 10px 15px 10px 15px;
            }
            .header {
              text-align: center;
              margin-bottom: 6px;
              border-bottom: 2px solid #1a3a6b;
              padding-bottom: 6px;
            }
            .logo {
              width: 35px;
              height: 35px;
              margin: 0 auto 3px auto;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .logo img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .header h1 {
              font-size: 16px;
              color: #1a3a6b;
              margin: 0;
              letter-spacing: 1px;
            }
            .header h2 {
              font-size: 12px;
              color: #2a5a9b;
              margin: 1px 0;
              font-weight: normal;
            }
            .header p {
              font-size: 9px;
              color: #666;
              margin: 0;
            }
            .header .range {
              font-size: 8px;
              color: #999;
              margin-top: 1px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 6px;
            }
            th {
              background: #1a3a6b;
              color: white;
              padding: ${Math.max(4, padding + 2)}px 6px;
              border: 1px solid #1a3a6b;
              text-align: left;
              font-weight: bold;
              font-size: ${Math.max(8, fontSize)}px;
            }
            td {
              padding: ${padding}px 6px;
              border: 1px solid #ddd;
              font-size: ${fontSize}px;
            }
            tr:nth-child(even) {
              background: #f8f9fa;
            }
            .footer {
              text-align: center;
              margin-top: 6px;
              padding-top: 4px;
              border-top: 1px solid #ddd;
              font-size: 8px;
              color: #999;
            }
            .footer p {
              margin: 1px 0;
            }
          </style>
        </head>
        <body>
          <div class="pdf-container" id="pdf-content">
            <div class="header">
              <div class="logo">
                <img src="/rccg.png" alt="RCCG Logo" />
              </div>
              <h1>RCCG DAVID'S PAVILION</h1>
              <h2>BIBLE STUDY -- DIGGING DEEP</h2>
              <p>Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              ${start && end ? `<p class="range">Range: ${start.toLocaleDateString()} to ${end.toLocaleDateString()}</p>` : ''}
            </div>
            
            <table>
              <thead>
                <tr>
                  <th style="text-align: center; width: 5%;">S/N</th>
                  <th style="width: 20%;">Date</th>
                  <th style="text-align: center; width: 10%;">Day</th>
                  <th style="width: 22%;">Lead Minister</th>
                  <th style="width: 22%;">Praise/Worship</th>
                  <th style="width: 21%;">Closing Prayer</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            
            <div class="footer">
              <p>Total Sessions: ${data.length}</p>
              <p>© ${new Date().getFullYear()} RCCG David's Pavilion - All Rights Reserved</p>
            </div>
          </div>

          <script>
            function downloadPDF() {
              const element = document.getElementById('pdf-content');
              const opt = {
                margin: [3, 3, 3, 3],
                filename: 'RCCG_Schedule_${new Date().toISOString().split('T')[0]}.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                  scale: 1.5,
                  useCORS: true,
                  letterRendering: true,
                  width: 1100,
                  logging: false,
                  scrollY: 0,
                  windowHeight: element.scrollHeight
                },
                jsPDF: { 
                  unit: 'mm', 
                  format: 'a4', 
                  orientation: 'landscape' 
                },
                pagebreak: { mode: 'avoid-all' }
              };
              html2pdf().set(opt).from(element).save();
            }
          </script>
          <div style="text-align:center; margin-top:10px;">
            <button onclick="downloadPDF()" style="padding:8px 24px; background:#1a3a6b; color:white; border:none; border-radius:6px; font-size:13px; font-weight:bold; cursor:pointer;">
              📥 Download PDF
            </button>
            <p style="font-size:10px; color:#888; margin-top:3px;">Click the button above to download as PDF</p>
          </div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        </body>
      </html>
    `);

    previewWindow.document.close();
  };

  const handleExport = (start?: Date, end?: Date) => {
    let dataToExport = schedule;
    
    if (start && end) {
      dataToExport = schedule.filter(item => {
        const date = new Date(item.date);
        return date >= start && date <= end;
      });
    }

    if (dataToExport.length === 0) {
      alert("No data to export in the selected range!");
      return;
    }

    generatePDF(dataToExport, start, end);
    setShowExport(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-blue-600 font-semibold">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
      <Header 
        scheduleCount={schedule.length}
        onAutoGenerate={() => setShowAutoGenerate(true)}
        onAddDates={() => setShowAddDates(true)}
        onClearAll={handleClearAll}
        onExport={() => setShowExport(true)}
      />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 relative">
        {schedule.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="text-center select-none opacity-[0.08]">
              <img 
                src="/rccg.png" 
                alt="RCCG Logo" 
                className="w-48 h-48 sm:w-72 sm:h-72 object-contain mx-auto"
              />
            </div>
          </div>
        )}
        
        <div className="relative z-10">
          <ScheduleTable 
            schedule={schedule}
            onEdit={handleEdit}
            onDelete={handleDeleteRow}
          />
        </div>
      </div>

      {showAutoGenerate && (
        <AutoGenerateModal
          onClose={() => setShowAutoGenerate(false)}
          onGenerate={handleAutoGenerate}
        />
      )}

      {showEditModal && editingItem && (
        <EditRowModal
          item={editingItem}
          onClose={() => {
            setShowEditModal(false);
            setEditingItem(null);
          }}
          onSave={handleSaveEdit}
        />
      )}

      {showAddDates && (
        <AddDatesModal
          onClose={() => setShowAddDates(false)}
          onGenerate={handleAddDates}
        />
      )}

      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          schedule={schedule}
          onExport={handleExport}
        />
      )}
    </div>
  );
}