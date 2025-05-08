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

const DeletePatient = () => {
  const url = import.meta.env.VITE_API_URL;

  const emailRef = useRef();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);

  const validate = () => {
    const errs = {};
    if (!emailRef.current.value) {
      errs.email = ["Email is required"];
    } else if (!/^\S+@\S+\.\S+$/.test(emailRef.current.value)) {
      errs.email = ["Enter a valid email address"];
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      email: emailRef.current.value,
    };

    axios
      .delete(`${url}/api/patients`, { data: payload }) // Sending DELETE request with email payload
      .then((res) => {
        setSuccess(true);
        setErrors(null);
        console.log("Patient deleted:", res.data);

        // Clear the email field
        emailRef.current.value = "";
      })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 404) {
          setErrors({ general: ["Patient not found"] });
        } else {
          setErrors({
            general: ["Failed to delete patient. Please try again."],
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
        Delete Patient
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Patient deleted successfully!
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
          inputRef={emailRef}
          label="Email"
          type="email"
          error={!!errors?.email}
          helperText={errors?.email?.join(", ")}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          DELETE PATIENT
        </Button>
      </Box>
    </Paper>
  );
};

export default DeletePatient;
