import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Circle, Clock, CheckCheck, CircleCheck } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function NotificationList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [user, currentPage, sortOrder, filterStatus]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const filter = {
        sort: `createdAt,${sortOrder.toLowerCase()}`
      };
      
      if (filterStatus === 'READ') filter.read = true;
      if (filterStatus === 'UNREAD') filter.read = false;

      if (user?.id && user?.role !== 'ADMIN') {
        filter.id = user?.id;
      }
      
      const data = await notificationService.getAllNotifications(currentPage, 10, filter);
      const list = data.content || data || [];
      
      const normalizedList = (Array.isArray(list) ? list : []).map(n => ({
        ...n,
        id: n.id || n.notificationId,
        read: n.read !== undefined ? n.read : (n.isRead === true)
      }));
      
      setNotifications(normalizedList);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Erro ao buscar notificações', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.readNotification(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Bell size={24} className="text-blue-600 dark:text-blue-400" />
            Minhas Notificações
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Acompanhe as atualizações dos seus chamados.
          </p>
        </div>
        <div className="flex gap-3">
          <select 
            value={sortOrder} 
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(0);
            }}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DESC">Mais recentes</option>
            <option value="ASC">Mais antigos</option>
          </select>
          <select 
            value={filterStatus} 
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(0);
            }}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todas</option>
            <option value="UNREAD">Não Lidas</option>
            <option value="READ">Lidas</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Carregando notificações...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center">
            <Bell size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
            <p>Você não possui nenhuma notificação {filterStatus === 'READ' ? 'lida' : filterStatus === 'UNREAD' ? 'não lida' : ''} no momento.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`p-6 transition-colors ${
                  notification.read 
                    ? 'bg-slate-50/50 dark:bg-slate-900/30' 
                    : 'bg-white dark:bg-slate-800 border-l-4 border-l-blue-500'
                }`}
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    {notification.read ? (
                      <CircleCheck size={20} className="text-slate-400 dark:text-slate-500" />
                    ) : (
                      <Circle size={20} className="text-blue-500 fill-blue-50 dark:fill-blue-900/30" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-base font-medium ${notification.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {notification.message}
                    </h3>
                    
                    <div className="mt-2 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {notification.createdAt ? new Date(notification.createdAt).toLocaleString('pt-BR') : '-'}
                      </span>
                      {notification.ticketId && (
                        <Link 
                          to={`/tickets/${notification.ticketId}`} 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                        >
                          Ver Chamado #{notification.ticketId}
                        </Link>
                      )}
                      {!notification.read ? (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center gap-1 ml-auto"
                        >
                          <CheckCircle2 size={14} />
                          Marcar como lida
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 ml-auto text-green-600 dark:text-green-500 font-medium">
                          <CheckCheck size={16} />
                          Lida
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(0)}
                className="hidden sm:block px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Primeira
              </button>
              <button 
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Anterior
              </button>
            </div>
            
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Página {currentPage + 1} de {totalPages}
            </span>
            
            <div className="flex gap-2">
              <button 
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Próxima
              </button>
              <button 
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage(totalPages - 1)}
                className="hidden sm:block px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Última
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

