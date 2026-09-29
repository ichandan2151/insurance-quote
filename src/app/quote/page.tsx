'use client';

import { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Divider, Button, Paper } from '@mui/material';
import { supabase } from '@/lib/supabase';
import QuoteBuilder from '@/components/QuoteBuilder';
import PolicyTotal from '@/components/PolicyTotal';
import OptionalRiders from '@/components/OptionalRiders';
import { calculatePremium, getPremiumForRateClass, getRateClasses, getAnnualPremium, calculateRiderCost } from '@/utils/premiumCalculator';
import LoadingScreen from '@/components/LoadingScreen';

function QuotePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';
  const isTobacco = searchParams.get('tobacco') === 'yes';
  const quoteId = searchParams.get('quoteId') || null;

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
  const [selectedRiderNames, setSelectedRiderNames] = useState<Record<string, string>>({});
  const [includedRiders, setIncludedRiders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRiders() {
      const { data, error } = await supabase
        .from('riders')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching riders:', error);
      } else {
        setIncludedRiders((data || []).filter((r) => r.rider_type === 'included').map((r) => r.name));
        const nameMap: Record<string, string> = {};
        (data || []).filter((r) => r.rider_type === 'optional').forEach((r) => {
          nameMap[r.id] = r.name;
        });
        setSelectedRiderNames(nameMap);
      }
    }
    fetchRiders();
  }, []);

  // Debounce timer for DB updates
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const syncToDb = useCallback((updates: Record<string, unknown>) => {
    if (!quoteId) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const { error } = await supabase
        .from('quote_submissions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', quoteId);
      if (error) console.error('Error updating quote:', error);
    }, 500);
  }, [quoteId]);

  const handlePremiumChange = (newPremium: number | null, newCoverage: number, newRateClass: string) => {
    setPremium(newPremium);
    setCoverage(newCoverage);
    setRateClass(newRateClass);

    syncToDb({
      coverage_amount: newCoverage,
      rate_class: newRateClass,
      monthly_premium: newPremium,
      annual_premium: newPremium !== null ? getAnnualPremium(newPremium) : null,
    });
  };

  const handleRiderToggle = (riderId: string) => {
    setSelectedRiders((prev) => {
      const updated = prev.includes(riderId)
        ? prev.filter((r) => r !== riderId)
        : [...prev, riderId];

      syncToDb({ selected_riders: updated });
      return updated;
    });
  };

  return (
    <>
    {loading && <LoadingScreen />}
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
                riderCost={calculateRiderCost(coverage)}
              />
            </Box>
          </Box>

          {/* RIGHT: Policy Total */}
          <Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0 }}>
            <PolicyTotal
              monthlyPremium={premium}
              coverage={coverage}
              rateClass={rateClass}
              riders={includedRiders}
              selectedRidersCost={selectedRiders.map((id) => ({
                name: selectedRiderNames[id] || 'Rider',
                cost: calculateRiderCost(coverage),
              }))}
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
          onClick={() => {
            setLoading(true);
            const params = new URLSearchParams({
              ...(quoteId ? { quoteId } : {}),
              firstName,
              lastName,
              tobacco: isTobacco ? 'yes' : 'no',
              coverage: coverage.toString(),
              rateClass,
              premium: premium?.toString() || '',
            });
            router.push(`/eligibility?${params.toString()}`);
          }}
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
    </>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<Box sx={{ minHeight: '100vh', backgroundColor: '#6BA4E0' }} />}>
      <QuotePageContent />
    </Suspense>
  );
}
