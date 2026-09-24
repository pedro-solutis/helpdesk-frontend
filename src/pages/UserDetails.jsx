import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { ArrowLeft, User, Mail, Shield} from 'lucide-react';
import { translateRole } from '../utils/translations';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserById(id);
      setUser(data);
    } catch (error) {
      console.error('Erro ao buscar usuário', error);
      alert('Usuário não encontrado.');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Carregando detalhes do usuário...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-slate-500">Usuário não encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/users" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <ArrowLeft size={20} />
        Voltar para usuários
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Usuário #{user.id}</p>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{user.name}</h1>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User className="text-slate-400 dark:text-slate-500" size={24} />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Nome</p>
                  <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-slate-400 dark:text-slate-500" size={24} />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                  <p className="font-medium text-slate-900 dark:text-white">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-slate-400 dark:text-slate-500" size={24} />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Papel</p>
                  <p className="font-medium text-slate-900 dark:text-white">{translateRole(user.role)}</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

