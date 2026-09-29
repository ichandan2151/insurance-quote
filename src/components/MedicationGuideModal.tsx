'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Chip,
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { MEDICATIONS, Medication } from '@/data/medications';

interface MedicationGuideModalProps {
  open: boolean;
  onClose: () => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const STATUS_CONFIG = {
  declined: { color: '#d32f2f', label: 'Declined' },
  modified: { color: '#ed6c02', label: 'Modified only' },
  review: { color: '#616161', label: 'Underwriting review' },
};

function getEligibilityMessage(med: Medication): string {
  const condition = med.condition;
  if (med.status === 'declined') {
    return `If this drug is used for the treatment of ${condition} your client will not be eligible for coverage.`;
  }
  if (med.status === 'modified') {
    return `If this drug is used for the treatment of ${condition} your client may only be eligible for modified coverage.`;
  }
  return `If this drug is used for the treatment of ${condition} the application will require underwriting review.`;
}

export default function MedicationGuideModal({ open, onClose }: MedicationGuideModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'search' | 'browse'>('search');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MEDICATIONS.filter((m) => m.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const browseMeds = useMemo(() => {
    if (!activeLetter) return MEDICATIONS;
    return MEDICATIONS.filter((m) => m.name[0].toUpperCase() === activeLetter);
  }, [activeLetter]);

  const handleBrowse = () => {
    setView('browse');
    setActiveLetter(null);
    setSelectedMed(null);
    setSearchQuery('');
  };

  const handleBackToSearch = () => {
    setView('search');
    setActiveLetter(null);
    setSelectedMed(null);
    setSearchQuery('');
  };

  const handleClose = () => {
    onClose();
    setView('search');
    setSearchQuery('');
    setActiveLetter(null);
    setSelectedMed(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, maxHeight: '85vh' } } }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 3, pb: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Medication Guide
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search a medication to see how it may affect this applicant&apos;s eligibility.
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 1 }}>
        {view === 'search' ? (
          /* ====== SEARCH VIEW ====== */
          <Box>
            <TextField
              fullWidth
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedMed(null);
              }}
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Link
              component="button"
              variant="body2"
              onClick={handleBrowse}
              sx={{ mb: 2, display: 'block', color: '#1a3c6e', fontWeight: 600 }}
            >
              Browse all {MEDICATIONS.length} medications &rsaquo;
            </Link>

            {/* Search results */}
            {selectedMed ? (
              <Box>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setSelectedMed(null)}
                  sx={{ mb: 2, display: 'block', color: '#1a3c6e', fontWeight: 600 }}
                >
                  &lsaquo; Back to results
                </Link>
                <MedicationCard med={selectedMed} />
              </Box>
            ) : (
              searchResults.map((med) => (
                <MedicationRow key={`${med.name}-${med.condition}`} med={med} onClick={() => setSelectedMed(med)} />
              ))
            )}
          </Box>
        ) : (
          /* ====== BROWSE VIEW ====== */
          <Box>
            {selectedMed ? (
              /* Selected medication detail */
              <Box>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setSelectedMed(null)}
                  sx={{ mb: 2, display: 'block', color: '#1a3c6e', fontWeight: 600 }}
                >
                  &lsaquo; Back to list
                </Link>
                <MedicationCard med={selectedMed} />
              </Box>
            ) : (
              /* Browse list */
              <Box>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleBackToSearch}
                  sx={{ mb: 2, display: 'block', color: '#1a3c6e', fontWeight: 600 }}
                >
                  &lsaquo; Back to search
                </Link>

                {/* Alphabet bar */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {ALPHABET.map((letter) => {
                    const hasItems = MEDICATIONS.some((m) => m.name[0].toUpperCase() === letter);
                    return (
                      <Typography
                        key={letter}
                        component="span"
                        onClick={() => hasItems && setActiveLetter(letter === activeLetter ? null : letter)}
                        sx={{
                          cursor: hasItems ? 'pointer' : 'default',
                          fontWeight: activeLetter === letter ? 700 : 500,
                          color: !hasItems ? '#ccc' : activeLetter === letter ? '#1a3c6e' : '#333',
                          fontSize: '0.85rem',
                          px: 0.5,
                          borderBottom: activeLetter === letter ? '2px solid #1a3c6e' : 'none',
                          '&:hover': hasItems ? { color: '#1a3c6e' } : {},
                        }}
                      >
                        {letter}
                      </Typography>
                    );
                  })}
                </Box>

                {/* Legend */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: cfg.color }} />
                      <Typography variant="caption" color="text.secondary">
                        {cfg.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Filter input */}
                <TextField
                  fullWidth
                  placeholder={activeLetter || ''}
                  value={activeLetter || ''}
                  variant="outlined"
                  size="small"
                  disabled
                  sx={{ mb: 2, backgroundColor: '#f5f5f5', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {/* Medication list */}
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {browseMeds.map((med) => (
                    <MedicationRow key={`${med.name}-${med.condition}`} med={med} onClick={() => setSelectedMed(med)} />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Disclaimer */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, fontStyle: 'italic' }}>
          Guidance only — this reflects the underwriting medication guide and does not replace a full underwriting
          decision. Confirm the treated condition with your client.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

function MedicationRow({ med, onClick }: { med: Medication; onClick: () => void }) {
  const dotColor = STATUS_CONFIG[med.status].color;
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 1.5,
        px: 1,
        borderBottom: '1px solid #f0f0f0',
        cursor: 'pointer',
        '&:hover': { backgroundColor: '#f8f9fa' },
      }}
    >
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: dotColor, flexShrink: 0 }} />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {med.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {med.type} · {med.condition}
        </Typography>
      </Box>
    </Box>
  );
}

function MedicationCard({ med }: { med: Medication }) {
  const cfg = STATUS_CONFIG[med.status];
  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        p: 3,
        backgroundColor: '#fafafa',
      }}
    >
      <Chip
        label={cfg.label.toUpperCase()}
        size="small"
        sx={{
          backgroundColor: cfg.color,
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: 0.5,
          mb: 2,
        }}
      />
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        {med.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {med.type} · Associated condition: {med.condition}
      </Typography>
      <Box sx={{ backgroundColor: '#f0f0f0', borderRadius: 2, p: 2 }}>
        <Typography variant="body2">{getEligibilityMessage(med)}</Typography>
      </Box>
    </Box>
  );
}
