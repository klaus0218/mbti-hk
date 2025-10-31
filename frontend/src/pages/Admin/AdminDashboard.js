import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  PlayArrow as StartIcon,
  CheckCircle as CompleteIcon
} from '@mui/icons-material';
import { useAdmin } from '../../contexts/AdminContext';
import { adminApi } from '../../services/api';

const StatCard = ({ title, value, icon: Icon, loading }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <Typography variant="h4">
              {value}
            </Typography>
          )}
        </Box>
        <Icon sx={{ fontSize: 40, opacity: 0.3 }} />
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('all');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { token } = useAdmin();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await adminApi.getStats(token, timeRange);
        const statsMap = data.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {});
        setStats(statsMap);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
      setLoading(false);
    };

    fetchStats();
  }, [timeRange, token]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <FormControl variant="outlined" size="small">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="day">Last 24 Hours</MenuItem>
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Website Visits"
            value={stats.visit || 0}
            icon={PeopleIcon}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Tests Started"
            value={stats.start_test || 0}
            icon={StartIcon}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Tests Completed"
            value={stats.complete_test || 0}
            icon={CompleteIcon}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Completion Rate Card */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Completion Rate
          </Typography>
          <Typography variant="h3" component="div">
            {loading ? (
              <CircularProgress size={30} />
            ) : (
              `${((stats.complete_test || 0) / (stats.start_test || 1) * 100).toFixed(1)}%`
            )}
          </Typography>
          <Typography color="textSecondary">
            of started tests were completed
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard; 
