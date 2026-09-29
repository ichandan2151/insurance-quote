'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography, Paper, Button } from '@mui/material';

export default function ErrorPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#6BA4E0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 700,
          width: '100%',
          borderRadius: 3,
          py: 8,
          px: 5,
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <Box sx={{ mb: 4 }}>
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="30" stroke="#1a3c6e" strokeWidth="2" fill="none" strokeDasharray="8 4" />
            <path d="M25 25 L45 45 M45 25 L25 45" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="35" cy="35" r="18" stroke="#c0392b" strokeWidth="1.5" fill="none" opacity="0.5" />
          </svg>
        </Box>

        {/* Heading */}
        <Typography
          sx={{
            fontSize: '2.2rem',
            fontWeight: 400,
            color: '#333',
            mb: 2,
            lineHeight: 1.3,
          }}
        >
          Something went wrong on our side
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: '1rem',
            color: '#666',
            mb: 5,
            maxWidth: 500,
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Nothing has been submitted and your client&apos;s details are unchanged. Go back and try again.
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => router.push('/eligibility')}
            sx={{
              backgroundColor: '#1a3c6e',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              px: 5,
              py: 1.3,
              borderRadius: 1.5,
              minWidth: 220,
              '&:hover': { backgroundColor: '#15325c' },
            }}
          >
            Back to Eligibility
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/')}
            sx={{
              borderColor: '#1a3c6e',
              color: '#1a3c6e',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              px: 5,
              py: 1.3,
              borderRadius: 1.5,
              minWidth: 220,
              '&:hover': { borderColor: '#15325c', backgroundColor: '#f5f5f5' },
            }}
          >
            Close Application
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
