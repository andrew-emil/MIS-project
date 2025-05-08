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

const DeleteDoctor = () => {
  const url = import.meta.env.VITE_API_URL;

  // Refs for filters
  const filterNameRef = useRef();
  const filterExperienceRef = useRef();
  const filterSpecialtyRef = useRef();

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);

  const validate = () => {
    const errs = {};
    const hasFilter =
      filterNameRef.current.value ||
      filterExperienceRef.current.value ||
      filterSpecialtyRef.current.value;

    if (!hasFilter) {
      errs.filter = ["At least one filter is required"];
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const filter = {};
    if (filterNameRef.current.value) {
      filter.name = filterNameRef.current.value;
    }
    if (filterExperienceRef.current.value) {
      filter.experienceYears = parseInt(filterExperienceRef.current.value);
    }
    if (filterSpecialtyRef.current.value) {
      filter.specialty = filterSpecialtyRef.current.value;
    }

    axios
      .delete(`${url}/api/doctors`, { data: filter }) // DELETE request with filter
      .then((res) => {
        setSuccess(true);
        setErrors(null);
        console.log("Doctor deleted:", res.data);

        // Clear fields
        filterNameRef.current.value = "";
        filterExperienceRef.current.value = "";
        filterSpecialtyRef.current.value = "";
      })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 404) {
          setErrors({ general: ["Doctor not found"] });
        } else {
          setErrors({
            general: ["Failed to delete doctor. Please try again."],
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
        Delete Doctor Record
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Doctor deleted successfully!
        </Alert>
      )}

      {errors?.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general.join(", ")}
        </Alert>
      )}

      <Box component="form" onSubmit={submit} noValidate>
        <Typography variant="h6" sx={{ mt: 1 }}>
          Filter
        </Typography>

        <TextField
          fullWidth
          inputRef={filterNameRef}
          label="Name (Filter)"
          sx={{ mb: 2 }}
          error={!!errors?.filter}
          helperText={errors?.filter?.join(", ")}
        />

        <TextField
          fullWidth
          inputRef={filterExperienceRef}
          label="Experience Years (Filter)"
          type="number"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={filterSpecialtyRef}
          label="Specialty (Filter)"
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          DELETE DOCTOR
        </Button>
      </Box>
    </Paper>
  );
};

export default DeleteDoctor;
