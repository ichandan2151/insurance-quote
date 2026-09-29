'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Divider, Button, Paper } from '@mui/material';
import QuoteBuilder from '@/components/QuoteBuilder';
import PolicyTotal from '@/components/PolicyTotal';
import OptionalRiders from '@/components/OptionalRiders';
import { calculatePremium, getPremiumForRateClass, getRateClasses } from '@/utils/premiumCalculator';

const INCLUDED_RIDERS = ['Accelerated Death Benefit Rider for Terminal Illness'];

function QuotePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';
  const isTobacco = searchParams.get('tobacco') === 'yes';

  const initialCoverage = 35000;
  const initialRateClass = Object.keys(getRateClasses(isTobacco))[0];
  const initialPremium = getPremiumForRateClass(
    calculatePremium(initialCoverage, isTobacco),
    initialRateClass,
    isTobacco
  );

  const [premium, setPremium] = useState<number | null>(initialPremium);
  const [coverage, setCoverage] = useState(initialCoverage);
  const [rateClass, setRateClass] = useState(initialRateClass);
  const [selectedRiders, setSelectedRiders] = useState<string[]>([]);

  const handlePremiumChange = (newPremium: number | null, newCoverage: number, newRateClass: string) => {
    setPremium(newPremium);
    setCoverage(newCoverage);
    setRateClass(newRateClass);
  };

  const handleRiderToggle = (riderId: string) => {
    setSelectedRiders((prev) =>
      prev.includes(riderId) ? prev.filter((r) => r !== riderId) : [...prev, riderId]
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#6BA4E0', py: 3, px: 2 }}>
      {/* Quote Title */}
      <Typography
        sx={{
          color: '#fff',
          fontWeight: 300,
          textAlign: 'center',
          mb: 2.5,
          fontSize: '2.5rem',
          fontStyle: 'italic',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        Quote
      </Typography>

      {/* Main White Card */}
      <Paper
        elevation={0}
        sx={{ maxWidth: 1050, width: '100%', mx: 'auto', borderRadius: 2, pb: 4 }}
      >
        {/* Header */}
        <Box sx={{ px: 5, pt: 3 }}>
          <Divider />
          <Typography sx={{ textAlign: 'center', py: 2, color: '#333', fontSize: '1.05rem' }}>
            Your Applicant&apos;s NewBridge Final Expense Insurance Quote
          </Typography>
        </Box>

        {/* Two column layout */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, px: 5, gap: 4 }}>
          {/* LEFT: Quote Builder + Optional Riders */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <QuoteBuilder isTobacco={isTobacco} onPremiumChange={handlePremiumChange} />
            <Box sx={{ mt: 2 }}>
              <OptionalRiders
                selectedRiders={selectedRiders}
                onRiderToggle={handleRiderToggle}
              />
            </Box>
          </Box>

          {/* RIGHT: Policy Total */}
          <Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0 }}>
            <PolicyTotal
              monthlyPremium={premium}
              coverage={coverage}
              rateClass={rateClass}
              riders={INCLUDED_RIDERS}
            />
          </Box>
        </Box>
      </Paper>

      {/* Back / Next */}
      <Box
        sx={{
          maxWidth: 1050,
          width: '100%',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 3,
        }}
      >
        <Button
          onClick={() => router.push('/')}
          sx={{ color: '#1a3c6e', textTransform: 'none', fontSize: '1rem', fontWeight: 600 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
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
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<Box sx={{ minHeight: '100vh', backgroundColor: '#6BA4E0' }} />}>
      <QuotePageContent />
    </Suspense>
  );
}
