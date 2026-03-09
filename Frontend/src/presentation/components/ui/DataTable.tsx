import { memo } from 'react';
import type { Column } from '../../../types/table'
import type { Pagination } from '../../../types/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps<T> {
    columns: Column<T>[];
    isLoading: boolean;
    data: T[]
    emptyMessage?: string
    pagination?: Pagination
}


const DataTable =  <T extends {id: string | number }>({
    columns,
    isLoading,
    data,
    emptyMessage = 'No record Found',
    pagination
}: DataTableProps<T>) => {
    // const { loading } = useSelector((state: RootState) => state.userSlice)
 return (
  <div className="w-full">

    <div className="overflow-x-auto bg-white rounded-xl mt-5 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#E7D4B0]">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-5 text-xs font-black text-black uppercase tracking-wide border-b border-gray-100"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 font-medium">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading data...
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr key={item.id || rowIndex} className="hover:bg-gray-50/50 transition-colors group">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {pagination && pagination.totalPages > 1 && (
      <div className="mt-4 px-6 py-4 flex border-none items-center justify-between rounded-xl">

        <div className="text-sm text-gray-500 font-medium">
          Page <span className="text-amber-600">{pagination.currentPage}</span> of {pagination.totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="p-2 rounded-xl hover:bg-gray-50 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-1">
            {[...Array(pagination.totalPages)].map((_, i) => {
              const pageNum = i + 1;

              if (
                pageNum === 1 ||
                pageNum === pagination.totalPages ||
                Math.abs(pageNum - pagination.currentPage) <= 1
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => pagination.onPageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold ${
                      pagination.currentPage === pageNum
                        ? "bg-amber-600 text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }

              if (
                (pageNum === 2 && pagination.currentPage > 3) ||
                (pageNum === pagination.totalPages - 1 &&
                  pagination.currentPage < pagination.totalPages - 2)
              ) {
                return <span key={pageNum}>...</span>;
              }

              return null;
            })}
          </div>

          <button
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="p-2 rounded-xl hover:bg-gray-50 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    )}
  </div>
)
}

export default memo(DataTable) as typeof DataTable
