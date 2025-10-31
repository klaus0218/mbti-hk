import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useAdmin } from '../../contexts/AdminContext';
import { adminApi } from '../../services/api';

const AdminRecordDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { token } = useAdmin();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchRecordDetail = async () => {
      try {
        const data = await adminApi.getRecordDetail(token, sessionId);
        setRecord(data);
      } catch (error) {
        console.error('Error fetching record details:', error);
      }
      setLoading(false);
    };

    fetchRecordDetail();
  }, [sessionId, token]);

  const handleDelete = async () => {
    try {
      await adminApi.deleteRecord(token, sessionId);
      navigate('/admin/records');
    } catch (error) {
      console.error('Error deleting record:', error);
    }
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!record) {
    return (
      <Box>
        <Typography variant="h5">User not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">MBTI Result Details</Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* User Demographics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>User Demographics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Name</Typography>
                  <Typography variant="body1">{record.demographics?.name || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Age Range</Typography>
                  <Typography variant="body1">{record.demographics?.ageRange || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Gender</Typography>
                  <Typography variant="body1">{record.demographics?.gender || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Industry</Typography>
                  <Typography variant="body1">
                    {record.demographics?.industry ? record.demographics.industry.toLowerCase() : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Email</Typography>
                  <Typography variant="body1">{record.demographics?.email || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Phone</Typography>
                  <Typography variant="body1">{record.demographics?.phone || '-'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* MBTI Type Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>MBTI Type Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">MBTI Type</Typography>
                  <Typography variant="h5">{record.mbtiType || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Type Title</Typography>
                  <Typography variant="h5">{record.typeInfo?.title || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary">Description</Typography>
                  <Typography variant="body1">{record.typeInfo?.description || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Type Strength</Typography>
                  <Typography variant="body1">{`${record.typeStrength || 0}%`}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary">Completion Date</Typography>
                  <Typography variant="body1">
                    {record.createdAt ? new Date(record.createdAt).toLocaleString() : '-'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Scores */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Dimension Scores</Typography>
              <Grid container spacing={3}>
                {/* Raw Scores */}
                <Grid item xs={12} md={6}>
                  <Typography color="textSecondary" gutterBottom>Raw Scores</Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={6}>
                        <Typography variant="body2" color="textSecondary">E/I Score</Typography>
                        <Typography variant="h6">E: {record.scores?.raw?.E || '-'} / I: {record.scores?.raw?.I || '-'}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Typography variant="body2" color="textSecondary">S/N Score</Typography>
                        <Typography variant="h6">S: {record.scores?.raw?.S || '-'} / N: {record.scores?.raw?.N || '-'}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Typography variant="body2" color="textSecondary">T/F Score</Typography>
                        <Typography variant="h6">T: {record.scores?.raw?.T || '-'} / F: {record.scores?.raw?.F || '-'}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Typography variant="body2" color="textSecondary">J/P Score</Typography>
                        <Typography variant="h6">J: {record.scores?.raw?.J || '-'} / P: {record.scores?.raw?.P || '-'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Normalized Scores */}
                <Grid item xs={12} md={6}>
                  <Typography color="textSecondary" gutterBottom>Normalized Scores (%)</Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={6}>
                        <Typography variant="body2" color="textSecondary">E/I Score</Typography>
                        <Typography variant="h6">E: {record.scores?.normalized?.E || '0'}% / I: {record.scores?.normalized?.I || '0'}%</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Typography variant="body2" color="textSecondary">S/N Score</Typography>
                        <Typography variant="h6">S: {record.scores?.normalized?.S || '0'}% / N: {record.scores?.normalized?.N || '0'}%</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Typography variant="body2" color="textSecondary">T/F Score</Typography>
                        <Typography variant="h6">T: {record.scores?.normalized?.T || '0'}% / F: {record.scores?.normalized?.F || '0'}%</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Typography variant="body2" color="textSecondary">J/P Score</Typography>
                        <Typography variant="h6">J: {record.scores?.normalized?.J || '0'}% / P: {record.scores?.normalized?.P || '0'}%</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Confidence Levels */}
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>Confidence Levels</Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="textSecondary">E/I Confidence</Typography>
                        <Typography variant="h6">{`${record.confidence?.EI || 0}%`}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="textSecondary">S/N Confidence</Typography>
                        <Typography variant="h6">{`${record.confidence?.SN || 0}%`}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="textSecondary">T/F Confidence</Typography>
                        <Typography variant="h6">{`${record.confidence?.TF || 0}%`}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="textSecondary">J/P Confidence</Typography>
                        <Typography variant="h6">{`${record.confidence?.JP || 0}%`}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Questions and Answers */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Test Questions and Answers</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography color="textSecondary" gutterBottom>
                    Total Questions: {record.statistics?.totalQuestions || 0}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Completion: {record.statistics?.completionPercentage || 0}%
                  </Typography>
                </Grid>
                {record.questions?.map((question, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Question {index + 1} - Category: {question.category}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {question.text}
                      </Typography>
                      <Typography>
                        Selected Option: {question.answer.selectedOption.text}
                        (Value: {question.answer.selectedOption.value})
                      </Typography>
                      <Typography color="textSecondary" variant="body2">
                        Score: {question.answer.score}
                      </Typography>
                      <Typography color="textSecondary" variant="body2">
                        Response Time: {question.answer.responseTime}ms
                      </Typography>
                      <Typography color="textSecondary" variant="body2">
                        Answered at: {new Date(question.answer.timestamp).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminRecordDetail; 
