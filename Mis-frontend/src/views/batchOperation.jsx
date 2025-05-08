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

const BatchUpdateOperations = () => {
  const url = import.meta.env.VITE_API_URL;

  // Refs for each collection's filter and update fields
  const filterPatientsAgeRef = useRef();
  const updatePatientsCategoryRef = useRef();

  const filterDoctorsExperienceRef = useRef();
  const updateDoctorsExperienceRef = useRef();

  const filterSurgeriesDurationRef = useRef();
  const updateSurgeriesDurationRef = useRef();

  const filterHospitalsLocationRef = useRef();
  const updateHospitalsLocationRef = useRef();

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);

  const validate = () => {
    const errs = {};
    const hasPatientsFilter =
      filterPatientsAgeRef.current.value ||
      updatePatientsCategoryRef.current.value;

    const hasDoctorsFilter =
      filterDoctorsExperienceRef.current.value ||
      updateDoctorsExperienceRef.current.value;

    const hasSurgeriesFilter =
      filterSurgeriesDurationRef.current.value ||
      updateSurgeriesDurationRef.current.value;

    const hasHospitalsFilter =
      filterHospitalsLocationRef.current.value ||
      updateHospitalsLocationRef.current.value;

    if (
      !hasPatientsFilter &&
      !hasDoctorsFilter &&
      !hasSurgeriesFilter &&
      !hasHospitalsFilter
    ) {
      errs.filter = ["At least one filter for each entity is required"];
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const operations = [];

    // Patients operation
    if (
      filterPatientsAgeRef.current.value ||
      updatePatientsCategoryRef.current.value
    ) {
      const patientOperation = {
        collection: "patients",
        filter: {},
        update: {},
      };

      if (filterPatientsAgeRef.current.value) {
        patientOperation.filter.age = {
          $gt: parseInt(filterPatientsAgeRef.current.value),
        };
      }

      if (updatePatientsCategoryRef.current.value) {
        patientOperation.update["$set"] = {
          category: updatePatientsCategoryRef.current.value,
        };
      }

      operations.push(patientOperation);
    }

    // Doctors operation
    if (
      filterDoctorsExperienceRef.current.value ||
      updateDoctorsExperienceRef.current.value
    ) {
      const doctorOperation = {
        collection: "doctors",
        filter: {},
        update: {},
      };

      if (filterDoctorsExperienceRef.current.value) {
        doctorOperation.filter.experienceYears = {
          $lt: parseInt(filterDoctorsExperienceRef.current.value),
        };
      }

      if (updateDoctorsExperienceRef.current.value) {
        doctorOperation.update["$inc"] = {
          experienceYears: parseInt(updateDoctorsExperienceRef.current.value),
        };
      }

      operations.push(doctorOperation);
    }

    // Surgeries operation
    if (
      filterSurgeriesDurationRef.current.value ||
      updateSurgeriesDurationRef.current.value
    ) {
      const surgeryOperation = {
        collection: "surgeries",
        filter: {},
        update: {},
      };

      if (filterSurgeriesDurationRef.current.value) {
        surgeryOperation.filter.duration = {
          $gt: parseInt(filterSurgeriesDurationRef.current.value),
        };
      }

      if (updateSurgeriesDurationRef.current.value) {
        surgeryOperation.update["$set"] = {
          duration: parseInt(updateSurgeriesDurationRef.current.value),
        };
      }

      operations.push(surgeryOperation);
    }

    // Hospitals operation
    if (
      filterHospitalsLocationRef.current.value ||
      updateHospitalsLocationRef.current.value
    ) {
      const hospitalOperation = {
        collection: "hospitals",
        filter: {},
        update: {},
      };

      if (filterHospitalsLocationRef.current.value) {
        hospitalOperation.filter.location =
          filterHospitalsLocationRef.current.value;
      }

      if (updateHospitalsLocationRef.current.value) {
        hospitalOperation.update["$set"] = {
          location: updateHospitalsLocationRef.current.value,
        };
      }

      operations.push(hospitalOperation);
    }

    // Sending the batch update request
    axios
      .post(`${url}/api/operations/updates`, { operations })
      .then((res) => {
        setSuccess(true);
        setErrors(null);
        console.log("Batch update successful:", res.data);

        // Clear fields after successful submission
        filterPatientsAgeRef.current.value = "";
        updatePatientsCategoryRef.current.value = "";
        filterDoctorsExperienceRef.current.value = "";
        updateDoctorsExperienceRef.current.value = "";
        filterSurgeriesDurationRef.current.value = "";
        updateSurgeriesDurationRef.current.value = "";
        filterHospitalsLocationRef.current.value = "";
        updateHospitalsLocationRef.current.value = "";
      })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 422) {
          setErrors(res.data.errors);
        } else {
          setErrors({ general: ["Failed to update records."] });
        }
        setSuccess(false);
      });
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 4, maxWidth: 800, margin: "auto", mt: 4 }}
    >
      <Typography variant="h5" gutterBottom>
        Batch Update Operations
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Batch update successful!
        </Alert>
      )}

      {errors?.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general.join(", ")}
        </Alert>
      )}

      <Box component="form" onSubmit={submit} noValidate>
        {/* Filter and update inputs for Patients */}
        <Typography variant="h6" sx={{ mt: 1 }}>
          Patients Operation
        </Typography>
        <TextField
          fullWidth
          inputRef={filterPatientsAgeRef}
          label="Age Filter (GT)"
          type="number"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          inputRef={updatePatientsCategoryRef}
          label="Set Category"
          sx={{ mb: 2 }}
        />

        {/* Filter and update inputs for Doctors */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Doctors Operation
        </Typography>
        <TextField
          fullWidth
          inputRef={filterDoctorsExperienceRef}
          label="Experience (LT)"
          type="number"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          inputRef={updateDoctorsExperienceRef}
          label="Increment Experience"
          type="number"
          sx={{ mb: 2 }}
        />

        {/* Filter and update inputs for Surgeries */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Surgeries Operation
        </Typography>
        <TextField
          fullWidth
          inputRef={filterSurgeriesDurationRef}
          label="Duration Filter (GT)"
          type="number"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          inputRef={updateSurgeriesDurationRef}
          label="Set Duration"
          type="number"
          sx={{ mb: 2 }}
        />

        {/* Filter and update inputs for Hospitals */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Hospitals Operation
        </Typography>
        <TextField
          fullWidth
          inputRef={filterHospitalsLocationRef}
          label="Location Filter"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          inputRef={updateHospitalsLocationRef}
          label="Set Location"
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          EXECUTE BATCH UPDATE
        </Button>
      </Box>
    </Paper>
  );
};

export default BatchUpdateOperations;
