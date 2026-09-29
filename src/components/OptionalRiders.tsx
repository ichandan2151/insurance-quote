'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  Collapse,
  IconButton,
  Chip,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Rider {
  id: string;
  name: string;
  description: string;
}

const OPTIONAL_RIDERS: Rider[] = [
  {
    id: 'accidental-death',
    name: 'Accidental Death Benefit Rider',
    description: 'Doubles the Death Benefit if the Insured dies by Accidental Death',
  },
];

interface OptionalRidersProps {
  selectedRiders: string[];
  onRiderToggle: (riderId: string) => void;
}

export default function OptionalRiders({ selectedRiders, onRiderToggle }: OptionalRidersProps) {
  const [expanded, setExpanded] = useState(true);
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
            label={`${selectedCount} of ${OPTIONAL_RIDERS.length}`}
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
          {OPTIONAL_RIDERS.map((rider) => (
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
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {rider.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {rider.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
