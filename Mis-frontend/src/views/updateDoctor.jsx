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

const UpdateDoctor = () => {
  const url = import.meta.env.VITE_API_URL;

  // Refs for filters
  const filterNameRef = useRef();
  const filterExperienceRef = useRef();
  const filterSpecialtyRef = useRef();

  // Refs for updates
  const incExperienceRef = useRef();
  const setStatusRef = useRef();

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);

  const validate = () => {
    const errs = {};
    const hasFilter =
      filterNameRef.current.value ||
      filterExperienceRef.current.value ||
      filterSpecialtyRef.current.value;

    const hasUpdate =
      incExperienceRef.current.value || setStatusRef.current.value;

    if (!hasFilter) {
      errs.filter = ["At least one filter is required"];
    }
    if (!hasUpdate) {
      errs.update = ["At least one update field is required"];
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

    const update = {};
    if (incExperienceRef.current.value) {
      update["$inc"] = {
        experienceYears: parseInt(incExperienceRef.current.value),
      };
    }
    if (setStatusRef.current.value) {
      update["$set"] = {
        ...(update["$set"] || {}),
        status: setStatusRef.current.value,
      };
    }
    console.log({ filter, update });

    axios
      .patch(`${url}/api/doctors`, { filter, update })
      .then((res) => {
        setSuccess(true);
        setErrors(null);
        console.log("Doctor updated:", res.data);

        // Clear fields
        filterNameRef.current.value = "";
        filterExperienceRef.current.value = "";
        filterSpecialtyRef.current.value = "";
        incExperienceRef.current.value = "";
        setStatusRef.current.value = "";
      })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 422) {
          setErrors(res.data.errors);
        } else {
          setErrors({ general: ["Failed to update doctor."] });
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
        Update Doctor Record
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Doctor updated successfully!
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

        <Typography variant="h6" sx={{ mt: 2 }}>
          Update
        </Typography>

        <TextField
          fullWidth
          inputRef={incExperienceRef}
          label="Increment Experience Years"
          type="number"
          sx={{ mb: 2 }}
          error={!!errors?.update}
          helperText={errors?.update?.join(", ")}
        />

        <TextField
          fullWidth
          inputRef={setStatusRef}
          label="Set Status"
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          UPDATE DOCTOR
        </Button>
      </Box>
    </Paper>
  );
};

export default UpdateDoctor;
