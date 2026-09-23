import { useState, useEffect } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { translateStatus } from '../utils/translations';
import { useAuth } from '../contexts/AuthContext';

export default function TicketList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      if(user?.role === 'ADMIN'){
        const data = await ticketService.getTickets(0, 50); 
        setTickets(data.content || []);
      } else if (user?.role === 'TECHNICIAN'){
        const data = await ticketService.getTicketByTechnicianId(user?.id); 
        setTickets(data.content || []);
      } else{
        const data = await ticketService.getTicketByCustomerId(user?.id); 
        setTickets(data.content || []);
      }
    } catch (error) {
      console.error('Erro ao buscar chamados', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        setLoading(true);
        if (searchTerm) {
          const data = await ticketService.searchTickets(searchTerm, 0, 50);
          setTickets(data.content || []);
        } else {
          fetchTickets();
        }
      } catch (error) {
        console.error('Erro ao buscar', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Buscar chamados e aperte Enter..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200">
            <Filter size={20} />
            Filtros
          </button>
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
                    ${ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                    ${ticket.status === 'CLOSED' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' : ''}
                  `}>
                    {translateStatus(ticket.status)}
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

