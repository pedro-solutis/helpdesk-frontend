import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, FileText, Info, Ticket, Trash } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    total: 0,
    open: 0,
    in_progess: 0,
    resolved: 0,
    critical: 0
  });
  const [tickets, setTickets] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchTickets();
  }, [user]);

  const fetchMetrics = async () => {
      try {
        const data = await ticketService.getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Erro ao buscar métricas', error);
      }finally{
        setLoadingMetrics(false);
      }
  };

  const fetchTickets = async () =>{
    try {
      if (user?.role === 'ADMIN'){
        const data = await ticketService.getTickets(0, 5);
        setTickets(data.content || []);
      }else if (user?.role === 'TECHNICIAN'){
        const data = await ticketService.getTicketByTechnicianId(user?.id);
        setTickets(data.content || []);
      }else {
        const data = await ticketService.getTicketByCustomerId(user?.id);
        setTickets(data.content || []);
      }
    } catch (error) {
      console.log('Erro ao buscar tickets', error);
      setTickets([]);
    }finally{
      setLoadingTickets(false);
    }
  }

  const statCards = [
    { title: 'Total de Chamados', value: metrics.total, icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Abertos', value: metrics.open, icon: Ticket, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { title: 'Em Atendimento', value: metrics.in_progess, icon: Clock, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'Resolvidos', value: metrics.resolved, icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Criticos', value: metrics.critical, icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' }
  ];

  if (loadingMetrics) {
    return <div className="p-8 text-center text-slate-500">Carregando dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} transition-colors duration-200`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Chamados Recentes</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Título</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Data</th>
              <th className="p-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            { loadingTickets ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">Carregando chamados...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">Nenhum chamado encontrado.</td>
                </tr>
              ) : tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm text-slate-700 dark:text-slate-300">
                <td className="p-4 font-medium text-slate-900 dark:text-white">#{ticket.id}</td>
                <td className="p-4">{ticket.title}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                    {ticket.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500 dark:text-slate-400">
                  {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td className="p-4 text-right">
                  <Link to={`/tickets/${ticket.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                    <Info size={20}/>
                    Detalhes
                  </Link>
                  {user?.role !== 'TECHNICIAN' && (
                    <Link to={`/tickets/${ticket.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                      <Trash size={20}/>
                      Deletar
                    </Link>
                  )}
                </td>
              </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

