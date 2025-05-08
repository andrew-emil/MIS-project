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

const UpdateSurgery = () => {
  const url = import.meta.env.VITE_API_URL;

  // Filter refs
  const filterProcedureTypeRef = useRef();
  const filterDurationRef = useRef();
  const filterDateRef = useRef(); // New ref for Date filter

  // Update refs
  const setProcedureTypeRef = useRef();
  const setDurationRef = useRef();
  const setDateRef = useRef();
  const setComplicationsRef = useRef();
  const setPatientIdRef = useRef();
  const setSurgeonIdRef = useRef();

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);

  const validate = () => {
    const errs = {};
    const hasFilter =
      filterProcedureTypeRef.current.value ||
      filterDurationRef.current.value ||
      filterDateRef.current.value; // Include filter date check
    const hasUpdate =
      setProcedureTypeRef.current.value ||
      setDurationRef.current.value ||
      setDateRef.current.value ||
      setComplicationsRef.current.value ||
      setPatientIdRef.current.value ||
      setSurgeonIdRef.current.value;

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
    if (filterProcedureTypeRef.current.value) {
      filter.procedureType = filterProcedureTypeRef.current.value;
    }
    if (filterDurationRef.current.value) {
      filter.duration = parseInt(filterDurationRef.current.value);
    }
    if (filterDateRef.current.value) {
      filter.date = new Date(filterDateRef.current.value); // Adding date filter
    }

    const update = {};
    if (setProcedureTypeRef.current.value) {
      update["$set"] = { procedureType: setProcedureTypeRef.current.value };
    }
    if (setDurationRef.current.value) {
      update["$set"] = {
        ...update["$set"],
        duration: parseInt(setDurationRef.current.value),
      };
    }
    if (setDateRef.current.value) {
      update["$set"] = {
        ...update["$set"],
        date: new Date(setDateRef.current.value),
      };
    }
    if (setComplicationsRef.current.value !== undefined) {
      update["$set"] = {
        ...update["$set"],
        complications: setComplicationsRef.current.checked,
      };
    }
    if (setPatientIdRef.current.value) {
      update["$set"] = {
        ...update["$set"],
        patientId: setPatientIdRef.current.value,
      };
    }
    if (setSurgeonIdRef.current.value) {
      update["$set"] = {
        ...update["$set"],
        surgeonId: setSurgeonIdRef.current.value,
      };
    }

    axios
      .patch(`${url}/api/surgeries`, { filter, update })
      .then((res) => {
        setSuccess(true);
        setErrors(null);
        console.log("Surgery updated:", res.data);

        // Clear fields
        filterProcedureTypeRef.current.value = "";
        filterDurationRef.current.value = "";
        filterDateRef.current.value = ""; // Clear filter date
        setProcedureTypeRef.current.value = "";
        setDurationRef.current.value = "";
        setDateRef.current.value = "";
        setComplicationsRef.current.checked = false;
        setPatientIdRef.current.value = "";
        setSurgeonIdRef.current.value = "";
      })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 422) {
          setErrors(res.data.errors);
        } else {
          setErrors({ general: ["Failed to update surgery."] });
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
        Update Surgery Record
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Surgery updated successfully!
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

        <Typography variant="h6" sx={{ mt: 2 }}>
          Update
        </Typography>

        <TextField
          fullWidth
          inputRef={setProcedureTypeRef}
          label="Set Procedure Type"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={setDurationRef}
          label="Set Duration"
          type="number"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={setDateRef}
          label="Set Date"
          type="datetime-local"
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <label>
            <input type="checkbox" ref={setComplicationsRef} />
            Complications
          </label>
        </Box>

        <TextField
          fullWidth
          inputRef={setPatientIdRef}
          label="Set Patient ID"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={setSurgeonIdRef}
          label="Set Surgeon ID"
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          UPDATE SURGERY
        </Button>
      </Box>
    </Paper>
  );
};

export default UpdateSurgery;
