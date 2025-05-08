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

const UpdatePatient = () => {
  const url = import.meta.env.VITE_API_URL;

  // Filter refs
  const filterNameRef = useRef();
  const filterAgeRef = useRef();
  const filterEmailRef = useRef();

  // Update refs
  const setNameRef = useRef();
  const setAgeRef = useRef();
  const setEmailRef = useRef();
  const setComorbiditiesRef = useRef();
  const setAddressRef = useRef();

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);

  const validate = () => {
    const errs = {};
    const hasFilter =
      filterNameRef.current.value ||
      filterAgeRef.current.value ||
      filterEmailRef.current.value;
    const hasUpdate =
      setNameRef.current.value ||
      setAgeRef.current.value ||
      setEmailRef.current.value ||
      setComorbiditiesRef.current.value ||
      setAddressRef.current.value;

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
    if (filterAgeRef.current.value) {
      filter.age = parseInt(filterAgeRef.current.value);
    }
    if (filterEmailRef.current.value) {
      filter.email = filterEmailRef.current.value;
    }

    const update = {};
    if (setNameRef.current.value) {
      update["$set"] = { name: setNameRef.current.value };
    }
    if (setAgeRef.current.value) {
      update["$set"] = {
        ...update["$set"],
        age: parseInt(setAgeRef.current.value),
      };
    }
    if (setEmailRef.current.value) {
      update["$set"] = { ...update["$set"], email: setEmailRef.current.value };
    }
    if (setComorbiditiesRef.current.value) {
      update["$set"] = {
        ...update["$set"],
        comorbidities: setComorbiditiesRef.current.value
          .split(",")
          .map((s) => s.trim()),
      };
    }
    if (setAddressRef.current.value) {
      // Assuming address input as a string (for simplicity) - You can break it down more if needed
      update["$set"] = {
        ...update["$set"],
        address: setAddressRef.current.value,
      };
    }

    axios
      .patch(`${url}/api/patients`, { filter, update })
      .then((res) => {
        setSuccess(true);
        setErrors(null);
        console.log("Patient updated:", res.data);

        // Clear fields
        filterNameRef.current.value = "";
        filterAgeRef.current.value = "";
        filterEmailRef.current.value = "";
        setNameRef.current.value = "";
        setAgeRef.current.value = "";
        setEmailRef.current.value = "";
        setComorbiditiesRef.current.value = "";
        setAddressRef.current.value = "";
      })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 422) {
          setErrors(res.data.errors);
        } else {
          setErrors({ general: ["Failed to update patient."] });
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
        Update Patient Record
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Patient updated successfully!
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
          inputRef={filterAgeRef}
          label="Age (Filter)"
          type="number"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={filterEmailRef}
          label="Email (Filter)"
          sx={{ mb: 2 }}
        />

        <Typography variant="h6" sx={{ mt: 2 }}>
          Update
        </Typography>

        <TextField
          fullWidth
          inputRef={setNameRef}
          label="Set Name"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={setAgeRef}
          label="Set Age"
          type="number"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={setEmailRef}
          label="Set Email"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={setComorbiditiesRef}
          label="Set Comorbidities (comma-separated)"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={setAddressRef}
          label="Set Address"
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          UPDATE PATIENT
        </Button>
      </Box>
    </Paper>
  );
};

export default UpdatePatient;
