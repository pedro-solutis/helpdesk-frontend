import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, AlertCircle, Edit2, Check, X, Settings2, Trash } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { translatePriority, translateStatus } from '../utils/translations';

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState([]);

  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  // Intents
  const [intentTech, setIntentTech] = useState(false);
  const [intentStatus, setIntentStatus] = useState(false);
  const [intentPriority, setIntentPriority] = useState(false);

  // Loadings
  const [savingTech, setSavingTech] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPriority, setSavingPriority] = useState(false);

  // States for description editing
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [savingDesc, setSavingDesc] = useState(false);

  useEffect(() => {
    fetchTicket();
    if (user?.role === 'ADMIN') {
      fetchTechnicians();
    }
  }, [id, user]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketById(id);
      setTicket(data);
      setSelectedStatus(data.status);
      setSelectedPriority(data.priority);
      setSelectedTechnician(data.technicianId || '');
      setNewDesc(data.description);
      
      if (data.customerId) {
        fetchClient(data.customerId);
      }

      if (data.technicianId){
        fetchTechnician(data.technicianId);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do chamado', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClient = async (customerId) => {
    try {
      const data = await userService.getUserById(customerId);
      setCustomer(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTechnician = async (technicianId) => {
    try {
      const data = await userService.getUserById(technicianId);
      setTechnician(data);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchTechnicians = async () => {
    try {
      const data = await userService.getByTechnicians();
      setTechnicians(data.content || []);
    } catch(error) {
      console.error('Erro ao buscar os técnicos disponíveis');
    }
  };

  const handleSaveDescription = async () => {
    try {
      setSavingDesc(true);
      await ticketService.updateTicket(id, {
        description: newDesc,
        category: ticket.category,
        status: ticket.status,
        priority: ticket.priority
      });
      setIsEditingDesc(false);
      fetchTicket();
    } catch (error) {
      console.error('Erro ao atualizar descrição', error);
      alert('Erro ao atualizar descrição.');
    } finally {
      setSavingDesc(false);
    }
  };

  const handleAssignTechnician = async () => {
    try {
      setSavingTech(true);
      if (selectedTechnician) {
        await ticketService.assignTechnician(id, parseInt(selectedTechnician, 10));
        alert('Técnico atribuído com sucesso!');
        setIntentTech(false);
        fetchTicket();
      }
    } catch (error) {
      console.error('Erro ao atribuir técnico', error);
      alert('Erro ao atribuir técnico.');
    } finally {
      setSavingTech(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setSavingStatus(true);
      if (selectedStatus === 'CLOSED') {
        await ticketService.closeTicket(id);
      } else {
        await ticketService.updateTicket(id, {
          description: ticket.description,
          category: ticket.category,
          status: selectedStatus,
          priority: selectedPriority
        });
      }
      alert('Status atualizado com sucesso!');
      setIntentStatus(false);
      fetchTicket();
    } catch (error) {
      console.error('Erro ao atualizar status', error);
      alert('Erro ao atualizar status.');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleUpdatePriority = async () => {
    try {
      setSavingPriority(true);
      await ticketService.updateTicket(id, {
        description: ticket.description,
        category: ticket.category,
        status: ticket.status,
        priority: selectedPriority
      });
      alert('Prioridade atualizada com sucesso!');
      setIntentPriority(false);
      fetchTicket();
    } catch (error) {
      console.error('Erro ao atualizar prioridade', error);
      alert('Erro ao atualizar prioridade.');
    } finally {
      setSavingPriority(false);
    }
  };

    const handleCloseResolvedTicket = async () => {
    try {
      if (window.confirm("Deseja realmente encerrar este chamado?")) {
        await ticketService.closeTicket(id);
        alert('Chamado encerrado com sucesso!');
        fetchTicket();
      }
    } catch (error) {
      console.error('Erro ao encerrar chamado', error);
      alert('Erro ao encerrar chamado.');
    }
  };

  const handleDeleteTicket = async () => {
    try {
      if (window.confirm("ATENÇÃO: Deseja realmente excluir permanentemente este chamado? Esta ação não pode ser desfeita.")) {
        await ticketService.deleteTicket(id);
        alert('Chamado excluído com sucesso!');
        navigate('/tickets');
      }
    } catch (error) {
      console.error('Erro ao excluir chamado', error);
      alert('Erro ao excluir chamado.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Carregando chamado...</div>;
  }

  if (!ticket) {
    return <div className="p-8 text-center text-slate-500">Chamado não encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/tickets" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <ArrowLeft size={20} />
        Voltar para chamados
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Chamado #{ticket.id}</p>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{ticket.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {ticket.status === 'RESOLVED' && (user?.role === 'ADMIN' || user?.role === 'CLIENT') && (
                  <button 
                    onClick={handleCloseResolvedTicket}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Check size={16} />
                    Encerrar Chamado
                  </button>
                )}
                {(user?.role === 'ADMIN' || user?.role === 'CLIENT') && (ticket.status === 'OPEN') && ticket.active == true && (
                  <button 
                    onClick={handleDeleteTicket}
                    className="px-4 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash size={16} />
                    Excluir
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                      ${ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                      ${ticket.status === 'WAITING' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                      ${ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${ticket.status === 'CLOSED' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' : ''}
                `}>
                  {translateStatus(ticket.status)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                      ${ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                      ${ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                      ${ticket.priority === 'LOW' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' : ''}
                `}>
                  {translatePriority(ticket.priority)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm">
          <div className="p-4 flex items-center gap-3">
            <User className="text-slate-400 dark:text-slate-500" size={20} />
            <div>
              <p className="text-slate-500 dark:text-slate-400">Cliente</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {customer?.name || `ID: ${ticket.customerId}`}
              </p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <Tag className="text-slate-400 dark:text-slate-500" size={20} />
            <div>
              <p className="text-slate-500 dark:text-slate-400">Categoria</p>
              <p className="font-medium text-slate-900 dark:text-white">{ticket.category}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <Clock className="text-slate-400 dark:text-slate-500" size={20} />
            <div>
              <p className="text-slate-500 dark:text-slate-400">Abertura</p>
              <p className="font-medium text-slate-900 dark:text-white">{new Date(ticket.createdAt).toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Descrição do Problema</h3>
            {user?.role === 'CLIENT' && !isEditingDesc && ticket.status !== 'CLOSED' && (
              <button 
                onClick={() => setIsEditingDesc(true)}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <Edit2 size={16} />
                Editar
              </button>
            )}
          </div>
          
          {isEditingDesc ? (
            <div className="space-y-3">
              <textarea 
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full min-h-[120px] px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-y"
              />
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setIsEditingDesc(false)}
                  disabled={savingDesc}
                  className="px-4 py-2 flex items-center gap-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={16} />
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveDescription}
                  disabled={savingDesc}
                  className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  <Check size={16} />
                  {savingDesc ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{ticket.description}</p>
          )}
        </div>
      </div>

      {/* Ações / Painel de Gestão */}
      {(user?.role === 'ADMIN' || user?.role === 'TECHNICIAN') && ticket.status !== 'CLOSED' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Settings2 size={20} className="text-slate-500" />
            Gestão do Chamado
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Bloco: Atribuir Técnico*/}
            {user?.role === 'ADMIN' && (
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Técnico Responsável</label>
                {!intentTech ? (
                  <div className="flex flex-col items-start gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {(ticket.technicianId && technician) ? `Técnico atual: ${technician.name}` : 'Nenhum técnico atribuído'}
                    </span>
                    <button 
                      onClick={() => setIntentTech(true)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Alterar técnico
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <select 
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                      value={selectedTechnician}
                      onChange={(e) => setSelectedTechnician(e.target.value)}
                    >
                      <option value="">Selecione um técnico...</option>
                      {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.name} (ID: {tech.id})
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleAssignTechnician}
                        disabled={savingTech || !selectedTechnician}
                        className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                      >
                        {savingTech ? 'Salvando...' : 'Salvar'}
                      </button>
                      <button 
                        onClick={() => { setIntentTech(false); setSelectedTechnician(ticket.technicianId || ''); }}
                        disabled={savingTech}
                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Bloco: Status */}
            {user?.role !== 'CLIENT' && (<div className="flex flex-col">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status do Chamado</label>
              {!intentStatus ? (
                <div className="flex flex-col items-start gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Atual: {translateStatus(ticket.status)}</span>
                  <button 
                    onClick={() => setIntentStatus(true)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Alterar status
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <select 
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="IN_PROGRESS">Em Atendimento</option>
                    <option value="WAITING">Aguardando</option>
                    <option value="RESOLVED">Resolvido</option>
                  </select>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpdateStatus}
                      disabled={savingStatus}
                      className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                      {savingStatus ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button 
                      onClick={() => { setIntentStatus(false); setSelectedStatus(ticket.status); }}
                      disabled={savingStatus}
                      className="px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>)}

            {/* Bloco: Prioridade */}
            {user?.role !== 'CLIENT' && (<div className="flex flex-col">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Prioridade</label>
              {!intentPriority ? (
                <div className="flex flex-col items-start gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Atual: {translatePriority(ticket.priority)}</span>
                  <button 
                    onClick={() => setIntentPriority(true)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Alterar prioridade
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <select 
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica</option>
                  </select>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpdatePriority}
                      disabled={savingPriority}
                      className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                      {savingPriority ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button 
                      onClick={() => { setIntentPriority(false); setSelectedPriority(ticket.priority); }}
                      disabled={savingPriority}
                      className="px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>)}

          </div>
        </div>
      )}
    </div>
  );
}
