'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { useUser } from '@/hooks/use-user';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';

export default function Page(): React.JSX.Element {
  const { user } = useUser();
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Perfil</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo user={user} />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <AccountDetailsForm user={user} />
        </Grid>
      </Grid>
    </Stack>
  );
}
