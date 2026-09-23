import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { useAuth } from '../contexts/AuthContext';

export default function TicketForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'LOW'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await ticketService.createTicket({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        customerId: user?.id
      });
      navigate('/tickets');
    } catch (error) {
      console.error('Erro ao criar chamado', error);
      alert('Erro ao criar chamado.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 transition-colors duration-200">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Novo Chamado</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Título do Chamado</label>
          <input 
            type="text" 
            name="title"
            required
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            placeholder="Ex: Sistema lento ao gerar relatórios"
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Categoria</label>
            <select 
              name="category"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma categoria...</option>
              <option value="HARDWARE">Hardware</option>
              <option value="SOFTWARE">Software</option>
              <option value="NETWORK">Rede</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Prioridade</label>
            <select 
              name="priority"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              onChange={handleChange}
              defaultValue="LOW"
            >
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
              <option value="CRITICAL">Crítica</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Descrição Detalhada</label>
          <textarea 
            name="description"
            rows="5"
            required
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            placeholder="Descreva o problema com o máximo de detalhes possível..."
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button 
            type="button" 
            onClick={() => navigate('/tickets')}
            className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? 'Criando...' : 'Criar Chamado'}
          </button>
        </div>
      </form>
    </div>
  );
}

