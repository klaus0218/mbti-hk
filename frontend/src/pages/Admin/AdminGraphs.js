import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  CircularProgress,
  Chip,
  OutlinedInput,
  useTheme,
  Button,
  Stack
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAdmin } from '../../contexts/AdminContext';
import { adminApi } from '../../services/api';

const INDUSTRIES = [
  'All',
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Other'
];

const AGE_RANGES = [
  'All',
  'under 18',
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55+'
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const DEFAULT_FILTERS = {
  gender: 'All',
  industries: ['All'],
  ageRanges: ['All']
};

function getStyles(item, selectedItems, theme) {
  return {
    fontWeight:
      selectedItems.indexOf(item) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// Add this component for "No Data" display
const NoDataMessage = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight={400}
    flexDirection="column"
    gap={2}
  >
    <Typography variant="h6" color="text.secondary">
      No Data Available
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Try adjusting your filters or wait for more user data
    </Typography>
  </Box>
);

const AdminGraphs = () => {
  const { token } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tempFilters, setTempFilters] = useState(DEFAULT_FILTERS);
  const theme = useTheme();

  const fetchData = async (appliedFilters) => {
    setLoading(true);
    try {
      // Process filters before sending to API
      const apiFilters = {
        gender: appliedFilters.gender === 'All' ? '' : appliedFilters.gender,
        industries: appliedFilters.industries.includes('All') ? [] : appliedFilters.industries,
        ageRanges: appliedFilters.ageRanges.includes('All') ? [] : appliedFilters.ageRanges.map(range => range.replace("-", "_").replace(" ", "_"))
      };

      const response = await adminApi.getMBTIDistribution(token, apiFilters);
      if (response) {
        const sortedData = response.sort((a, b) => b.percentage - a.percentage);
        setData(sortedData);
      }
    } catch (error) {
      console.error('Error fetching MBTI distribution:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(filters);
  }, [token]); // Only fetch on mount and token change

  const handleGenderChange = (event) => {
    setTempFilters(prev => ({
      ...prev,
      gender: event.target.value
    }));
  };

  const handleIndustryChange = (event) => {
    const value = event.target.value;
    
    // Handle "All" selection logic
    let newIndustries;
    if (value.includes('All')) {
      newIndustries = ['All'];
    } else {
      newIndustries = value.filter(v => v !== 'All');
    }

    setTempFilters(prev => ({
      ...prev,
      industries: newIndustries
    }));
  };

  const handleAgeRangeChange = (event) => {
    const value = event.target.value;
    
    // Handle "All" selection logic
    let newAgeRanges;
    if (value.includes('All')) {
      newAgeRanges = ['All'];
    } else {
      newAgeRanges = value.filter(v => v !== 'All');
    }

    setTempFilters(prev => ({
      ...prev,
      ageRanges: newAgeRanges
    }));
  };

  const handleApply = () => {
    setFilters(tempFilters);
    fetchData(tempFilters);
  };

  const handleClear = () => {
    setTempFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    fetchData(DEFAULT_FILTERS);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        MBTI Type Distribution
      </Typography>

      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>

              {/* Gender Filter */}
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={tempFilters.gender}
                  label="Gender"
                  onChange={handleGenderChange}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              {/* Industry Filter */}
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Industries</InputLabel>
                <Select
                  multiple
                  value={tempFilters.industries}
                  onChange={handleIndustryChange}
                  input={<OutlinedInput label="Industries" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {INDUSTRIES.map((industry) => (
                    <MenuItem
                      key={industry}
                      value={industry}
                      style={getStyles(industry, tempFilters.industries, theme)}
                    >
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Age Range Filter */}
              <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel>Age Ranges</InputLabel>
                <Select
                  multiple
                  value={tempFilters.ageRanges}
                  onChange={handleAgeRangeChange}
                  input={<OutlinedInput label="Age Ranges" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {AGE_RANGES.map((range) => (
                    <MenuItem
                      key={range}
                      value={range}
                      style={getStyles(range, tempFilters.ageRanges, theme)}
                    >
                      {range}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Filter Actions */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleApply}
                >
                  Apply
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={9}>
          <Card>
            <CardContent>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <CircularProgress />
                </Box>
              ) : data.length === 0 ? (
                <NoDataMessage />
              ) : (
                <>
                  <Box height={400}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="percentage" name="Percentage (%)" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* Distribution Table */}
                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                      Distribution Details
                    </Typography>
                    <Grid container spacing={2}>
                      {data.map((item) => (
                        <Grid item xs={6} sm={4} md={3} key={item.type}>
                          <Box p={2} border={1} borderColor="divider" borderRadius={1}>
                            <Typography variant="h6" align="center">
                              {item.type}
                            </Typography>
                            <Typography color="textSecondary" align="center">
                              {item.count} users
                            </Typography>
                            <Typography variant="body2" align="center">
                              {item.percentage.toFixed(1)}%
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminGraphs; 
