'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  Collapse,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { supabase } from '@/lib/supabase';

interface Rider {
  id: string;
  name: string;
  description: string;
}

interface OptionalRidersProps {
  selectedRiders: string[];
  onRiderToggle: (riderId: string) => void;
  riderCost: number;
}

export default function OptionalRiders({ selectedRiders, onRiderToggle, riderCost }: OptionalRidersProps) {
  const [expanded, setExpanded] = useState(true);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loadingRiders, setLoadingRiders] = useState(true);

  useEffect(() => {
    async function fetchRiders() {
      const { data, error } = await supabase
        .from('riders')
        .select('*')
        .eq('rider_type', 'optional')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching optional riders:', error);
        setRiders([]);
      } else {
        setRiders(
          (data || []).map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description || '',
          }))
        );
      }
      setLoadingRiders(false);
    }
    fetchRiders();
  }, []);

  const selectedCount = selectedRiders.length;

  return (
    <Box sx={{ border: '1px solid #e8e8e8', borderRadius: 2, p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 1, fontSize: '0.85rem' }}>
            OPTIONAL RIDERS
          </Typography>
          <Chip
            label={`${selectedCount} of ${riders.length}`}
            size="small"
            sx={{ fontSize: '0.75rem', backgroundColor: '#e8f0fe', color: '#1a3c6e' }}
          />
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          {loadingRiders ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : riders.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No optional riders available</Typography>
          ) : (
            riders.map((rider) => (
              <Box
                key={rider.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.5,
                }}
              >
                <Switch
                  checked={selectedRiders.includes(rider.id)}
                  onChange={() => onRiderToggle(rider.id)}
                  color="primary"
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {rider.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {rider.description}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#333', whiteSpace: 'nowrap' }}>
                  ${riderCost.toFixed(2)} /mo
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
