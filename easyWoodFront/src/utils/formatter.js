export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Data inválida';
  
  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleString('pt-BR', options);
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  
  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  };
  
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};