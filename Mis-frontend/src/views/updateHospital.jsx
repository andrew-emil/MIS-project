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

const UpdateHospital = () => {
  const url = import.meta.env.VITE_API_URL;

  // Filter refs
  const filterNameRef = useRef();
  const filterLocationRef = useRef();

  // Update refs
  const setNameRef = useRef();
  const setLocationRef = useRef();
  const setOperatingRoomsRef = useRef();
  const setAvgUtilizationRef = useRef();

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);

  const validate = () => {
    const errs = {};
    const hasFilter =
      filterNameRef.current.value || filterLocationRef.current.value;
    const hasUpdate =
      setNameRef.current.value ||
      setLocationRef.current.value ||
      setOperatingRoomsRef.current.value ||
      setAvgUtilizationRef.current.value;

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
    if (filterLocationRef.current.value) {
      filter.location = filterLocationRef.current.value;
    }

    const update = {};
    if (setNameRef.current.value) {
      update["$set"] = { name: setNameRef.current.value };
    }
    if (setLocationRef.current.value) {
      update["$set"] = {
        ...update["$set"],
        location: setLocationRef.current.value,
      };
    }
    if (setOperatingRoomsRef.current.value) {
      update["$set"] = {
        ...update["$set"],
        "resourceMetadata.operatingRooms": parseInt(
          setOperatingRoomsRef.current.value
        ),
      };
    }
    if (setAvgUtilizationRef.current.value) {
      update["$set"] = {
        ...update["$set"],
        "resourceMetadata.avgUtilization": parseFloat(
          setAvgUtilizationRef.current.value
        ),
      };
    }

    axios
      .patch(`${url}/api/hospitals`, { filter, update })
      .then((res) => {
        setSuccess(true);
        setErrors(null);
        console.log("Hospital updated:", res.data);

        // Clear fields
        filterNameRef.current.value = "";
        filterLocationRef.current.value = "";
        setNameRef.current.value = "";
        setLocationRef.current.value = "";
        setOperatingRoomsRef.current.value = "";
        setAvgUtilizationRef.current.value = "";
      })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 422) {
          setErrors(res.data.errors);
        } else {
          setErrors({ general: ["Failed to update hospital."] });
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
        Update Hospital Record
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Hospital updated successfully!
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
          inputRef={filterLocationRef}
          label="Location (Filter)"
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
          inputRef={setLocationRef}
          label="Set Location"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={setOperatingRoomsRef}
          label="Set Operating Rooms"
          type="number"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={setAvgUtilizationRef}
          label="Set Avg Utilization"
          type="number"
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          UPDATE HOSPITAL
        </Button>
      </Box>
    </Paper>
  );
};

export default UpdateHospital;
