import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineWrenchScrewdriver, HiOutlinePlus, HiOutlineXMark,
  HiOutlineBolt, HiOutlineAdjustmentsHorizontal, HiOutlineClock,
  HiOutlineCheckCircle, HiOutlineArrowPath,
  HiOutlineExclamationTriangle, HiOutlineUserCircle,
  HiOutlineCamera,
} from 'react-icons/hi2';

const statusFlow = ['raised', 'assigned', 'in-progress', 'resolved'];
const statusColors = {
  raised: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  assigned: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'in-progress': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};
const priorityColors = {
  low: 'text-surface-500', medium: 'text-amber-500', high: 'text-orange-500', urgent: 'text-red-500',
};
const categoryEmojis = {
  plumbing: '🔧', electrical: '⚡', cleaning: '🧹', furniture: '🪑', appliance: '📱', internet: '🌐', other: '📋',
};

const demoTickets = [
  { _id: '1', title: 'Tap leaking in bathroom', description: 'The hot water tap in my bathroom has been leaking since yesterday morning. Water is pooling on the floor.',
    category: 'plumbing', priority: 'high', status: 'assigned', assignedTo: 'Ramu (Plumber)',
    resident: { name: 'Amit Sharma' }, room: { roomNumber: 'A-102' }, property: { title: 'Sunrise PG' },
    createdAt: '2026-04-06T10:30:00Z' },
  { _id: '2', title: 'WiFi not working on 2nd floor', description: 'Internet connectivity is down on the entire second floor since last night.',
    category: 'internet', priority: 'urgent', status: 'in-progress', assignedTo: 'ACT Technician',
    resident: { name: 'Rahul Verma' }, room: { roomNumber: 'A-201' }, property: { title: 'Sunrise PG' },
    createdAt: '2026-04-05T18:00:00Z' },
  { _id: '3', title: 'AC making noise', description: 'The air conditioner in my room is making a loud buzzing noise when turned on.',
    category: 'appliance', priority: 'medium', status: 'raised',
    resident: { name: 'Priya Patel' }, room: { roomNumber: 'B-101' }, property: { title: 'Sunrise PG' },
    createdAt: '2026-04-07T08:15:00Z' },
  { _id: '4', title: 'Light bulb replacement', description: 'The ceiling light in my room has fused.',
    category: 'electrical', priority: 'low', status: 'resolved', assignedTo: 'Suresh (Electrician)',
    resident: { name: 'Neha Gupta' }, room: { roomNumber: 'B-201' }, property: { title: 'Sunrise PG' },
    createdAt: '2026-04-03T14:00:00Z' },
];

const Maintenance = () => {
  const { isOwner, isAdmin, isResident } = useAuth();
  const [tickets, setTickets] = useState(demoTickets);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', category: 'other', priority: 'medium' });

  const filteredTickets = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    setNewTicket({ title: '', description: '', category: 'other', priority: 'medium' });
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-surface-900 dark:text-white">
              Maintenance Desk
            </h1>
            <p className="text-surface-500 mt-1">Track and manage service requests</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <HiOutlinePlus className="w-5 h-5" />
            Raise Ticket
          </button>
        </div>

        {/* Status Pipeline */}
        <div className="glass-card p-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                filter === 'all' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              All ({tickets.length})
            </button>
            {statusFlow.map((status) => {
              const count = tickets.filter((t) => t.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all capitalize ${
                    filter === status ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  {status.replace('-', ' ')} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Tickets */}
        <div className="space-y-4">
          {filteredTickets.map((ticket, i) => {
            const currentStep = statusFlow.indexOf(ticket.status);

            return (
              <div
                key={ticket._id}
                className="glass-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${(i + 2) * 0.08}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{categoryEmojis[ticket.category]}</span>
                      <h3 className="font-display font-bold text-surface-900 dark:text-white">{ticket.title}</h3>
                      <span className={`badge ${statusColors[ticket.status]} capitalize`}>
                        {ticket.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-surface-500 mb-3">{ticket.description}</p>

                    <div className="flex flex-wrap gap-3 text-xs text-surface-500">
                      <span className="flex items-center gap-1">
                        <HiOutlineUserCircle className="w-3.5 h-3.5" />
                        {ticket.resident.name}
                      </span>
                      <span>Room {ticket.room.roomNumber}</span>
                      <span className={`font-semibold capitalize ${priorityColors[ticket.priority]}`}>
                        <HiOutlineExclamationTriangle className="w-3.5 h-3.5 inline" /> {ticket.priority}
                      </span>
                      {ticket.assignedTo && (
                        <span className="text-primary-600 dark:text-primary-400">
                          Assigned: {ticket.assignedTo}
                        </span>
                      )}
                      <span>
                        <HiOutlineClock className="w-3.5 h-3.5 inline" /> {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status pipeline visual */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {statusFlow.map((step, idx) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          idx <= currentStep
                            ? 'bg-primary-500 text-white'
                            : 'bg-surface-200 dark:bg-surface-700 text-surface-400'
                        }`}>
                          {idx <= currentStep ? '✓' : idx + 1}
                        </div>
                        {idx < statusFlow.length - 1 && (
                          <div className={`w-6 h-0.5 ${
                            idx < currentStep ? 'bg-primary-500' : 'bg-surface-200 dark:bg-surface-700'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* New Ticket Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="glass-card w-full max-w-lg p-8 animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white">Raise New Ticket</h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                  <HiOutlineXMark className="w-5 h-5 text-surface-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Title</label>
                  <input value={newTicket.title} onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} className="input-field" placeholder="Brief description of the issue" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Description</label>
                  <textarea value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} className="input-field min-h-[100px] resize-none" placeholder="Detailed description..." required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Category</label>
                    <select value={newTicket.category} onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })} className="input-field">
                      {Object.entries(categoryEmojis).map(([key, emoji]) => (
                        <option key={key} value={key}>{emoji} {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Priority</label>
                    <select value={newTicket.priority} onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })} className="input-field">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
                  <HiOutlineCamera className="w-8 h-8 text-surface-400 mx-auto mb-2" />
                  <p className="text-sm text-surface-500">Upload photo or 5-sec video</p>
                  <p className="text-xs text-surface-400 mt-1">Drag & drop or click to browse</p>
                </div>
                <button type="submit" className="btn-primary w-full py-3">Submit Ticket</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
