'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Paper, Divider, Switch, Button } from '@mui/material';
import LoadingScreen from '@/components/LoadingScreen';

const CRITERIA = [
  'Be a US citizen or permanent resident',
  'Not replacing an existing Continental General policy',
  'Applying and signing in their state of residence',
];

const CONDITIONS = [
  'Cardiomyopathy, heart failure, pulmonary hypertension, defibrillator implanted, cirrhosis of the liver, chronic pancreatitis',
  'Chronic Obstructive Pulmonary Disease (COPD) with nicotine or tobacco use in any form',
  "Alzheimer's, dementia, cognitive impairment, schizophrenia, ALS, Huntington's Chorea, cystic fibrosis, recurrent history of cancer",
  'Diabetes with complications of heart or circulatory disorder, amputation, insulin shock, and/or diabetic coma',
  'Received or pending to receive organ or bone marrow transplant, stem cell treatment, renal dialysis, or paralyzed in two or more limbs',
  'Diagnosed with AIDS (Acquired Immunodeficiency Syndrome) or tested positive with HIV',
  'Heart surgery or cancer in the past 12 months',
  'Felony conviction, incarcerated, alcohol or drug abuse treatment, illegal use of drugs, or suicide attempt in the past 24 months',
  'Currently admitted to a hospital or long-term rehab facility, residing in a nursing home, assisted living, skilled nursing facility or receiving home health or hospice care',
  'Requires assistance with bathing, dressing, toileting, eating, transferring, taking medications, or handling financial affairs',
  'Requires use of wheelchair, electric scooter, walker, oxygen equipment',
  'Diagnosed with a terminal illness',
];

function EligibilityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const allParams = searchParams.toString();

  return (
    <>
    {loading && <LoadingScreen />}
    <Box sx={{ minHeight: '100vh', backgroundColor: '#6BA4E0', py: 3, px: 2 }}>
      {/* Title — aligned with card */}
      <Box sx={{ maxWidth: 1050, width: '100%', mx: 'auto', mb: 2.5 }}>
        <Typography
          sx={{
            color: '#fff',
            fontWeight: 300,
            fontSize: '2.5rem',
            fontStyle: 'italic',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          Confirm Eligibility
        </Typography>
      </Box>

      {/* Main Card */}
      <Paper
        elevation={0}
        sx={{ maxWidth: 1050, width: '100%', mx: 'auto', borderRadius: 2, p: { xs: 3, sm: 5 } }}
      >
        {/* Criteria Section */}
        <Typography sx={{ color: '#1a3c6e', fontWeight: 600, fontSize: '1.05rem', mb: 2 }}>
          Your applicant must meet these 3 criteria to consider applying:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 0 }}>
          {CRITERIA.map((item) => (
            <Box component="li" key={item} sx={{ mb: 1, color: '#444', fontSize: '0.95rem' }}>
              {item}
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Conditions Section */}
        <Typography sx={{ color: '#1a3c6e', fontWeight: 600, fontSize: '1.05rem', mb: 2 }}>
          Your applicant must not have any of the following conditions:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 0 }}>
          {CONDITIONS.map((item) => (
            <Box component="li" key={item} sx={{ mb: 1.5, color: '#444', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {item}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Confirmation Toggle */}
      <Box
        sx={{
          maxWidth: 1050,
          width: '100%',
          mx: 'auto',
          mt: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Switch
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: '#1a3c6e' },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#1a3c6e' },
          }}
        />
        <Typography sx={{ color: '#fff', fontSize: '1rem' }}>
          I confirm that I have discussed these conditions with my applicant and they meet ALL the above standards
        </Typography>
      </Box>

      {/* Back / Next */}
      <Box
        sx={{
          maxWidth: 1050,
          width: '100%',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Button
          onClick={() => router.back()}
          sx={{ color: '#1a3c6e', textTransform: 'none', fontSize: '1rem', fontWeight: 600 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          disabled={!confirmed}
          onClick={() => { setLoading(true); router.push('/error-page'); }}
          sx={{
            backgroundColor: '#1a3c6e',
            textTransform: 'none',
            fontSize: '1.05rem',
            fontWeight: 600,
            px: 8,
            py: 1.5,
            borderRadius: 2,
            minWidth: 180,
            '&:hover': { backgroundColor: '#15325c' },
            '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#999' },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
    </>
  );
}

export default function EligibilityPage() {
  return (
    <Suspense fallback={<Box sx={{ minHeight: '100vh', backgroundColor: '#6BA4E0' }} />}>
      <EligibilityContent />
    </Suspense>
  );
}
