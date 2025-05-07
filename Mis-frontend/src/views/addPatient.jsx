import React, { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios"; // Changed from axiosClient to axios

const AddPatient = () => {
  const url = import.meta.env.VITE_API_URL; // Ensure this is set in your .env file
  const nameRef = useRef();
  const ageRef = useRef();
  const emailRef = useRef();
  const comorbiditiesRef = useRef();
  const streetRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const zipRef = useRef();

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!nameRef.current.value) newErrors.name = ["Name is required"];
    if (!ageRef.current.value) newErrors.age = ["Age is required"];
    if (!emailRef.current.value) {
      newErrors.email = ["Email is required"];
    } else if (!/^\S+@\S+\.\S+$/.test(emailRef.current.value)) {
      newErrors.email = ["Enter a valid email address"];
    }

    // Address validation
    if (!streetRef.current.value) newErrors.street = ["Street is required"];
    if (!cityRef.current.value) newErrors.city = ["City is required"];
    if (!stateRef.current.value) newErrors.state = ["State is required"];
    if (!zipRef.current.value) {
      newErrors.zip = ["ZIP code is required"];
    } else if (!/^\d+$/.test(zipRef.current.value)) {
      newErrors.zip = ["ZIP code must be numeric"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();

    if (!validateForm()) return;

    const payload = {
      name: nameRef.current.value,
      age: parseInt(ageRef.current.value),
      email: emailRef.current.value,
      comorbidities: comorbiditiesRef.current.value
        ? comorbiditiesRef.current.value.split(",").map((s) => s.trim())
        : [],
      address: {
        street: streetRef.current.value,
        city: cityRef.current.value,
        state: stateRef.current.value,
        zip: zipRef.current.value,
      },
    };
    console.log(url);
    // Changed from axiosClient to axios
    axios
      .post(`${url}/api/patients`, payload)
      .then(({ data }) => {
        setSuccess(true);
        setErrors(null);
        console.log("Patient added successfully:", data);
        // Clear form after successful submission
        nameRef.current.value = "";
        ageRef.current.value = "";
        emailRef.current.value = "";
        comorbiditiesRef.current.value = "";
        streetRef.current.value = "";
        cityRef.current.value = "";
        stateRef.current.value = "";
        zipRef.current.value = "";
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
        Add New Patient
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Patient added successfully!
        </Alert>
      )}

      {errors?.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general.join(", ")}
        </Alert>
      )}

      <Box component="form" onSubmit={submit} noValidate>
        {/* Name and Age row */}
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
            inputRef={ageRef}
            label="Age *"
            type="number"
            error={!!errors?.age}
            helperText={errors?.age?.join(", ")}
          />
        </Box>

        {/* Email */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            inputRef={emailRef}
            label="Email *"
            type="email"
            error={!!errors?.email}
            helperText={errors?.email?.join(", ")}
          />
        </Box>

        {/* Comorbidities */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            inputRef={comorbiditiesRef}
            label="Comorbidities (comma-separated)"
            placeholder="e.g., diabetes, hypertension"
          />
        </Box>

        {/* Address section */}
        <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
          Address
        </Typography>

        {/* Street and City */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            sx={{ flex: 1 }}
            inputRef={streetRef}
            label="Street *"
            error={!!errors?.street}
            helperText={errors?.street?.join(", ")}
          />
          <TextField
            sx={{ flex: 1 }}
            inputRef={cityRef}
            label="City *"
            error={!!errors?.city}
            helperText={errors?.city?.join(", ")}
          />
        </Box>

        {/* State and ZIP */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            sx={{ flex: 1 }}
            inputRef={stateRef}
            label="State *"
            error={!!errors?.state}
            helperText={errors?.state?.join(", ")}
          />
          <TextField
            sx={{ flex: 1 }}
            inputRef={zipRef}
            label="ZIP *"
            error={!!errors?.zip}
            helperText={errors?.zip?.join(", ")}
          />
        </Box>

        {/* Submit button */}
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

export default AddPatient;
