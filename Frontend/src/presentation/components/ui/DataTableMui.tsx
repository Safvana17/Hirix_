import { DataGrid,type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { memo } from 'react';
import type { Column } from '../../../types/table';
import type { Pagination } from '../../../types/pagination';

interface DataTableProps<T> {
  columns: Column<T>[];
  isLoading: boolean;
  data: T[];
  emptyMessage?: string;
  pagination?: Pagination;
}

const mapColumns = <T,>(columns: Column<T>[]): GridColDef[] => {
  return columns.map((col) => ({
    field: col.key as string,
    headerName: col.header,
    flex: 1,
    headerClassName: 'custom-header',
    renderCell: (params) => {
       if(col.render) {
          return col.render(params.value, params.row)
       }
       return params.value
      }
  }));
};

const DataTable = <T extends { id: string | number }>({
  columns,
  isLoading,
  data,
  pagination,
}: DataTableProps<T>) => {
  const muiColumns = mapColumns(columns);

  const rows = data.map((item) => ({
  ...item,
    id: item.id,
  }));

  return (
    <Paper sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={muiColumns}
        loading={isLoading}
        disableRowSelectionOnClick

        paginationMode={pagination ? 'server' : 'client'}
        rowCount={pagination?.totalCount || 0}
        paginationModel={{
          page: (pagination?.currentPage || 1) - 1,
          pageSize: pagination?.pageSize || 10,
        }}
        onPaginationModelChange={(model) => {
          pagination?.onPageChange(model.page + 1);
          pagination?.onPageSizeChange?.(model.pageSize)
        }}
        pageSizeOptions={[4, 10, 20]}
        sx={{
          border: 0,
          '& .custom-header': {
            backgroundColor: "#4d3305",
            color: 'white',
            fontWeight: 'bold'
          },

          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#4d3305 !important',
            color: '#4F3503',
            fontWeight: 'bold',
            fontSize: '14px',
          },

          '& .MuiDataGrid-columnHeader': {
            outline: 'none',
          },

          '& .MuiDataGrid-cell': {
            fontSize: '13px',
            color: '#444',
          },

          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: '#fafafa',
          },

          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f5f5f5',
          },

          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        }}
      />
    </Paper>
  );
};

export default memo(DataTable) as typeof DataTable;