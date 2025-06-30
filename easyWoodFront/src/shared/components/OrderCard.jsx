import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const OrderCard = ({ 
  order, 
  onView, 
  onEdit, 
  onDelete,
  userType 
}) => {
  const getStatusBadge = () => {
    const statusMap = {
      pending: 'badge-pending',
      in_progress: 'badge-in_progress',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
      pending_payment: 'badge-pending_payment',
      paid: 'badge-paid',
      overdue: 'badge-overdue'
    };
    
    const statusText = {
      pending: 'Pendente',
      in_progress: 'Em Andamento',
      completed: 'Completo',
      cancelled: 'Cancelado',
      pending_payment: 'Pag. Pendente',
      paid: 'Pago',
      overdue: 'Atrasado'
    };
    
    const statusClass = statusMap[order.status] || 'badge-pending';
    return <span className={`badge ${statusClass}`}>{statusText[order.status]}</span>;
  };

  return (
    <div className="order-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{order.service}</h3>
            <div className="mt-1 flex items-center gap-2">
              {getStatusBadge()}
              <span className="text-xs text-gray-500">#{order.id}</span>
            </div>
          </div>
          <span className="font-bold text-gray-900">{formatCurrency(order.price)}</span>
        </div>
        
        <div className="mt-3 text-sm text-gray-600">
          <p className="truncate">{order.description}</p>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span>Prazo: </span>
            <span className="font-medium">
              {order.due_date ? formatDate(order.due_date) : 'Sem prazo definido'}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onView(order.id)}
              className="text-sm font-medium text-primary-600 hover:text-primary-800"
            >
              Ver detalhes
            </button>
            
            {userType === 'merchant' && (
              <>
                <button 
                  onClick={() => onEdit(order)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onDelete(order.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};