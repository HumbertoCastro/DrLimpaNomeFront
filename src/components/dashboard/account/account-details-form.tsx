'use client';

import * as React from 'react';
import { ApiService } from '@/services/ApiServices';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const;

const apiService = new ApiService();
export function AccountDetailsForm({ user }: { user: any }): React.JSX.Element {
  const onSubmitForm = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const data = {
      name: formData.get('firstName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    };

    await apiService.putApi(`/users/${user.id}`, { ...data, role: user.role });
    window.location.reload();
  };
  return (
    <form onSubmit={onSubmitForm}>
      <Card>
        <CardHeader subheader="Essas informações podem ser editadas" title="Perfil" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={12} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Nome</InputLabel>
                <OutlinedInput defaultValue={user.name} label="Nome" name="firstName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>E-mail</InputLabel>
                <OutlinedInput defaultValue={user.email} label="E-mail" name="email" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Telefone</InputLabel>
                <OutlinedInput label="Telefone" name="phone" defaultValue={user.phone} type="tel" />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
