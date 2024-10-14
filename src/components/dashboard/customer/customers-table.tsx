'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Money, Pen } from '@phosphor-icons/react';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  documento: string;
  role: string;
  phone: string;
  createdAt: Date;
  saldo: number;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit?: (customer: Customer) => void; // Callback for edit button
  onAddSaldo?: (customer: Customer) => void; // Callback for edit button
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100);
};

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 5,
  onPageChange,
  onRowsPerPageChange,
  onAddSaldo,
  onEdit, // New prop for handling edit action
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => rows.map((customer) => customer.id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>CPF / CNPJ</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Data de Cadastro</TableCell>
              <TableCell>Saldo</TableCell>
              <TableCell>Editar / Adicionar Saldo</TableCell> {/* New column for actions */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.documento}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{formatCurrency(row.saldo)}</TableCell> {/* Format saldo with currency */}
                  <TableCell>
                    {/* Edit button */}
                    <IconButton onClick={() => onEdit?.(row)} aria-label="edit">
                      <Pen type="bold" size={32} />
                    </IconButton>
                    {/* Add saldo button */}
                    <IconButton onClick={() => onAddSaldo?.(row)} aria-label="add saldo">
                      <Money type="bold" size={32} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count} // Total number of rows available in the backend
        onPageChange={onPageChange} // Trigger this when page changes
        onRowsPerPageChange={onRowsPerPageChange} // Trigger this when rows per page change
        page={page} // Current page
        rowsPerPage={rowsPerPage} // Number of rows per page
        labelRowsPerPage="Linhas por página"
        rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
      />
    </Card>
  );
}
