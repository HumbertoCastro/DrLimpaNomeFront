import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import NumberFormat, { NumericFormat } from 'react-number-format'; // Importing react-number-format for currency input

import { Customer } from '@/components/dashboard/customer/customers-table';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>; // Updated type to support async submission
  initialData?: Customer | null; // For edit mode, we pass in the user data
  mode: 'create' | 'edit' | 'saldo'; // Specify whether we are creating or editing
}

export const UserFormComponent: React.FC<UserFormProps> = ({ open, onClose, onSubmit, initialData = null, mode }) => {
  // Form state for user creation/edit
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    saldo: 0,
    password: '', // Leave empty by default, only used when needed
  });

  const [loading, setLoading] = React.useState(false); // Loading state for form submission

  // Reset formData when switching to create mode or when initialData changes
  React.useEffect(() => {
    if (mode === 'create') {
      // Clear the form data when creating a new user
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        saldo: 0,
        password: '', // Password is required in create mode
      });
    } else if (initialData) {
      // Set form data when editing an existing user
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        role: initialData.role || '',
        saldo: initialData.saldo || 0,
        password: '', // Password remains blank in edit mode
      });
    }
  }, [initialData, mode]); // Reset form when mode or initialData changes

  // Handle form input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle saldo change using react-number-format
  const handleSaldoChange = (values: any) => {
    const { value } = values;
    setFormData((prevData) => ({
      ...prevData,
      saldo: parseFloat(value),
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true); // Start loading
    try {
      await onSubmit(formData); // Submit form data back to the parent component
    } finally {
      setLoading(false); // Stop loading after submission completes
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {mode === 'create'
          ? 'Criar novo Cliente'
          : mode === 'saldo'
            ? `Editar Saldo do ${initialData?.name}`
            : 'Editar Cliente'}
      </DialogTitle>
      {mode === 'saldo' && (
        <DialogContent>
          <NumericFormat
            autoFocus
            margin="dense"
            id="saldo"
            label="Saldo do Cliente"
            value={formData.saldo}
            onValueChange={handleSaldoChange}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            fullWidth
            decimalScale={2}
            fixedDecimalScale={true}
            customInput={TextField}
          />
        </DialogContent>
      )}
      {mode !== 'saldo' && (
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nome"
            type="text"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="email"
            label="E-mail"
            type="email"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="phone"
            label="Telefone"
            type="text"
            fullWidth
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          {/* Password field only shows up for 'create' mode */}
          {mode === 'create' && (
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          )}
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : mode === 'create' ? 'Criar' : 'Salvar Mudanças'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
