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

const DeleteHospital = () => {
  const url = import.meta.env.VITE_API_URL; // Ensure this is set in your .env file

  const nameRef = useRef();
  const locationRef = useRef();

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);

  const validate = () => {
    const errs = {};
    if (!nameRef.current.value) {
      errs.name = ["Hospital name is required"];
    }
    if (!locationRef.current.value) {
      errs.location = ["Location is required"];
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: nameRef.current.value,
      location: locationRef.current.value,
    };

    axios
      .delete(`${url}/api/hospitals`, { data: payload }) // DELETE request with name and location
      .then((res) => {
        setSuccess(true);
        setErrors(null);
        console.log("Hospital deleted:", res.data);

        // Clear the form fields
        nameRef.current.value = "";
        locationRef.current.value = "";
      })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 404) {
          setErrors({ general: ["Hospital not found"] });
        } else {
          setErrors({
            general: ["Failed to delete hospital. Please try again."],
          });
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
        Delete Hospital
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Hospital deleted successfully!
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
          inputRef={nameRef}
          label="Hospital Name"
          error={!!errors?.name}
          helperText={errors?.name?.join(", ")}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          inputRef={locationRef}
          label="Location"
          error={!!errors?.location}
          helperText={errors?.location?.join(", ")}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          DELETE HOSPITAL
        </Button>
      </Box>
    </Paper>
  );
};

export default DeleteHospital;
