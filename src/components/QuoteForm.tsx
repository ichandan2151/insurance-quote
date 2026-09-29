'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { isValidUSZipCode } from '@/utils/zipCodeValidator';
import { getStateFromZip } from '@/utils/zipToState';
import LoadingScreen from '@/components/LoadingScreen';

const NAME_MAX_LENGTH = 15;

interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  zipCode: string;
  tobacco: boolean | null;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  zipCode?: string;
  tobacco?: string;
}

function calculateAge(dob: string): number {
  const [month, day, year] = dob.split('/').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function QuoteForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    zipCode: '',
    tobacco: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof FormData, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const formatDob = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Legal First Name is a required field';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Legal Last Name is a required field';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is a required field';
    } else {
      const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
      if (!dobRegex.test(formData.dob)) {
        newErrors.dob = 'Date of Birth must be entered\nMM/DD/YYYY';
      } else {
        const age = calculateAge(formData.dob);
        if (age < 50 || age > 80) {
          newErrors.dob = 'Age must be between 50 and 80';
        }
      }
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender (At Birth) is a required field';
    }

    if (!formData.zipCode) {
      newErrors.zipCode = 'Residence Zip Code is a required field';
    } else if (!isValidUSZipCode(formData.zipCode)) {
      newErrors.zipCode = 'Enter a valid US zip code';
    }

    if (formData.tobacco === null) newErrors.tobacco = 'Please select an option';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setLoading(true);
      const [month, day, year] = formData.dob.split('/');
      const dobFormatted = `${year}-${month}-${day}`;

      const { data, error } = await supabase
        .from('quote_submissions')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          date_of_birth: dobFormatted,
          gender: formData.gender,
          zip_code: formData.zipCode,
          tobacco_use: formData.tobacco,
          coverage_amount: 35000,
          rate_class: 'Level Preferred',
          status: 'draft',
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving quote:', error);
      }

      const params = new URLSearchParams({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        gender: formData.gender,
        zipCode: formData.zipCode,
        tobacco: formData.tobacco ? 'yes' : 'no',
        ...(data?.id ? { quoteId: data.id } : {}),
      });
      router.push(`/quote?${params.toString()}`);
    }
  };

  // Zip code state lookup
  const stateInfo = formData.zipCode.length === 5 ? getStateFromZip(formData.zipCode) : null;

  return (
    <>
    {loading && <LoadingScreen />}
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#6BA4E0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 6,
        px: 2,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: '#fff',
          mb: 4,
          fontWeight: 300,
          textAlign: 'center',
        }}
      >
        Get a quote
      </Typography>

      <Paper
        elevation={0}
        sx={{
          maxWidth: 700,
          width: '100%',
          borderRadius: 3,
          p: { xs: 3, sm: 5 },
        }}
      >
        {/* Row 1: First Name + Last Name */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Legal First Name"
            placeholder="First name"
            required
            fullWidth
            variant="outlined"
            value={formData.firstName}
            onChange={(e) => {
              const val = e.target.value.slice(0, NAME_MAX_LENGTH);
              handleChange('firstName', val);
            }}
            error={!!errors.firstName}
            helperText={errors.firstName}
            slotProps={{ htmlInput: { maxLength: NAME_MAX_LENGTH } }}
          />
          <TextField
            label="Legal Last Name"
            placeholder="Last name"
            required
            fullWidth
            variant="outlined"
            value={formData.lastName}
            onChange={(e) => {
              const val = e.target.value.slice(0, NAME_MAX_LENGTH);
              handleChange('lastName', val);
            }}
            error={!!errors.lastName}
            helperText={errors.lastName}
            slotProps={{ htmlInput: { maxLength: NAME_MAX_LENGTH } }}
          />
        </Box>

        {/* Row 2: DOB + Gender */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Date of Birth"
            placeholder="MM/DD/YYYY"
            required
            fullWidth
            variant="outlined"
            value={formData.dob}
            onChange={(e) => handleChange('dob', formatDob(e.target.value))}
            error={!!errors.dob}
            helperText={
              errors.dob
                ? errors.dob.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && errors.dob!.includes('\n') && <br />}
                    </span>
                  ))
                : undefined
            }
            slotProps={{ htmlInput: { maxLength: 10 } }}
          />
          <FormControl fullWidth required error={!!errors.gender}>
            <InputLabel>Gender (At Birth)</InputLabel>
            <Select
              value={formData.gender}
              label="Gender (At Birth)"
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
          </FormControl>
        </Box>

        {/* Row 3: Zip Code */}
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Residence Zip Code"
            placeholder="00000"
            required
            fullWidth
            variant="outlined"
            value={formData.zipCode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 5);
              handleChange('zipCode', val);
            }}
            error={!!errors.zipCode}
            helperText={
              errors.zipCode
                ? errors.zipCode
                : stateInfo
                  ? undefined
                  : undefined
            }
            slotProps={{ htmlInput: { maxLength: 5 } }}
          />
          {stateInfo && !errors.zipCode && (
            <Typography variant="caption" sx={{ color: '#4caf50', mt: 0.5, ml: 1.75, display: 'block' }}>
              {stateInfo.abbr} — {stateInfo.name} (from ZIP)
            </Typography>
          )}
        </Box>

        {/* Row 4: Tobacco */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="body1">
              Have you used tobacco in any form in the last 12 months?
            </Typography>
            <Tooltip
              title="Tobacco includes any product containing nicotine such as cigarettes, electronic cigarettes, vapes, cigars, pipes, nicotine patch, or chewing tobacco."
              arrow
              placement="top"
            >
              <IconButton size="small" sx={{ ml: 0.5 }}>
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', gap: 0 }}>
            <Button
              variant={formData.tobacco === true ? 'contained' : 'outlined'}
              onClick={() => handleChange('tobacco', true)}
              sx={{
                flex: 1,
                py: 2,
                borderRadius: '8px 0 0 8px',
                borderColor: errors.tobacco ? '#d32f2f' : '#ccc',
                color: formData.tobacco === true ? '#fff' : '#333',
                backgroundColor: formData.tobacco === true ? '#1a3c6e' : 'transparent',
                '&:hover': {
                  backgroundColor: formData.tobacco === true ? '#15325c' : '#f5f5f5',
                  borderColor: errors.tobacco ? '#d32f2f' : '#999',
                },
              }}
            >
              Yes
            </Button>
            <Button
              variant={formData.tobacco === false ? 'contained' : 'outlined'}
              onClick={() => handleChange('tobacco', false)}
              sx={{
                flex: 1,
                py: 2,
                borderRadius: '0 8px 8px 0',
                borderColor: errors.tobacco ? '#d32f2f' : '#ccc',
                color: formData.tobacco === false ? '#fff' : '#333',
                backgroundColor: formData.tobacco === false ? '#1a3c6e' : 'transparent',
                '&:hover': {
                  backgroundColor: formData.tobacco === false ? '#15325c' : '#f5f5f5',
                  borderColor: errors.tobacco ? '#d32f2f' : '#999',
                },
              }}
            >
              No
            </Button>
          </Box>
          {errors.tobacco && (
            <FormHelperText error sx={{ mt: 1 }}>
              {errors.tobacco}
            </FormHelperText>
          )}
        </Box>

        {/* Submit */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              textTransform: 'none',
            }}
          >
            Get Quote
          </Button>
        </Box>
      </Paper>
    </Box>
    </>
  );
}
