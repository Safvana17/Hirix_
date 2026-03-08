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
    <div className="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
            <tr className='bg-[#E7D4B0]'>
              { columns.map((col, idx) => (
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
            { isLoading ? (
                <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 font-medium">
                        <div className="flex items-center justify-center gap-3">
                           <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                                    Loading data...
                            Loading data...
                        </div>
                    </td>
                </tr>
            ): data.length === 0 ? (
                <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 font-medium font-italic">
                        {emptyMessage}
                    </td>
                </tr>
            ): (
                data.map((item, rowIndex) => (
                    <tr key={item.id || rowIndex } className="hover:bg-gray-50/50 transition-colors group">
                        { columns.map((col, colIdx) => (
                            <td key={colIdx} className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                            </td>
                        ))}
                    </tr>
                ))
            )}
        </tbody>
      </table>
            {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
                    <div className="text-sm text-gray-500 font-medium">
                        Page <span className="text-amber-600">{pagination.currentPage}</span> of {pagination.totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="p-2 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(pagination.totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                // Simple logic: show first, last, and pages around current
                                if (
                                    pageNum === 1 ||
                                    pageNum === pagination.totalPages ||
                                    Math.abs(pageNum - pagination.currentPage) <= 1
                                ) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => pagination.onPageChange(pageNum)}
                                            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${pagination.currentPage === pageNum
                                                    ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                                                    : 'text-gray-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                } else if (
                                    (pageNum === 2 && pagination.currentPage > 3) ||
                                    (pageNum === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 2)
                                ) {
                                    return <span key={pageNum} className="text-gray-400">...</span>;
                                }
                                return null;
                            })}
                        </div>
                        <button
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="p-2 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            )}
    </div>
  )
}

export default DataTable
