import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { ArrowLeft, User, Mail, Shield, Edit, X, Eye, EyeOff, Save } from 'lucide-react';
import { translateRole } from '../utils/translations';
import { useAuth } from '../contexts/AuthContext';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [detailedUser, setDetailedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserById(id);
      setDetailedUser(data);
    } catch (error) {
      console.error('Erro ao buscar usuário', error);
      alert('Usuário não encontrado.');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatePayload = {
        name: formData.name ? formData.name : '',
        role: formData.role ? formData.role : '',
        password: '',
      };

      if (changePassword) {
        if (!formData.password || formData.password.trim() === '') {
          alert('Erro: A nova senha não pode ficar vazia.');
          setSaving(false);
          return;
        }
        if (formData.password !== confirmPassword) {
          alert('Falha na atualização: As senhas não coincidem!');
          setSaving(false);
          return;
        }
        updatePayload.password = formData.password;
      }

      await userService.updateUser(id, updatePayload);
      alert('Usuário atualizado com sucesso');
      setIsEditing(false);
      fetchUser();
    } catch (error) {
      console.error('Erro ao salvar usuário', error);
      alert('Erro ao salvar o usuário');
    } finally {
      setSaving(false);
    }
  }

  const handleCancelClick = () => {
    if (changePassword) setChangePassword(false);
    if (isEditing) setIsEditing(false);
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Carregando detalhes do usuário...</div>;
  }

  if (!detailedUser) {
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
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Usuário #{detailedUser.id}</p>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{detailedUser.name}</h1>
            </div>
            <div className="flex items-center gap-4">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm font-medium"
                  title='Editar'
                >
                  <Edit size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User className="text-slate-400 dark:text-slate-500" size={24} />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Nome</p>
                  <p className="font-medium text-slate-900 dark:text-white">{detailedUser.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-slate-400 dark:text-slate-500" size={24} />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                  <p className="font-medium text-slate-900 dark:text-white">{detailedUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-slate-400 dark:text-slate-500" size={24} />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Papel</p>
                  <p className="font-medium text-slate-900 dark:text-white">{translateRole(detailedUser.role)}</p>
                </div>
              </div>
            </div>) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                {(user?.role === 'ADMIN' && detailedUser.role !== 'ADMIN') && (<div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Papel</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="CLIENT">Cliente</option>
                    <option value="TECHNICIAN">Técnico</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>)}
                {user?.id === detailedUser.id && (
                  <div className="col-span-1 md:col-span-2 space-y-4 border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
                    <div className="flex items-center gap-3">
                      <label className="relative flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={changePassword}
                          onChange={(e) => {
                            setChangePassword(e.target.checked);
                            if (!e.target.checked) {
                              setFormData({ ...formData, password: '' });
                              setConfirmPassword('');
                            }
                          }}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                          Alterar a senha
                        </span>
                      </label>
                    </div>

                    {changePassword && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Nova Senha
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            minLength={8}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Confirmar Senha
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type={showPassword ? "text" : "password"}
                              minLength={8}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                              title='Ver senhas'
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <button
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="px-4 py-2 flex items-center gap-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Save size={16} />
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={() => handleCancelClick()}
                  disabled={saving}
                  className="px-4 py-2 flex items-center gap-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>
            </div>)}
        </div>
      </div>
    </div>
  );
}

