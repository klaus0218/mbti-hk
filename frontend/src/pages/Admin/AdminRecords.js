import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Typography,
  Pagination,
  CircularProgress,
  Button,
  Chip,
  Container,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
  Psychology as MBTIIcon,
  AccessTime as TimeIcon,
  Assessment as StatsIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useAdmin } from '../../contexts/AdminContext';
import { adminApi } from '../../services/api';

// Add this component for "No Data" display
const NoDataMessage = ({ searchTerm }) => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight={300}
    flexDirection="column"
    gap={2}
  >
    <Typography variant="h6" color="text.secondary">
      No Test Records Found
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center">
      {searchTerm 
        ? `No test records match the search term "${searchTerm}"`
        : "There are no test records in the system yet"}
    </Typography>
  </Box>
);

const AdminRecords = () => {
  const [testRecords, setTestRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const { token } = useAdmin();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchTestRecords = async (currentPage, searchTerm = '') => {
    setLoading(true);
    try {
      const data = await adminApi.getTestResults(token, {
        page: currentPage,
        search: searchTerm
      });
      setTestRecords(data.results);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching test records:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      fetchTestRecords(page, search);
    }, 500);

    setSearchTimeout(timeoutId);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [page, search, token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (ms) => {
    if (!ms) return '-';
    return `${Math.round(ms / 1000)}s`;
  };

  const TestRecordCard = ({ record }) => {
    // Helper function to get gender icon
    const GenderIcon = () => {
      switch (record.demographics?.gender) {
        case 'male':
          return <MaleIcon sx={{ color: '#2196F3' }} />; // Blue for male
        case 'female':
          return <FemaleIcon sx={{ color: '#E91E63' }} />; // Pink for female
        default:
          return <PersonIcon color="action" />; // Default grey for other/prefer not to say
      }
    };

    return (
      <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          {/* Header with Name and Gender */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" component="div">
              <Box display="flex" alignItems="center" gap={1}>
                {GenderIcon()}
                {record.demographics?.name || 'Anonymous'}
              </Box>
            </Typography>
            <Chip
              label={record.isComplete ? 'Complete' : 'Incomplete'}
              color={record.isComplete ? 'success' : 'warning'}
              size="small"
            />
          </Box>

          {/* MBTI Type */}
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <MBTIIcon color="primary" />
            <Typography variant="body1" fontWeight="medium">
              {record.mbtiType || 'Incomplete'}
            </Typography>
          </Box>

          {/* Email if available */}
          {record.demographics?.email && (
            <Typography variant="body2" color="text.secondary" mb={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon fontSize="small" />
                {record.demographics.email}
              </Box>
            </Typography>
          )}

          {/* Completion Time */}
          <Typography variant="body2" color="text.secondary">
            <Box display="flex" alignItems="center" gap={1}>
              <TimeIcon fontSize="small" />
              {new Date(record.createdAt).toLocaleString()}
            </Box>
          </Typography>
        </CardContent>

        <CardActions sx={{ mt: 'auto', justifyContent: 'flex-end', paddingTop: '0px' }}>
          <Button
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => navigate(`/admin/records/${record.sessionId}`)}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Test Records
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by MBTI type, session ID, or language..."
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : testRecords.length === 0 ? (
          <NoDataMessage searchTerm={search} />
        ) : (
          <>
            <Grid container spacing={2}>
              {testRecords.map((record) => (
                <Grid item xs={12} sm={6} md={4} key={record.sessionId}>
                  <TestRecordCard record={record} />
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default AdminRecords; 
