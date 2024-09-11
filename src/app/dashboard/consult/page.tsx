"use client";
import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import dayjs from 'dayjs';

import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { useState } from 'react';
import { Card, InputAdornment, OutlinedInput } from '@mui/material';
import { FileSearch } from '@phosphor-icons/react';

const customers = [
  {
    id: 'USR-010',
    name: 'Alcides Antonio',
    avatar: '/assets/avatar-10.png',
    email: 'alcides.antonio@devias.io',
    phone: '(31) 98942-3123',
    address: '312.423.423-12',
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-009',
    name: 'Marcus Finn',
    avatar: '/assets/avatar-9.png',
    email: 'marcus.finn@devias.io',
    phone: '(31) 98942-3123',
    address: '312.423.423-12',
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-008',
    name: 'Jie Yan',
    avatar: '/assets/avatar-8.png',
    email: 'jie.yan.song@devias.io',
    phone: '(31) 98942-3123',
    address: '312.423.423-12',
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-007',
    name: 'Nasimiyu Danai',
    avatar: '/assets/avatar-7.png',
    email: 'nasimiyu.danai@devias.io',
    phone: '(31) 98942-3123',
    address: '312.423.423-12',
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-006',
    name: 'Iulia Albu',
    avatar: '/assets/avatar-6.png',
    email: 'iulia.albu@devias.io',
    phone: '(31) 98942-3123',
    address: '312.423.423-12',
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-005',
    name: 'Fran Perez',
    avatar: '/assets/avatar-5.png',
    email: 'fran.perez@devias.io',
    phone: '(31) 98942-3123',
    address: '312.423.423-12',
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },

  {
    id: 'USR-004',
    name: 'Penjani Inyene',
    avatar: '/assets/avatar-4.png',
    email: 'penjani.inyene@devias.io',
    phone: '(31) 98942-3123',
    address: '312.423.423-12',
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-003',
    name: 'Carson Darrin',
    avatar: '/assets/avatar-3.png',
    email: 'carson.darrin@devias.io',
    phone: '(31) 98942-3123',
    address: '312.423.423-12',
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-002',
    name: 'Siegbert Gottfried',
    avatar: '/assets/avatar-2.png',
    email: 'siegbert.gottfried@devias.io',
    phone: '(31) 98942-3123',
    address: '312.423.423-12',
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-001',
    name: 'Miron Vitold',
    avatar: '/assets/avatar-1.png',
    email: 'miron.vitold@devias.io',
    phone: '(31) 98942-3123',
    address: '312.423.423-12',
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
] satisfies Customer[];

export default function Page(): React.JSX.Element {
  const [clientFilters, setClientFilters] = useState<string>('');
  const page = 0;
  const rowsPerPage = 5;

  let paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  paginatedCustomers = applyPagination(customers, page, rowsPerPage).filter((customer) => {
    return customer.name.toLowerCase().includes(clientFilters.toLowerCase());
  });

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Consultar CPF / CNPF</Typography>
        </Stack>
      </Stack>
    <Card sx={{ p: 12 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        onChange={(event): void => setClientFilters(event.target.value)}
        placeholder="CPF / CNPJ"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '100%' }}
      />
      <div>
        <Button sx={{ mt: 3 }} startIcon={<FileSearch fontSize="var(--icon-fontSize-md)" />} variant="contained">
          Consultar
        </Button>
      </div>
    </Card>
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}