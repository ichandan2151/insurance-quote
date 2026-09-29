'use client';

import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(107, 164, 224, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        gap: 3,
      }}
    >
      <CircularProgress size={50} sx={{ color: '#fff' }} />
      <Typography sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 400 }}>
        Loading...
      </Typography>
    </Box>
  );
}
