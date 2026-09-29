'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from '@mui/material';
import BuildChartModal from '@/components/BuildChartModal';
import MedicationGuideModal from '@/components/MedicationGuideModal';
import {
  calculatePremium,
  calculateCoverageFromPremium,
  getPremiumForRateClass,
  getCoverageForRateClass,
  getRateClasses,
  getBasePremiumRange,
  MIN_COVERAGE,
  MAX_COVERAGE,
} from '@/utils/premiumCalculator';

interface QuoteBuilderProps {
  isTobacco: boolean;
  onPremiumChange: (premium: number | null, coverage: number, rateClass: string) => void;
}

export default function QuoteBuilder({ isTobacco, onPremiumChange }: QuoteBuilderProps) {
  const rateClassMap = getRateClasses(isTobacco);
  const rateClassNames = Object.keys(rateClassMap);
  const defaultRateClass = rateClassNames[0];

  const [quoteBy, setQuoteBy] = useState<'coverage' | 'premium'>('coverage');
  const [coverage, setCoverage] = useState(35000);
  const [coverageInput, setCoverageInput] = useState('$35,000');
  const [premiumInput, setPremiumInput] = useState('');
  const [rateClass, setRateClass] = useState(defaultRateClass);
  const [buildChartOpen, setBuildChartOpen] = useState(false);
  const [medGuideOpen, setMedGuideOpen] = useState(false);

  useEffect(() => {
    const newDefault = Object.keys(getRateClasses(isTobacco))[0];
    setRateClass(newDefault);
    const newPremium = getPremiumForRateClass(calculatePremium(coverage, isTobacco), newDefault, isTobacco);
    onPremiumChange(newPremium, coverage, newDefault);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTobacco]);

  const basePremium = calculatePremium(coverage, isTobacco);
  const { min: premiumRangeMin, max: premiumRangeMax } = getBasePremiumRange(isTobacco);

  // Validation
  const premiumNum = parseFloat(premiumInput.replace(/[^0-9.]/g, ''));
  const isPremiumBelowMin = !isNaN(premiumNum) && premiumNum < premiumRangeMin;
  const isPremiumAboveMax = !isNaN(premiumNum) && premiumNum > premiumRangeMax;
  const coverageNum = parseInt(coverageInput.replace(/[^0-9]/g, ''), 10);
  const isCoverageBelowMin = !isNaN(coverageNum) && coverageNum > 0 && coverageNum < MIN_COVERAGE;
  const isCoverageAboveMax = !isNaN(coverageNum) && coverageNum > MAX_COVERAGE;

  const handleQuoteByChange = (_: React.MouseEvent<HTMLElement>, val: string | null) => {
    if (val) {
      const newMode = val as 'coverage' | 'premium';
      setQuoteBy(newMode);
      if (newMode === 'premium') {
        // Pre-fill with the current base premium for the current coverage
        const currentBasePremium = calculatePremium(coverage, isTobacco);
        setPremiumInput('$' + currentBasePremium.toFixed(2));
      } else {
        setCoverageInput('$' + coverage.toLocaleString());
      }
    }
  };

  const handleCoverageInput = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '');
    if (digits === '') { setCoverageInput(''); return; }
    const num = parseInt(digits, 10);
    setCoverageInput('$' + num.toLocaleString());
    if (!isNaN(num) && num >= MIN_COVERAGE && num <= MAX_COVERAGE) {
      setCoverage(num);
      const newPremium = getPremiumForRateClass(calculatePremium(num, isTobacco), rateClass, isTobacco);
      onPremiumChange(newPremium, num, rateClass);
    }
  };

  const handleCoverageBlur = () => {
    if (isCoverageBelowMin || isCoverageAboveMax) return;
    const num = parseInt(coverageInput.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      setCoverage(num);
      setCoverageInput('$' + num.toLocaleString());
    }
  };

  const handlePremiumInputChange = (value: string) => {
    const clean = value.replace(/[^0-9.]/g, '');
    setPremiumInput(clean ? '$' + clean : '');
    const num = parseFloat(clean);
    if (!isNaN(num) && num >= premiumRangeMin && num <= premiumRangeMax) {
      const newCoverage = calculateCoverageFromPremium(num, isTobacco);
      setCoverage(newCoverage);
      setCoverageInput('$' + newCoverage.toLocaleString());
      const newPremium = getPremiumForRateClass(calculatePremium(newCoverage, isTobacco), rateClass, isTobacco);
      onPremiumChange(newPremium, newCoverage, rateClass);
    }
  };

  const handlePremiumBlur = () => {
    if (isPremiumBelowMin || isPremiumAboveMax) return;
  };

  const handleRateClassChange = (newRateClass: string) => {
    setRateClass(newRateClass);
    const clamped = Math.max(MIN_COVERAGE, Math.min(MAX_COVERAGE, coverage));
    const newPremium = getPremiumForRateClass(calculatePremium(clamped, isTobacco), newRateClass, isTobacco);
    onPremiumChange(newPremium, coverage, newRateClass);
  };

  // Modified classes show N/A in coverage mode
  const shouldShowNA = (rc: string) => {
    const rcPremium = getPremiumForRateClass(basePremium, rc, isTobacco);
    if (rcPremium === null) return true;
    if (quoteBy === 'coverage' && rc.startsWith('Modified')) return true;
    return false;
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.35rem' }}>Quote Builder</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.72rem', color: '#999', letterSpacing: 1 }}>QUOTE BY</Typography>
          <ToggleButtonGroup
            value={quoteBy}
            exclusive
            onChange={handleQuoteByChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none', px: 1.5, py: 0.2, fontSize: '0.78rem',
                borderRadius: '14px !important', border: '1px solid #bbb',
                '&.Mui-selected': {
                  backgroundColor: '#1a3c6e', color: '#fff', border: '1px solid #1a3c6e',
                  '&:hover': { backgroundColor: '#15325c' },
                },
              },
            }}
          >
            <ToggleButton value="coverage">Coverage</ToggleButton>
            <ToggleButton value="premium">Monthly Premium</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Labels row: Amount + Rate Class / buttons */}
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 0.8 }}>
        <Box sx={{ width: 210, flexShrink: 0 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#666' }}>
            {quoteBy === 'coverage' ? 'Amount' : 'Base Premium'}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'nowrap' }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#666', whiteSpace: 'nowrap' }}>Rate Class</Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setBuildChartOpen(true)}
            sx={{
              textTransform: 'none', fontSize: '0.78rem', py: 0.4, px: 1.5,
              borderRadius: '4px', borderColor: '#ccc', color: '#333',
              whiteSpace: 'nowrap', minWidth: 'auto', lineHeight: 1.4,
            }}
          >
            Build Chart
          </Button>
          <Button
            size="small"
            onClick={() => setMedGuideOpen(true)}
            sx={{
              textTransform: 'none', fontSize: '0.78rem', py: 0.4, px: 1.5,
              borderRadius: '4px', backgroundColor: '#1a3c6e', color: '#fff',
              whiteSpace: 'nowrap', minWidth: 'auto', lineHeight: 1.4,
              '&:hover': { backgroundColor: '#15325c' },
            }}
          >
            Medication Guide
          </Button>
        </Box>
      </Box>

      {/* Input + Rate Class Table */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Input */}
        <Box sx={{ width: 210, flexShrink: 0 }}>
          <TextField
            value={quoteBy === 'coverage' ? coverageInput : premiumInput}
            onChange={(e) => quoteBy === 'coverage' ? handleCoverageInput(e.target.value) : handlePremiumInputChange(e.target.value)}
            onBlur={quoteBy === 'coverage' ? handleCoverageBlur : handlePremiumBlur}
            variant="outlined"
            fullWidth
            size="small"
            error={quoteBy === 'coverage' ? (isCoverageBelowMin || isCoverageAboveMax) : (isPremiumBelowMin || isPremiumAboveMax)}
            helperText={
              quoteBy === 'coverage'
                ? (isCoverageBelowMin ? 'Coverage Amount below minimum' : isCoverageAboveMax ? 'Coverage Amount above maximum' : undefined)
                : (isPremiumBelowMin ? 'Base Premium below minimum' : isPremiumAboveMax ? 'Base Premium above maximum' : undefined)
            }
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          />
        </Box>

        {/* Rate Class Table */}
        <Box sx={{ flex: 1 }}>
          {/* Table header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, py: 0.8, borderBottom: '1px solid #ddd' }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: 0.5, color: '#888' }}>
              RATE CLASS
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: 0.5, color: '#888' }}>
              {quoteBy === 'coverage' ? 'MONTHLY PREMIUM' : 'COVERAGE'}
            </Typography>
          </Box>

          {/* Table rows */}
          <RadioGroup value={rateClass} onChange={(e) => handleRateClassChange(e.target.value)}>
            {rateClassNames.map((rc) => {
              const rcPremium = getPremiumForRateClass(basePremium, rc, isTobacco);
              const rcCoverage = getCoverageForRateClass(coverage, rc, isTobacco);
              const isNA = shouldShowNA(rc);

              return (
                <Box
                  key={rc}
                  sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    px: 1, py: 1.2, borderBottom: '1px solid #f0f0f0',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <FormControlLabel
                    value={rc}
                    control={<Radio size="small" sx={{ p: 0.5 }} />}
                    label={
                      <Typography sx={{ fontSize: '0.88rem', fontWeight: rateClass === rc ? 600 : 400, color: isNA ? '#aaa' : 'inherit', ml: 0.5 }}>
                        {rc}
                      </Typography>
                    }
                    disabled={isNA}
                    sx={{ m: 0 }}
                  />
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: rateClass === rc ? 600 : 400, color: isNA ? '#aaa' : '#333' }}>
                    {isNA ? 'N/A' : quoteBy === 'coverage'
                      ? `$${rcPremium!.toFixed(2)}`
                      : `$${rcCoverage!.toLocaleString()}`
                    }
                  </Typography>
                </Box>
              );
            })}
          </RadioGroup>
        </Box>
      </Box>

      <BuildChartModal open={buildChartOpen} onClose={() => setBuildChartOpen(false)} />
      <MedicationGuideModal open={medGuideOpen} onClose={() => setMedGuideOpen(false)} />
    </Box>
  );
}
