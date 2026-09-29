'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getAnnualPremium } from '@/utils/premiumCalculator';

interface SelectedRiderInfo {
  name: string;
  cost: number;
}

interface PolicyTotalProps {
  monthlyPremium: number | null;
  coverage: number;
  rateClass: string;
  riders: string[];
  selectedRidersCost: SelectedRiderInfo[];
}

export default function PolicyTotal({ monthlyPremium, coverage, rateClass, riders, selectedRidersCost }: PolicyTotalProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const totalRiderCost = selectedRidersCost.reduce((sum, r) => sum + r.cost, 0);
  const monthlyTotal = monthlyPremium !== null ? monthlyPremium + totalRiderCost : null;

  const displayTotal = monthlyTotal !== null
    ? billingPeriod === 'monthly'
      ? monthlyTotal
      : getAnnualPremium(monthlyTotal)
    : null;

  const handleBillingChange = (_: React.MouseEvent<HTMLElement>, val: string | null) => {
    if (val) setBillingPeriod(val as 'monthly' | 'annual');
  };

  const dollars = displayTotal !== null ? Math.floor(displayTotal) : 0;
  const cents = displayTotal !== null ? (displayTotal % 1).toFixed(2).substring(1) : '.00';

  return (
    <Box>
      {/* Branding */}
      <Typography
        sx={{ fontWeight: 700, color: '#1a3c6e', fontSize: '1.1rem', mb: 1.5 }}
      >
        NewBridge<sup style={{ fontSize: '0.5em' }}>&trade;</sup>{' '}
        <span style={{ fontWeight: 300, color: '#666', fontSize: '0.9rem' }}>| Final Expense</span>
      </Typography>

      {/* POLICY TOTAL section */}
      <Box sx={{ backgroundColor: '#eef3fb', borderRadius: 2, p: 2.5, mb: 1.5 }}>
        <Chip
          label="POLICY TOTAL"
          size="small"
          sx={{
            backgroundColor: '#1a3c6e', color: '#fff', fontWeight: 700,
            letterSpacing: 0.5, fontSize: '0.65rem', height: 22, mb: 1.5,
          }}
        />

        {/* TOTAL + toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', letterSpacing: 0.5 }}>TOTAL</Typography>
          <ToggleButtonGroup
            value={billingPeriod}
            exclusive
            onChange={handleBillingChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none', px: 1.5, py: 0.2, fontSize: '0.7rem',
                borderRadius: '12px !important', border: '1px solid #ccc', lineHeight: 1.4,
                '&.Mui-selected': {
                  backgroundColor: '#1a3c6e', color: '#fff',
                  '&:hover': { backgroundColor: '#15325c' },
                },
              },
            }}
          >
            <ToggleButton value="monthly">Monthly</ToggleButton>
            <ToggleButton value="annual">Annual</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Big Price */}
        <Box sx={{ mb: 1.5 }}>
          {displayTotal !== null ? (
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography sx={{ fontWeight: 700, color: '#1a3c6e', fontSize: '2.2rem', lineHeight: 1.1 }}>
                ${dollars}
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#1a3c6e', fontSize: '1rem' }}>
                {cents}
              </Typography>
              <Typography sx={{ color: '#666', ml: 0.5, fontSize: '0.85rem' }}>
                / {billingPeriod === 'monthly' ? 'month' : 'year'}
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ fontSize: '2rem', color: '#999' }}>N/A</Typography>
          )}
        </Box>

        {/* Summary rows */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Coverage</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
              ${coverage.toLocaleString()}.00
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Rate class</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{rateClass}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Base premium</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
              {monthlyPremium !== null ? `$${monthlyPremium.toFixed(2)}` : 'N/A'} /mo
            </Typography>
          </Box>
          {selectedRidersCost.map((rider) => (
            <Box key={rider.name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>{rider.name}</Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                ${rider.cost.toFixed(2)} /mo
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* RIDERS INCLUDED AT NO COST */}
      <Box sx={{ backgroundColor: '#eef3fb', borderRadius: 2, p: 2.5 }}>
        <Typography
          sx={{ fontWeight: 700, letterSpacing: 0.5, color: '#666', fontSize: '0.7rem', mb: 1 }}
        >
          RIDERS INCLUDED AT NO COST:
        </Typography>
        {riders.map((rider) => (
          <Box key={rider} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8 }}>
            <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50', mt: 0.2 }} />
            <Typography sx={{ fontSize: '0.8rem' }}>{rider}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
