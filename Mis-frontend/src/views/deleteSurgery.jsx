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

const DeleteSurgery = () => {
  const url = import.meta.env.VITE_API_URL;

  // Filter refs for surgery
  const filterProcedureTypeRef = useRef();
  const filterDurationRef = useRef();
  const filterDateRef = useRef(); // New ref for Date filter

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);

  const validate = () => {
    const errs = {};
    const hasFilter =
      filterProcedureTypeRef.current.value ||
      filterDurationRef.current.value ||
      filterDateRef.current.value; // Include filter date check

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
    if (filterProcedureTypeRef.current.value) {
      filter.procedureType = filterProcedureTypeRef.current.value;
    }
    if (filterDurationRef.current.value) {
      filter.duration = parseInt(filterDurationRef.current.value);
    }
    if (filterDateRef.current.value) {
      filter.date = new Date(filterDateRef.current.value); // Adding date filter
    }

    axios
      .delete(`${url}/api/surgeries`, { data: filter }) // DELETE request with filter
      .then((res) => {
        setSuccess(true);
        setErrors(null);
        console.log("Surgery deleted:", res.data);

        // Clear fields
        filterProcedureTypeRef.current.value = "";
        filterDurationRef.current.value = "";
        filterDateRef.current.value = ""; // Clear filter date
      })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 404) {
          setErrors({ general: ["Surgery not found"] });
        } else {
          setErrors({
            general: ["Failed to delete surgery. Please try again."],
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
        Delete Surgery Record
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Surgery deleted successfully!
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
          inputRef={filterProcedureTypeRef}
          label="Procedure Type (Filter)"
          sx={{ mb: 2 }}
          error={!!errors?.filter}
          helperText={errors?.filter?.join(", ")}
        />

        <TextField
          fullWidth
          inputRef={filterDurationRef}
          label="Duration (Filter)"
          type="number"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={filterDateRef} // New field for filtering by date
          label="Date (Filter)"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          DELETE SURGERY
        </Button>
      </Box>
    </Paper>
  );
};

export default DeleteSurgery;
