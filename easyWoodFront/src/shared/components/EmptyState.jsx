import React from 'react';

export const EmptyState = ({ 
  title = "Nenhum item encontrado", 
  description = "Não encontramos nenhum registro no momento",
  action,
  icon = "📭"
}) => {
  return (
    <div className="empty-state bg-gray-50 rounded-lg p-8 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{description}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};