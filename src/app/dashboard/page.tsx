'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import { ApiService } from '@/services/ApiServices';
import Grid from '@mui/material/Unstable_Grid2';
import { Broom } from '@phosphor-icons/react/dist/ssr/Broom';
import { Users as Client } from '@phosphor-icons/react/dist/ssr/Users';
import dayjs from 'dayjs';

import { useUser } from '@/hooks/use-user';
import { CardInfos } from '@/components/dashboard/overview/cardInfos';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { Sales } from '@/components/dashboard/overview/sales';

// Define the possible statuses for your orders
type OrderStatus = 'pendente' | 'enviado' | 'cancelado';

// Mapping function to convert API status to OrderStatus
const mapStatus = (status: string): OrderStatus => {
  switch (status) {
    case '1': // Assuming "1" means "pendente"
      return 'pendente';
    case '2': // Assuming "1" means "pendente"
      return 'pendente';
    case '3': // Assuming "2" means "enviado"
      return 'enviado';
    case '4': // Assuming "3" means "cancelado"
      return 'cancelado';
    case '5': // Assuming "3" means "cancelado"
      return 'cancelado';
    default:
      return 'pendente'; // Fallback to "pendente" if the status is unknown
  }
};

export interface Consulta {
  id_consulta: number;
  contact_id: string;
  created_at: string;
  locked_at: string | null;
  locked: boolean | null;
  divida: number | null;
  documento: string;
  unidade: string;
  id_ticket: string;
  status_id: string;
  url: string | null;
}

const apiService = new ApiService();

export default function Page(): React.JSX.Element {
  const [consultas, setConsultas] = React.useState<Consulta[]>([]);
  const [currentMonthCount, setCurrentMonthCount] = React.useState<number>(0);
  const [lastMonthCount, setLastMonthCount] = React.useState<number>(0);
  const [monthlyData, setMonthlyData] = React.useState<number[]>([]);
  const [latestConsultas, setLatestConsultas] = React.useState<Consulta[]>([]);

  const fetchConsultas = async () => {
    try {
      const response = await apiService.getApi<Consulta[]>('/consultas'); // Type the API response
      setConsultas(response);

      // Process the data to calculate the required values
      processConsultas(response);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchConsultas();
  }, []);

  const processConsultas = (consultas: Consulta[]) => {
    const currentMonth = dayjs().month(); // Get the current month (0-based index)
    const lastMonth = dayjs().subtract(1, 'month').month(); // Get last month
    const currentYear = dayjs().year();

    // Initialize counts and monthly data array
    let currentMonthRequests = 0;
    let lastMonthRequests = 0;
    const monthCounts = Array(12).fill(0); // Array to store counts for each month

    // Process each consulta
    consultas.forEach((consulta) => {
      const createdAt = dayjs(consulta.created_at);
      const consultaMonth = createdAt.month();
      const consultaYear = createdAt.year();

      // Count for the bar chart (requests per month)
      if (consultaYear === currentYear) {
        monthCounts[consultaMonth] += 1; // Increment count for the respective month
      }

      // Count requests for current and last month
      if (consultaMonth === currentMonth && consultaYear === currentYear) {
        currentMonthRequests += 1;
      } else if (consultaMonth === lastMonth && consultaYear === currentYear) {
        lastMonthRequests += 1;
      }
    });

    // Sort the latest 10 consultas by creation date
    const latest = consultas.sort((a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf()).slice(0, 10);

    // Update the state with processed data
    setCurrentMonthCount(currentMonthRequests);
    setLastMonthCount(lastMonthRequests);
    setMonthlyData(monthCounts);
    setLatestConsultas(latest);
  };

  return (
    <Grid container spacing={3}>
      <Grid lg={6} sm={6} xs={12}>
        <CardInfos
          diff={currentMonthCount - lastMonthCount}
          trend={currentMonthCount > lastMonthCount ? 'up' : 'down'}
          sx={{ height: '100%' }}
          value={currentMonthCount}
          title="Clientes esse Mes"
          subtitle={`A mais que mês passado: ${lastMonthCount}`}
          icon={<Client fontSize="var(--icon-fontSize-lg)" />}
        />
      </Grid>
      <Grid lg={6} sm={6} xs={12}>
        <CardInfos
          diff={currentMonthCount - lastMonthCount}
          trend={currentMonthCount > lastMonthCount ? 'up' : 'down'}
          sx={{ height: '100%' }}
          value={currentMonthCount}
          title="Consultas esse Mes"
          subtitle={`A mais que mês passado: ${lastMonthCount}`}
          icon={<Broom fontSize="var(--icon-fontSize-lg)" />}
        />
      </Grid>
      <Grid lg={12} xs={12}>
        <Sales chartSeries={[{ name: 'Requests this year', data: monthlyData }]} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={12} md={12} xs={12}>
        <LatestOrders
          orders={latestConsultas.map((consulta) => ({
            id: consulta.id_ticket,
            customer: { name: consulta.documento },
            amount: consulta.divida || 0, // Example amount, replace if needed
            status: mapStatus(consulta.status_id), // Map status to the expected values
            createdAt: dayjs(consulta.created_at).toDate(),
          }))}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
