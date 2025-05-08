import React, { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";

const AggregateOperations = () => {
  const url = import.meta.env.VITE_API_URL;

  // Refs for aggregation inputs
  const collectionRef = useRef();

  const [pipeline, setPipeline] = useState([
    { stage: "$match", field: "", value: "", operator: "" },
  ]);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);
  const [data, setData] = useState(null); // State to hold the response data

  // Add more stages to the pipeline (match, group, etc.)
  const addStage = (type) => {
    setPipeline((prevPipeline) => [
      ...prevPipeline,
      { stage: type, field: "", value: "", operator: "" },
    ]);
  };

  const handleStageChange = (index, field, value) => {
    const newPipeline = [...pipeline];
    newPipeline[index] = { ...newPipeline[index], [field]: value };
    setPipeline(newPipeline);
  };

  // Function to remove a stage from the pipeline
  const removeStage = (index) => {
    const newPipeline = pipeline.filter((_, idx) => idx !== index);
    setPipeline(newPipeline);
  };

  const validate = () => {
    const errs = {};

    // Basic validation: check if a collection is selected and if the pipeline has valid values
    if (!collectionRef.current.value) {
      errs.collection = "Collection is required";
    }

    if (
      pipeline.length === 0 ||
      !pipeline.some((stage) => stage.field || stage.value)
    ) {
      errs.pipeline = "At least one valid pipeline stage is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const operations = pipeline.map((stage) => {
      const value = stage.value;
      let parsedValue;

      // Determine the type of the value
      if (!isNaN(value)) {
        parsedValue = parseFloat(value); // Convert to number if it's a valid number
      } else if (value === "true" || value === "false") {
        parsedValue = value === "true"; // Convert to boolean if it's "true" or "false"
      } else {
        parsedValue = value; // Otherwise, treat it as a string
      }

      let operator = {};
      if (stage.operator === "$gt") {
        operator = { $gt: parsedValue };
      } else if (stage.operator === "$lt") {
        operator = { $lt: parsedValue };
      } else {
        operator = parsedValue; // No operator, just use the value
      }

      if (stage.stage === "$match" && stage.field && operator) {
        return { $match: { [stage.field]: operator } };
      } else if (stage.stage === "$group" && stage.field && parsedValue) {
        return {
          $group: {
            _id: `$${stage.field}`,
            count: { $sum: 1 },
          },
        };
      }
      return {};
    });

    const aggregateRequest = {
      collection: collectionRef.current.value,
      pipeline: operations,
    };
    console.log("Aggregate Request:", aggregateRequest);
    axios
      .post(`${url}/api/operations/aggregate`, aggregateRequest)
      .then((res) => {
        setSuccess(true);
        setErrors(null);
        setData(res.data); // Store the response data
        console.log("Aggregate operation successful:", res.data);
      })
      .catch((err) => {
        const res = err.response;
        if (res?.status === 422) {
          setErrors(res.data.errors);
        } else {
          setErrors({ general: ["Failed to perform aggregate operation."] });
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
        Aggregate Operations
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Aggregate operation successful!
        </Alert>
      )}

      {errors?.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general.join(", ")}
        </Alert>
      )}

      <Box component="form" onSubmit={submit} noValidate>
        {/* Collection Input */}
        <Typography variant="h6" sx={{ mt: 1 }}>
          Collection
        </Typography>
        <TextField
          fullWidth
          inputRef={collectionRef}
          label="Collection (e.g., surgeries)"
          sx={{ mb: 2 }}
        />

        {/* Pipeline Stages */}
        <Typography variant="h6" sx={{ my: 2 }}>
          Pipeline Stages
        </Typography>
        {pipeline.map((stage, index) => (
          <Box
            key={index}
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <FormControl fullWidth sx={{ mr: 2 }}>
              <InputLabel>Stage Type</InputLabel>
              <Select
                value={stage.stage}
                onChange={(e) =>
                  handleStageChange(index, "stage", e.target.value)
                }
                label="Stage Type"
              >
                <MenuItem value="$match">Match</MenuItem>
                <MenuItem value="$group">Group</MenuItem>
                <MenuItem value="$project">Project</MenuItem>
                <MenuItem value="$sort">Sort</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              value={stage.field}
              onChange={(e) =>
                handleStageChange(index, "field", e.target.value)
              }
              label="Field (e.g., duration)"
              sx={{ mr: 2 }}
            />

            <TextField
              fullWidth
              value={stage.value}
              onChange={(e) =>
                handleStageChange(index, "value", e.target.value)
              }
              label="Value (e.g., 60)"
              sx={{ mr: 2 }}
            />

            <FormControl fullWidth sx={{ mr: 2 }}>
              <InputLabel>Operator</InputLabel>
              <Select
                value={stage.operator}
                onChange={(e) =>
                  handleStageChange(index, "operator", e.target.value)
                }
                label="Operator"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="$gt">Greater Than ($gt)</MenuItem>
                <MenuItem value="$lt">Less Than ($lt)</MenuItem>
              </Select>
            </FormControl>

            <IconButton onClick={() => removeStage(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        {/* Buttons to add more stages */}
        <Button
          type="button"
          variant="outlined"
          onClick={() => addStage("$match")}
          sx={{ mr: 2 }}
        >
          Add Match Stage
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => addStage("$group")}
          sx={{ mr: 2 }}
        >
          Add Group Stage
        </Button>

        {/* Submit button */}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          EXECUTE AGGREGATE OPERATION
        </Button>
      </Box>

      {/* Display Data After Operation */}
      {data && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Aggregate Operation Results
          </Typography>

          {/* If data is an array, display in a table */}
          {Array.isArray(data) ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(data[0]).map((key) => (
                      <TableCell key={key}>{key}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      {Object.values(item).map((value, idx) => (
                        <TableCell key={idx}>
                          {/* If value is an object, convert it to string */}
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            // If data is an object, display as key-value pairs
            <Box>
              {Object.entries(data).map(([key, value]) => (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>{key}:</strong>
                    {/* If value is an object, convert it to a string */}
                    {typeof value === "object" ? JSON.stringify(value) : value}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default AggregateOperations;
