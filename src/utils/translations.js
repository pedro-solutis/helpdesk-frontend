export const translateStatus = (status) => {
  const dictionary = {
    OPEN: 'ABERTO',
    IN_PROGRESS: 'EM ATENDIMENTO',
    WAITING: 'AGUARDANDO',
    RESOLVED: 'RESOLVIDO',
    CLOSED: 'FINALIZADO'
  };
  return dictionary[status] || status;
};

export const translatePriority = (priority) => {
  const dictionary = {
    LOW: 'BAIXA',
    MEDIUM: 'MÉDIA',
    HIGH: 'ALTA',
    CRITICAL: 'CRÍTICA'
  };
  return dictionary[priority] || priority;
};

export const translateRole = (role) => {
  const dictionary = {
    ADMIN: 'ADMINISTRADOR',
    TECHNICIAN: 'TÉCNICO',
    CLIENT: 'CLIENTE'
  };
  return dictionary[role] || role;
};

