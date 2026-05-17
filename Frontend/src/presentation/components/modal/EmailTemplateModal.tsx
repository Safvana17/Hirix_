import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Close, Delete } from "@mui/icons-material";
import type { TemplatePayload, EmailTemplate, TemplateField, TemplateFieldType, TemplateFieldPurpose } from "../../../types/template";

interface TemplateModalProps {
  open: boolean;
  mode: "create" | "edit" | "view";
  template: EmailTemplate | null;
  onClose: () => void;
  onSubmit: (payload: TemplatePayload) => void;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const createFieldName = (label: string) => label.trim().toLowerCase().replace(/\s+/g, "_");
const TEMPLATE_FIELD_TYPES: TemplateFieldType[] = [ "text", "textarea", "number", "dropdown", "checkbox", "button" ]
const TEMPLATE_FIELD_PURPOSES: TemplateFieldPurpose[] = [ "SUBJECT", "TITLE", "BODY", "FOOTER", "CTA_BUTTON", "OTP_LABEL", "OTP_CODE", "EXPIRY_TEXT", "SUPPORT_TEXT", "CUSTOM" ]


const TemplateModal: React.FC<TemplateModalProps> = ({
  open,
  mode,
  template,
  onClose,
  onSubmit,
}) => {
  const isViewMode = mode === "view";

  const [form, setForm] = useState<TemplatePayload>({
    id: template?.id || "",
    key: template?.key || "",
    name: template?.name || "",
    channel: template?.channel || "EMAIL",
    fields: template?.fields || [],
    values: template?.values || {},
    isActive: template?.isActive ?? true,
  });
  const [fieldType, setFieldType] = useState<TemplateFieldType>("text");
  const [fieldPurpose, setFieldPurpose] = useState<TemplateFieldPurpose | null>(null);
  const [fieldLabel, setFieldLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [required, setRequired] = useState(false);
  const [optionText, setOptionText] = useState("");

  const handleValueChange = (fieldName: string, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [fieldName]: value,
      },
    }));
  };

  const handleAddField = () => {
    if (!fieldLabel.trim()) return
    const name = createFieldName(fieldLabel)
    const alreadyExists = form.fields.some((field) => field.name === name)
    if (alreadyExists) return
    const newField: TemplateField = {
      id: '',
      name,
      label: fieldLabel.trim(),
      type: fieldType,
      purpose: fieldPurpose || undefined,
      required,
      placeholder,
      order: form.fields.length + 1,
      options:
        fieldType === "dropdown"
          ? optionText
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
              .map((item) => ({
                label: item,
                value: item,
              }))
          : undefined,
    }

    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
      values: {
        ...prev.values,
        [name]: fieldType === "button" ? { text: "", url: "" } : "",
      },
    }))
    setFieldType("text")
    setFieldPurpose(null)
    setFieldLabel("")
    setPlaceholder("")
    setRequired(false)
    setOptionText("")
  };

  const handleRemoveField = (field: TemplateField) => {
    setForm((prev) => {
      const updatedValues = { ...prev.values }
      delete updatedValues[field.name]

      return {
        ...prev,
        fields: prev.fields.filter((item) => item.id !== field.id),
        values: updatedValues,
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: mode === "edit" ? template?.id : "",
      key: form.key,
      name: form.name,
      channel: form.channel,
      fields: form.fields,
      values: form.values,
      isActive: form.isActive,
    });
  };

  const renderDynamicField = (field: TemplateField) => {
    const value = form.values[field.name];
    if (field.type === "text") {
      return (
        <TextField
          label={field.label}
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => handleValueChange(field.name, e.target.value)}
          fullWidth
          required={field.required}
          InputProps={{ readOnly: isViewMode }}
        />
      )
    }
    if (field.type === "textarea") {
      return (
        <TextField
          label={field.label}
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => handleValueChange(field.name, e.target.value)}
          fullWidth
          multiline
          minRows={4}
          required={field.required}
          InputProps={{ readOnly: isViewMode }}
        />
      )
    }
    if (field.type === "number") {
      return (
        <TextField
          label={field.label}
          placeholder={field.placeholder}
          type="number"
          value={value || ""}
          onChange={(e) => handleValueChange(field.name, e.target.value)}
          fullWidth
          required={field.required}
          InputProps={{ readOnly: isViewMode }}
        />
      )
    }
    if (field.type === "dropdown") {
      return (
        <TextField
          select
          label={field.label}
          value={value || ""}
          onChange={(e) => handleValueChange(field.name, e.target.value)}
          fullWidth
          required={field.required}
          disabled={isViewMode}
        >
          {field.options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )
    }
    if (field.type === "checkbox") {
      return (
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(value)}
              disabled={isViewMode}
              onChange={(e) => handleValueChange(field.name, e.target.checked)}
            />
          }
          label={field.label}
        />
      )
    }
    if (field.type === "button") {
      const buttonValue =
        typeof value === "object" && value !== null
          ? (value as { text?: string; url?: string })
          : { text: "", url: "" };
      return (
        <Stack spacing={1.5}>
          <TextField
            label={`${field.label} Text`}
            value={buttonValue.text || ""}
            onChange={(e) =>
              handleValueChange(field.name, {
                ...buttonValue,
                text: e.target.value,
              })
            }
            fullWidth
            InputProps={{ readOnly: isViewMode }}
          />
          <TextField
            label={`${field.label} URL`}
            value={buttonValue.url || ""}
            onChange={(e) =>
              handleValueChange(field.name, {
                ...buttonValue,
                url: e.target.value,
              })
            }
            fullWidth
            helperText="Example: {{testLink}}"
            InputProps={{ readOnly: isViewMode }}
          />
          <Button variant="contained" sx={{ width: "fit-content" }}>
            {buttonValue.text || field.label}
          </Button>
        </Stack>
      )
    }
    return null
  }
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={700}>
            {mode === "create"
              ? "Create Template"
              : mode === "edit"
              ? "Edit Template"
              : "View Template"}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Template Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
              InputProps={{ readOnly: isViewMode }}
            />
            <TextField
              label="Template Key"
              value={form.key}
              onChange={(e) =>setForm((prev) => ({ ...prev, key: e.target.value }))}
              fullWidth
              required
              helperText="Example: TEST_INVITATION"
              InputProps={{ readOnly: isViewMode }}
            />
            <FormControl fullWidth>
              <InputLabel>Channel</InputLabel>
              <Select
                value={form.channel}
                label="Channel"
                disabled={isViewMode}
                onChange={(e) => setForm((prev) => ({ ...prev, channel: e.target.value }))}
              >
                <MenuItem value="EMAIL">EMAIL</MenuItem>
                <MenuItem value="IN_APP">IN_APP</MenuItem>
              </Select>
            </FormControl>
            <Divider />
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "360px 1fr" }}
              gap={3}
            >
              {mode !== "view" && (
                <Box
                  sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 3,
                    p: 2,
                    bgcolor: "#fafafa",
                  }}
                >
                  <Typography fontWeight={700} mb={2}>
                    Add Field
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      select
                      label="Field Type"
                      value={fieldType}
                      onChange={(e) => setFieldType(e.target.value as TemplateFieldType)}
                      fullWidth
                    >
                    {TEMPLATE_FIELD_TYPES.map((type) =>(
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                    </TextField>

                    <TextField
                      select
                      label="Field Purpose"
                      value={fieldPurpose}
                      onChange={(e) => setFieldPurpose(e.target.value as TemplateFieldPurpose)}
                      fullWidth
                      helperText="This tells backend how to use this field"
                    >
                    {TEMPLATE_FIELD_PURPOSES.map((purpose) =>(
                      <MenuItem key={purpose} value={purpose}>
                        {purpose}
                      </MenuItem>
                    ))}
                    </TextField>
                    <TextField
                      label="Field Label"
                      value={fieldLabel}
                      onChange={(e) => setFieldLabel(e.target.value)}
                      fullWidth
                      helperText="Example: Subject, Body, Proceed Test"
                    />
                    {fieldType !== "checkbox" && fieldType !== "button" && (
                      <TextField
                        label="Placeholder"
                        value={placeholder}
                        onChange={(e) => setPlaceholder(e.target.value)}
                        fullWidth
                      />
                    )}
                    {fieldType === "dropdown" && (
                      <TextField
                        label="Dropdown Options"
                        value={optionText}
                        onChange={(e) => setOptionText(e.target.value)}
                        fullWidth
                        helperText="Example: EMAIL, IN_APP"
                      />
                    )}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={required}
                          onChange={(e) => setRequired(e.target.checked)}
                        />
                      }
                      label="Required"
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddField}
                      sx={{ backgroundColor: "#4F3503" }}
                    >
                      Add Field
                    </Button>
                  </Stack>
                </Box>
              )}
              <Box
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <Typography fontWeight={700} mb={2}>
                  Template Preview
                </Typography>
                {form.fields.length === 0 ? (
                  <Box
                    sx={{
                      border: "1px dashed #cbd5e1",
                      borderRadius: 3,
                      p: 4,
                      textAlign: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      No fields added yet.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {form.fields
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((field) => (
                        <Box
                          key={field.id}
                          sx={{
                            border: "1px solid #e5e7eb",
                            borderRadius: 2,
                            p: 2,
                          }}
                        >
                          <Box display="flex" justifyContent="space-between" mb={1.5}>
                            <Box>
                              <Typography fontWeight={600}>
                                {field.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {field.type}{" "}
                                {field.purpose ? `· ${field.purpose}` : ""}
                              </Typography>
                            </Box>
                            {mode !== "view" && (
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveField(field)}
                              >
                                <Delete />
                              </IconButton>
                            )}
                          </Box>
                          {renderDynamicField(field)}
                        </Box>
                      ))}
                  </Stack>
                )}
              </Box>
            </Box>
            {mode === "view" && (
              <Box display="flex">
                <Chip
                  label={form.isActive ? "Active" : "Inactive"}
                  color={form.isActive ? "success" : "default"}
                />
              </Box>
            )}
            {mode !== "view" && (
              <Box display="flex" justifyContent="flex-end" gap={1.5}>
                <Button
                  variant="contained"
                  onClick={onClose}
                  sx={{ backgroundColor: "#0a2e50" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ backgroundColor: "#4F3503" }}
                >
                  {mode === "create" ? "Create" : "Update"}
                </Button>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </Modal>
  )
}

export default TemplateModal