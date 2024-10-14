'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { ApiService } from '@/services/ApiServices';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { UserFormComponent } from '@/components/dialog/UserForm';

const apiService = new ApiService();

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [clientFilters, setClientFilters] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'saldo'>('create');
  const [editUser, setEditUser] = useState<Customer | null>(null);

  // Fetch customers from the API whenever the page or rowsPerPage changes
  const fetchCustomers = async () => {
    try {
      const response = await apiService.getApi<{ customers: Customer[]; totalPages: number }>('/users/all', {
        page: page + 1, // API might expect 1-based page index
        limit: rowsPerPage,
      });
      setCustomers(response.customers);
      setTotalPages(response.totalPages); // Set total pages for pagination
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage]);

  // Handle opening the form in create mode
  const handleOpenCreateForm = () => {
    setFormMode('create');
    setEditUser(null); // No user for edit in create mode
    setOpenForm(true);
  };

  // Handle opening the form in edit mode
  const handleOpenEditForm = (customer: Customer) => {
    setFormMode('edit');
    setEditUser(customer); // Set the user to be edited
    setOpenForm(true);
  };

  // Handle opening the form in edit mode
  const handleOpenSaldoForm = (customer: Customer) => {
    setFormMode('saldo');
    setEditUser(customer); // Set the user to be edited
    setOpenForm(true);
  };

  // Handle form submission
  const handleFormSubmit = async (data: FormData) => {
    try {
      if (formMode === 'create') {
        // Create new user
        await apiService.postApi('/users/create', { ...data, role: 2 });
      } else if (formMode === 'edit' && editUser) {
        await apiService.putApi(`/users/${editUser.id}`, { ...data, role: 2 }); // You might need to adjust for PUT
      } else if (formMode === 'saldo' && editUser) {
        await apiService.putApi(`/users/saldo/${editUser.id}`, { ...data, role: 2 });
      }
      fetchCustomers(); // Refresh customers after form submission
      setOpenForm(false); // Close the form after submission
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(clientFilters.toLowerCase())
  );

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Clientes</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleOpenCreateForm}
          >
            Add
          </Button>
        </div>
      </Stack>
      <CustomersFilters setClientFilters={setClientFilters} />
      <CustomersTable
        count={filteredCustomers.length}
        page={page}
        rows={filteredCustomers}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalPages={totalPages}
        onEdit={handleOpenEditForm} // Pass edit handler to the table
        onAddSaldo={handleOpenSaldoForm} // Pass edit handler to the table
      />

      {/* Form Component for both create and edit */}
      <UserFormComponent
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        mode={formMode}
        initialData={editUser} // Pass the data when editing
      />
    </Stack>
  );
}
