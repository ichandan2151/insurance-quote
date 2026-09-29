'use client';

import {
  Dialog,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface BuildChartModalProps {
  open: boolean;
  onClose: () => void;
}

const BUILD_CHART_DATA = [
  { height: '4\'8"', preferred: [81, 178], standard: [179, 196], modified: [197, 214] },
  { height: '4\'9"', preferred: [83, 185], standard: [186, 203], modified: [204, 221] },
  { height: '4\'10"', preferred: [86, 191], standard: [192, 210], modified: [211, 229] },
  { height: '4\'11"', preferred: [89, 198], standard: [199, 218], modified: [219, 237] },
  { height: '5\'0"', preferred: [93, 205], standard: [206, 225], modified: [226, 245], highlighted: true },
  { height: '5\'1"', preferred: [96, 211], standard: [212, 233], modified: [234, 254] },
  { height: '5\'2"', preferred: [101, 218], standard: [219, 240], modified: [241, 262] },
  { height: '5\'3"', preferred: [104, 226], standard: [227, 248], modified: [249, 271] },
  { height: '5\'4"', preferred: [106, 233], standard: [234, 256], modified: [257, 279] },
  { height: '5\'5"', preferred: [109, 240], standard: [241, 264], modified: [265, 288] },
  { height: '5\'6"', preferred: [113, 248], standard: [249, 272], modified: [273, 297], highlighted: true },
  { height: '5\'7"', preferred: [116, 255], standard: [256, 281], modified: [282, 306] },
  { height: '5\'8"', preferred: [121, 263], standard: [264, 289], modified: [290, 315] },
  { height: '5\'9"', preferred: [125, 271], standard: [272, 298], modified: [299, 325] },
  { height: '5\'10"', preferred: [129, 279], standard: [280, 307], modified: [308, 335] },
  { height: '5\'11"', preferred: [133, 287], standard: [288, 315], modified: [316, 344] },
  { height: '6\'0"', preferred: [136, 295], standard: [296, 324], modified: [325, 353], highlighted: true },
  { height: '6\'1"', preferred: [140, 303], standard: [304, 333], modified: [334, 363] },
  { height: '6\'2"', preferred: [143, 311], standard: [312, 343], modified: [344, 373] },
  { height: '6\'3"', preferred: [147, 320], standard: [321, 352], modified: [353, 384] },
  { height: '6\'4"', preferred: [151, 329], standard: [330, 361], modified: [362, 394] },
  { height: '6\'5"', preferred: [155, 337], standard: [338, 371], modified: [372, 404] },
  { height: '6\'6"', preferred: [159, 346], standard: [347, 381], modified: [382, 415], highlighted: true },
  { height: '6\'7"', preferred: [163, 355], standard: [356, 390], modified: [391, 426] },
  { height: '6\'8"', preferred: [167, 364], standard: [365, 401], modified: [402, 437] },
];

const headerCellSx = {
  fontWeight: 700,
  fontSize: '0.75rem',
  color: '#333',
  borderBottom: '2px solid #1a3c6e',
  py: 1,
  px: 1.5,
  textAlign: 'center' as const,
  whiteSpace: 'nowrap' as const,
};

const cellSx = {
  py: 1,
  px: 1.5,
  textAlign: 'center' as const,
  fontSize: '0.85rem',
  borderBottom: '1px solid #e0e0e0',
};

const highlightedCellSx = {
  ...cellSx,
  backgroundColor: '#e8eef7',
  fontWeight: 600,
};

export default function BuildChartModal({ open, onClose }: BuildChartModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, maxHeight: '85vh' } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ pt: 0, px: 2, pb: 3 }}>
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              {/* Group header row */}
              <TableRow>
                <TableCell
                  rowSpan={2}
                  sx={{
                    ...headerCellSx,
                    borderBottom: '2px solid #1a3c6e',
                    backgroundColor: '#fff',
                    verticalAlign: 'bottom',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Height
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    (Feet)
                  </Typography>
                </TableCell>
                <TableCell
                  colSpan={2}
                  sx={{
                    ...headerCellSx,
                    borderBottom: '1px solid #ccc',
                    backgroundColor: '#fff',
                  }}
                >
                  Preferred
                </TableCell>
                <TableCell
                  colSpan={2}
                  sx={{
                    ...headerCellSx,
                    borderBottom: '1px solid #ccc',
                    backgroundColor: '#fff',
                  }}
                >
                  Standard
                </TableCell>
                <TableCell
                  colSpan={2}
                  sx={{
                    ...headerCellSx,
                    borderBottom: '1px solid #ccc',
                    backgroundColor: '#fff',
                  }}
                >
                  Modified
                </TableCell>
              </TableRow>
              {/* Sub-header row */}
              <TableRow>
                {['Preferred', 'Standard', 'Modified'].map((group) => (
                  ['Min Weight', 'Max Weight'].map((label) => (
                    <TableCell
                      key={`${group}-${label}`}
                      sx={{
                        ...headerCellSx,
                        backgroundColor: '#fff',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {label}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        (lbs)
                      </Typography>
                    </TableCell>
                  ))
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {BUILD_CHART_DATA.map((row) => {
                const sx = row.highlighted ? highlightedCellSx : cellSx;
                return (
                  <TableRow key={row.height} hover>
                    <TableCell sx={{ ...sx, fontWeight: 600 }}>{row.height}</TableCell>
                    <TableCell sx={sx}>{row.preferred[0]}</TableCell>
                    <TableCell sx={sx}>{row.preferred[1]}</TableCell>
                    <TableCell sx={sx}>{row.standard[0]}</TableCell>
                    <TableCell sx={sx}>{row.standard[1]}</TableCell>
                    <TableCell sx={sx}>{row.modified[0]}</TableCell>
                    <TableCell sx={sx}>{row.modified[1]}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
