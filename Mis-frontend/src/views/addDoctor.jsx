import React, { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";

const AddDoctor = () => {
  const url = import.meta.env.VITE_API_URL;

  const nameRef = useRef();
  const experienceYearsRef = useRef();
  const specialtyRef = useRef();
  const hospitalIdRef = useRef();
  const successRateRef = useRef();

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!nameRef.current.value) newErrors.name = ["Name is required"];
    if (!experienceYearsRef.current.value)
      newErrors.experienceYears = ["Experience is required"];
    if (!specialtyRef.current.value)
      newErrors.specialty = ["Specialty is required"];
    if (!hospitalIdRef.current.value)
      newErrors.hospitalId = ["Hospital ID is required"];
    if (!successRateRef.current.value)
      newErrors.successRate = ["Success rate is required"];

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();

    if (!validateForm()) return;

    const payload = [
      {
        name: nameRef.current.value,
        experienceYears: parseInt(experienceYearsRef.current.value),
        specialty: specialtyRef.current.value,
        hospitalId: hospitalIdRef.current.value,
        successRate: successRateRef.current.value
          .split(",")
          .map((s) => parseInt(s.trim())),
      },
    ];

    axios
      .post(`${url}/api/many/doctors`, payload)
      .then(({ data }) => {
        setSuccess(true);
        setErrors(null);
        console.log("Doctor added successfully:", data);

        // Clear form
        nameRef.current.value = "";
        experienceYearsRef.current.value = "";
        specialtyRef.current.value = "";
        hospitalIdRef.current.value = "";
        successRateRef.current.value = "";
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
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
        Add New Doctor
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Doctor added successfully!
        </Alert>
      )}

      {errors?.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general.join(", ")}
        </Alert>
      )}

      <Box component="form" onSubmit={submit} noValidate>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            sx={{ flex: 1 }}
            inputRef={nameRef}
            label="Name *"
            error={!!errors?.name}
            helperText={errors?.name?.join(", ")}
          />
          <TextField
            sx={{ flex: 1 }}
            inputRef={experienceYearsRef}
            label="Experience Years *"
            type="number"
            error={!!errors?.experienceYears}
            helperText={errors?.experienceYears?.join(", ")}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            inputRef={specialtyRef}
            label="Specialty *"
            error={!!errors?.specialty}
            helperText={errors?.specialty?.join(", ")}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            inputRef={hospitalIdRef}
            label="Hospital ID *"
            error={!!errors?.hospitalId}
            helperText={errors?.hospitalId?.join(", ")}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            inputRef={successRateRef}
            label="Success Rate (%) - comma separated *"
            placeholder="e.g., 95, 96, 94"
            error={!!errors?.successRate}
            helperText={errors?.successRate?.join(", ")}
          />
        </Box>

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

export default AddDoctor;
