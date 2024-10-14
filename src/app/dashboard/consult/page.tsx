'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { ApiService } from '@/services/ApiServices';
import { Card, CircularProgress, Dialog, InputAdornment, OutlinedInput } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { FileSearch, Upload } from '@phosphor-icons/react';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import dayjs from 'dayjs';

import DialogComponent from '@/components/dialog';

interface Client {
  notConsulted: {
    id_consulta: string;
    documento: string;
    created_at: string;
  };
}

export default function Page(): React.JSX.Element {
  const apiService = new ApiService();
  const [clientWithoutConsult, setClientWithoutConsult] = useState<
    {
      id: string;
      documento: string;
      created_at: string;
    }[]
  >([]);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'upload' | 'confirmation' | 'deletion'>('upload');
  const [dialogTitle, setDialogTitle] = useState<string>('Anexar PDF de consulta');
  const [dialogProps, setDialogProps] = useState<{
    documento: string;
    id: string;
  }>({
    documento: '',
    id: '',
  });

  const getClientWithoutConsult = async () => {
    try {
      const { notConsulted: data }: Client = await apiService.getApi<Client>('/not-consulted');
      if (!data) return;
      setClientWithoutConsult([
        {
          id: data.id_consulta || '1',
          documento: data.documento,
          created_at: data.created_at,
        },
      ]);
      setRemainingTime(300); // 5 minutes in seconds
      setTimerActive(true);
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };

  const resetComponent = () => {
    setClientWithoutConsult([]);
    setTimerActive(false);
    setRemainingTime(null);
  };

  const handleDialogClose = async (file?: File, divida?: string, name?: string, props?: any) => {
    try {
      const formData = new FormData();

      // Append file and other data to FormData
      if (file) {
        formData.append('pdf', file); // Make sure the field name matches 'pdf' in the backend
      }
      if (divida) {
        formData.append('divida', divida);
      }
      if (name && props) {
        formData.append('fileName', `${name}-${props.doc}.pdf`);
      }

      // Send the FormData via API
      const response = await apiService.postApi(`/upload-pdf/${props.id}`, formData);
    } catch (error) {
      console.error(error);
    }
  };

  const openDialog = (type: 'upload' | 'confirmation' | 'deletion', props?: any) => {
    setDialogType(type);
    if (type === 'upload') {
      setDialogProps(props);
      setDialogTitle('Upload File');
    } else if (type === 'confirmation') {
      setDialogTitle('Confirm Action');
    } else if (type === 'deletion') {
      setDialogTitle('Delete Item');
    }
    setDialogOpen(true);
  };

  useEffect(() => {
    if (timerActive && remainingTime !== null) {
      const intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime && prevTime > 0) return prevTime - 1;
          resetComponent();
          return null;
        });
      }, 1000); // Decrement the remaining time every second

      return () => clearInterval(intervalId); // Clear interval on component unmount
    }
  }, [timerActive, remainingTime]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Obter cliente sem consulta</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<FileSearch fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={getClientWithoutConsult}
          >
            Obter cliente
          </Button>
        </div>
      </Stack>

      {remainingTime !== null && (
        <Card sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">Tempo restante para anexar PDF:</Typography>
          <Box display="flex" alignItems="center">
            <CircularProgress variant="determinate" value={(remainingTime / 300) * 100} />
            <Typography sx={{ ml: 2 }} variant="body1">
              {`${Math.floor(remainingTime / 60)}:${remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60}`}
            </Typography>
          </Box>
        </Card>
      )}

      <Card sx={{ p: 12 }}>
        {clientWithoutConsult.length > 0 && (
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: '800px' }}>
              <TableHead>
                <TableRow>
                  <TableCell>CPF / CNPJ</TableCell>
                  <TableCell>Entrou em</TableCell>
                  <TableCell>Anexar pdf</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientWithoutConsult.map((row) => {
                  return (
                    <TableRow hover key={row.id} selected={true}>
                      <TableCell>{row.documento}</TableCell>
                      <TableCell>{dayjs(row.created_at).format('MMM D, YYYY')}</TableCell>
                      <TableCell>
                        <Button
                          startIcon={<Upload fontSize="var(--icon-fontSize-md)" />}
                          variant="contained"
                          onClick={() => openDialog('upload', { doc: row.documento, id: row.id })}
                        >
                          Anexar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <DialogComponent
          type={dialogType}
          title={dialogTitle}
          onConfirm={handleDialogClose}
          onCancel={() => setDialogOpen(false)}
          props={dialogProps}
        />
      </Dialog>
    </Stack>
  );
}
