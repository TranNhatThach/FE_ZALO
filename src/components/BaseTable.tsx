import React from 'react';

interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

interface BaseTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey: (item: T) => string | number;
}

const BaseTable = <T extends object>({ columns, data, loading, rowKey }: BaseTableProps<T>) => {
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                No data found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={rowKey(item)} className="hover:bg-gray-50 transition-colors">
                {columns.map((col, idx) => {
                  const val = typeof col.key === 'string' && col.key.includes('.') 
                    ? col.key.split('.').reduce((obj, k) => (obj as any)?.[k], item)
                    : (item as any)[col.key];

                  return (
                    <td key={idx} className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 ${col.className || ''}`}>
                      {col.render ? col.render(val, item) : val?.toString()}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BaseTable;
