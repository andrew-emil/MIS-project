import React, { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";

const AddSurgery = () => {
  const url = import.meta.env.VITE_API_URL;

  const procedureTypeRef = useRef();
  const durationRef = useRef();
  const dateRef = useRef();
  const patientIdRef = useRef();
  const surgeonIdRef = useRef();
  const [complications, setComplications] = useState(false);

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!procedureTypeRef.current.value)
      newErrors.procedureType = ["Procedure type is required"];
    if (!durationRef.current.value)
      newErrors.duration = ["Duration is required"];
    if (!dateRef.current.value) newErrors.date = ["Date is required"];
    if (!patientIdRef.current.value)
      newErrors.patientId = ["Patient ID is required"];
    if (!surgeonIdRef.current.value)
      newErrors.surgeonId = ["Surgeon ID is required"];
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      procedureType: procedureTypeRef.current.value,
      duration: parseInt(durationRef.current.value),
      date: new Date(dateRef.current.value).toISOString(),
      complications: complications,
      patientId: patientIdRef.current.value,
      surgeonId: surgeonIdRef.current.value,
    };

    axios
      .post(`${url}/api/surgeries`, payload)
      .then(({ data }) => {
        setSuccess(true);
        setErrors(null);
        console.log("Surgery added:", data);

        // Clear fields
        procedureTypeRef.current.value = "";
        durationRef.current.value = "";
        dateRef.current.value = "";
        patientIdRef.current.value = "";
        surgeonIdRef.current.value = "";
        setComplications(false);
      })
      .catch((err) => {
        const res = err.response;
        if (res && res.status === 422) {
          setErrors(res.data.errors);
        } else {
          setErrors({ general: ["An error occurred. Please try again."] });
        }
        setSuccess(false);
      });
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 4, maxWidth: 600, margin: "auto", mt: 4 }}
    >
      <Typography variant="h5" gutterBottom>
        Add New Surgery
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Surgery added successfully!
        </Alert>
      )}

      {errors?.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general.join(", ")}
        </Alert>
      )}

      <Box component="form" onSubmit={submit} noValidate>
        <TextField
          fullWidth
          inputRef={procedureTypeRef}
          label="Procedure Type *"
          sx={{ mb: 2 }}
          error={!!errors?.procedureType}
          helperText={errors?.procedureType?.join(", ")}
        />

        <TextField
          fullWidth
          inputRef={durationRef}
          label="Duration (minutes) *"
          type="number"
          sx={{ mb: 2 }}
          error={!!errors?.duration}
          helperText={errors?.duration?.join(", ")}
        />

        <TextField
          fullWidth
          inputRef={dateRef}
          label="Date & Time *"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
          error={!!errors?.date}
          helperText={errors?.date?.join(", ")}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={complications}
              onChange={(e) => setComplications(e.target.checked)}
            />
          }
          label="Complications occurred"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={patientIdRef}
          label="Patient ID *"
          sx={{ mb: 2 }}
          error={!!errors?.patientId}
          helperText={errors?.patientId?.join(", ")}
        />

        <TextField
          fullWidth
          inputRef={surgeonIdRef}
          label="Surgeon ID *"
          sx={{ mb: 2 }}
          error={!!errors?.surgeonId}
          helperText={errors?.surgeonId?.join(", ")}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          SUBMIT
        </Button>
      </Box>
    </Paper>
  );
};

export default AddSurgery;
