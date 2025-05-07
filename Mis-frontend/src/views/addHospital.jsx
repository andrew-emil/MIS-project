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

const AddHospital = () => {
  const url = import.meta.env.VITE_API_URL;

  const nameRef = useRef();
  const locationRef = useRef();
  const operatingRoomsRef = useRef();
  const avgUtilizationRef = useRef();

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!nameRef.current.value) newErrors.name = ["Name is required"];
    if (!locationRef.current.value)
      newErrors.location = ["Location is required"];
    if (!operatingRoomsRef.current.value)
      newErrors.operatingRooms = ["Operating rooms required"];
    if (!avgUtilizationRef.current.value)
      newErrors.avgUtilization = ["Avg. Utilization required"];

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: nameRef.current.value,
      location: locationRef.current.value,
      resourceMetadata: {
        operatingRooms: parseInt(operatingRoomsRef.current.value),
        avgUtilization: parseFloat(avgUtilizationRef.current.value),
      },
    };

    axios
      .post(`${url}/api/hospitals`, payload)
      .then(({ data }) => {
        setSuccess(true);
        setErrors(null);
        console.log("Hospital added:", data);
        nameRef.current.value = "";
        locationRef.current.value = "";
        operatingRoomsRef.current.value = "";
        avgUtilizationRef.current.value = "";
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
        Add New Hospital
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Hospital added successfully!
        </Alert>
      )}

      {errors?.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general.join(", ")}
        </Alert>
      )}

      <Box component="form" onSubmit={submit} noValidate>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            inputRef={nameRef}
            label="Name *"
            error={!!errors?.name}
            helperText={errors?.name?.join(", ")}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            inputRef={locationRef}
            label="Location *"
            error={!!errors?.location}
            helperText={errors?.location?.join(", ")}
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Resource Metadata
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            sx={{ flex: 1 }}
            inputRef={operatingRoomsRef}
            label="Operating Rooms *"
            type="number"
            error={!!errors?.operatingRooms}
            helperText={errors?.operatingRooms?.join(", ")}
          />
          <TextField
            sx={{ flex: 1 }}
            inputRef={avgUtilizationRef}
            label="Avg. Utilization (%) *"
            type="number"
            error={!!errors?.avgUtilization}
            helperText={errors?.avgUtilization?.join(", ")}
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

export default AddHospital;
