import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { translatePriority, translateStatus } from '../utils/translations';
import { useAuth } from '../contexts/AuthContext';

export default function TicketList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, [user, statusFilter, priorityFilter, categoryFilter]);

  const fetchTickets = async (overrideSearchTerm = null) => {
    try {
      setLoading(true);
      
      const filters = {};
      
      if (user?.role === 'TECHNICIAN') {
        filters.technicianId = user?.id;
      } else if (user?.role === 'CLIENT') {
        filters.customerId = user?.id;
      }
      
      const currentSearch = overrideSearchTerm !== null ? overrideSearchTerm : searchTerm;
      if (currentSearch) filters.title = currentSearch;
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      if (categoryFilter) filters.category = categoryFilter;

      const data = await ticketService.getTickets(0, 50, filters); 
      setTickets(data.content || []);
    } catch (error) {
      console.error('Erro ao buscar chamados', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      fetchTickets();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="Buscar chamados..." 
              className="w-full pl-4 pr-10 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                if (value === '') {
                  fetchTickets('');
                }
              }}
              onKeyDown={handleSearch}
            />
            <button 
              onClick={() => fetchTickets()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
          
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
          >
            <option value="">Status (Todos)</option>
            <option value="OPEN">Aberto</option>
            <option value="IN_PROGRESS">Em Atendimento</option>
            <option value="WAITING">Aguardando</option>
            <option value="RESOLVED">Resolvido</option>
            <option value="CLOSED">Finalizado</option>
          </select>

          <select 
            value={priorityFilter} 
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
          >
            <option value="">Prioridade (Todas)</option>
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Crítica</option>
          </select>

          <select 
            value={categoryFilter} 
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
          >
            <option value="">Categoria (Todas)</option>
            <option value="HARDWARE">Hardware</option>
            <option value="SOFTWARE">Software</option>
            <option value="NETWORK">Rede</option>
          </select>
        </div>
        
        {user?.role === 'CLIENT' && (<Link 
          to="/tickets/new" 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Novo Chamado
        </Link>)}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Título</th>
              <th className="p-4 font-medium">Cliente ID</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Categoria</th>
              <th className="p-4 font-medium">Prioridade</th>
              <th className="p-4 font-medium">Data</th>
              <th className="p-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">Carregando chamados...</td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">Nenhum chamado encontrado.</td>
              </tr>
            ) : tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm text-slate-700 dark:text-slate-300">
                <td className="p-4 font-medium text-slate-900 dark:text-white">#{ticket.id}</td>
                <td className="p-4">{ticket.title}</td>
                <td className="p-4">{ticket.customerId}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                    ${ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                    ${ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                    ${ticket.status === 'WAITING' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                    ${ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                    ${ticket.status === 'CLOSED' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' : ''}
                  `}>
                    {translateStatus(ticket.status)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                    ${ticket.category === 'SOFTWARE' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                    ${ticket.category === 'HARDWARE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                    ${ticket.category === 'NETWORK' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                  `}>
                    {ticket.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                    ${ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                    ${ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                    ${ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                    ${ticket.priority === 'LOW' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' : ''}
                  `}>
                    {translatePriority(ticket.priority)}
                  </span>
                </td>
                <td className="p-4 text-slate-500 dark:text-slate-400">
                  {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-right">
                  <Link to={`/tickets/${ticket.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                    Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

