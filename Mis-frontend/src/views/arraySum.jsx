import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import axios from "axios";

const ArraySumCalculator = () => {
  const url = import.meta.env.VITE_API_URL;

  const collectionRef = useRef();
  const arrayFieldRef = useRef();
  const targetFieldRef = useRef();

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);
  const [results, setResults] = useState([]);

  const validate = () => {
    const errs = {};
    if (!collectionRef.current?.value)
      errs.collection = "Collection is required.";
    if (!arrayFieldRef.current?.value)
      errs.arrayField = "Array field is required.";
    if (!targetFieldRef.current?.value)
      errs.targetField = "Target field is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      collection: collectionRef.current.value,
      arrayField: arrayFieldRef.current.value,
      targetField: targetFieldRef.current.value,
    };

    axios
      .post(`${url}/api/calculate/array-sum`, payload)
      .then((res) => {
        setSuccess(true);
        setErrors(null);
        setResults(res.data);
      })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 422) {
          setErrors(res.data.errors);
        } else {
          setErrors({ general: ["Failed to calculate array sum."] });
        }
        setSuccess(false);
        setResults([]);
      });
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Array Sum Calculator
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Calculation successful!
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
          inputRef={collectionRef}
          label="Collection (e.g., doctors)"
          error={Boolean(errors?.collection)}
          helperText={errors?.collection}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={arrayFieldRef}
          label="Array Field (e.g., successRates)"
          error={Boolean(errors?.arrayField)}
          helperText={errors?.arrayField}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          inputRef={targetFieldRef}
          label="Target Field to Store Result (e.g., totalSuccessRate)"
          error={Boolean(errors?.targetField)}
          helperText={errors?.targetField}
          sx={{ mb: 2 }}
        />

        <Button fullWidth type="submit" variant="contained" size="large">
          CALCULATE ARRAY SUM
        </Button>
      </Box>

      {/* Display Results */}
      {results?.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Updated Documents:
          </Typography>
          {results.map((item, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {JSON.stringify(item, null, 2)}
              </pre>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default ArraySumCalculator;
