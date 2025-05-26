"use client";

import { useState, useEffect } from "react";
import {
  Household,
  HousingTypeEnum,
  EnvironmentalPracticeEnum,
  SurveyStatusEnum,
} from "@/types/household";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { surveyCompletionSchema, householdUpdateSchema } from "@/lib/validations/household";
import { ZodError } from "zod";
import { CheckedState } from "@radix-ui/react-checkbox";

interface EditHouseholdModalProps {
  household: Household;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedHousehold: Household) => void;
}

interface FormData {
  familyName: string;
  address: string;
  surveyStatus: SurveyStatusEnum;
  focalPoint: {
    firstName: string;
    email: string;
  };
  numberOfCars: number;
  hasPets: boolean;
  numberOfPets: number;
  housingType: {
    value: HousingTypeEnum;
    customValue?: string;
  };
  environmentalPractices: EnvironmentalPracticeEnum[];
}

interface FieldErrors {
  [key: string]: string;
}

export function EditHouseholdModal({
  household,
  isOpen,
  onClose,
  onUpdate,
}: EditHouseholdModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<FormData>({
    familyName: household.familyName,
    address: household.address,
    surveyStatus: household.surveyStatus,
    focalPoint: {
      firstName: household.focalPoint.firstName || "",
      email: household.focalPoint.email,
    },
    numberOfCars: household.numberOfCars || 0,
    hasPets: household.hasPets || false,
    numberOfPets: household.numberOfPets || 0,
    housingType: household.housingType || { value: HousingTypeEnum.APARTMENT },
    environmentalPractices: Array.isArray(household?.environmentalPractices)
      ? household?.environmentalPractices
      : [],
  });

  const validateField = (field: string, value: any, isBlur: boolean = false) => {
    // Clear error when typing starts
    if (!isBlur) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return;
    }

    try {
      // Create a temporary object with the current form data
      const tempData = { ...formData } as any;
      // Update the field being validated
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        tempData[parent] = { ...tempData[parent], [child]: value };
      } else {
        tempData[field] = value;
      }

      // Try to validate the entire form
      surveyCompletionSchema.parse(tempData);
      // If validation passes, remove the error for this field
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Find the error for this specific field
        const fieldError = error.errors.find((err) => err.path.join(".") === field);
        if (fieldError) {
          setFieldErrors((prev) => ({
            ...prev,
            [field]: fieldError.message,
          }));
        }
      }
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return {
          ...prev,
          [parent]: { ...(prev[parent as keyof FormData] as object), [child]: value },
        };
      }
      return { ...prev, [field]: value };
    });
    validateField(field, value);
  };

  const handleFieldBlur = (field: string, value: any) => {
    setTouchedFields((prev) => new Set(prev).add(field));
    validateField(field, value, true);
  };

  const validateSurveyCompletion = () => {
    try {
      surveyCompletionSchema.parse(formData);
      setFieldErrors({});
      return { isValid: true, errors: [] };
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        // Convert Zod errors to field-level errors
        const newFieldErrors: FieldErrors = {};
        errors.forEach((err) => {
          newFieldErrors[err.path] = err.message;
        });
        setFieldErrors(newFieldErrors);

        return { isValid: false, errors };
      }
      return { isValid: false, errors: [{ path: "", message: "Validation failed" }] };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate the entire form
      const { isValid, errors } = validateSurveyCompletion();
      if (!isValid) {
        throw new Error(
          `Cannot complete survey. Please fix the following issues:\n${errors
            .map((err) => `${err.path}: ${err.message}`)
            .join("\n")}`
        );
      }

      const body = {
        ...formData,
        surveyStatus: SurveyStatusEnum.COMPLETED,
      };

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOUSEHOLDS}/${household._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      onUpdate(data.data);
      toast.success("Household updated successfully", {
        description: <span style={{ color: "#dcfce7" }}>Your changes have been saved.</span>,
        duration: 3000,
        style: {
          background: "#22c55e",
          color: "white",
        },
      });
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update household. Please try again.";
      toast.error("Error updating household", {
        description: <span style={{ color: "#fee2e2" }}>{errorMessage}</span>,
        duration: 5000,
        style: {
          background: "#ef4444",
          color: "white",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);

    try {
      // Basic validation using householdUpdateSchema
      try {
        householdUpdateSchema.parse(formData);
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }));
          throw new Error(
            `Please fix the following issues:\n${errors
              .map(err => `${err.path}: ${err.message}`)
              .join('\n')}`
          );
        }
        throw error;
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOUSEHOLDS}/${household._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      onUpdate(data.data);
      toast.success("Changes saved", {
        description: <span style={{ color: "#dcfce7" }}>Your changes have been saved temporarily.</span>,
        duration: 3000,
        style: {
          background: "#22c55e",
          color: "white",
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save changes. Please try again.";
      toast.error("Error saving changes", {
        description: <span style={{ color: "#fee2e2" }}>{errorMessage}</span>,
        duration: 5000,
        style: {
          background: "#ef4444",
          color: "white",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnvironmentalPracticeChange = (
    practice: EnvironmentalPracticeEnum,
    checkState: CheckedState
  ) => {
    console.log("checkState", checkState);
    setFormData((prev) => {
      if (checkState === true) {
        return {
          ...prev,
          environmentalPractices: [...prev?.environmentalPractices, practice],
        };
      }
      return {
        ...prev,
        environmentalPractices: prev.environmentalPractices?.filter((p) => p !== practice),
      };
    });
  };

  const handleHousingTypeChange = (value: HousingTypeEnum) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        housingType: { ...prev.housingType, value },
      };

      // If changing to OTHER, validate the custom value immediately
      if (value === HousingTypeEnum.OTHER) {
        setTouchedFields((prev) => new Set(prev).add("housingType.customValue"));
        // Use the new state value for validation
        validateField("housingType.customValue", newData.housingType.customValue, true);
      }

      return newData;
    });
  };

  // Show validation warning when trying to complete survey
  useEffect(() => {
    if (formData.surveyStatus === SurveyStatusEnum.COMPLETED) {
      const { isValid, errors } = validateSurveyCompletion();
      if (!isValid) {
        toast.warning("Cannot complete survey", {
          description: (
            <div style={{ color: "#fef3c7" }}>
              <p className="font-medium mb-2">Please fix the following issues:</p>
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>
                    <span className="font-medium">{error.path}:</span> {error.message}
                  </li>
                ))}
              </ul>
            </div>
          ),
          duration: 8000,
          style: {
            background: "#f59e0b",
            color: "white",
          },
        });
      }
    }
  }, [formData.surveyStatus]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Household</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="familyName">Family Name</Label>
                <Input
                  id="familyName"
                  value={formData.familyName}
                  onChange={(e) => handleFieldChange("familyName", e.target.value)}
                  onBlur={(e) => handleFieldBlur("familyName", e.target.value)}
                  maxLength={100}
                />
                {touchedFields.has("familyName") && fieldErrors["familyName"] && (
                  <p className="text-sm text-red-500">{fieldErrors["familyName"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                  onBlur={(e) => handleFieldBlur("address", e.target.value)}
                  maxLength={200}
                />
                {touchedFields.has("address") && fieldErrors["address"] && (
                  <p className="text-sm text-red-500">{fieldErrors["address"]}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Focal Point Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Focal Point Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.focalPoint.firstName}
                  onChange={(e) => handleFieldChange("focalPoint.firstName", e.target.value)}
                  onBlur={(e) => handleFieldBlur("focalPoint.firstName", e.target.value)}
                  maxLength={100}
                />
                {touchedFields.has("focalPoint.firstName") &&
                  fieldErrors["focalPoint.firstName"] && (
                    <p className="text-sm text-red-500">{fieldErrors["focalPoint.firstName"]}</p>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.focalPoint.email}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Housing Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Housing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfCars">Number of Cars</Label>
                <Input
                  id="numberOfCars"
                  type="number"
                  min="0"
                  value={formData.numberOfCars}
                  onChange={(e) => handleFieldChange("numberOfCars", parseInt(e.target.value) || 0)}
                  onBlur={(e) => handleFieldBlur("numberOfCars", parseInt(e.target.value) || 0)}
                  required
                />
                {touchedFields.has("numberOfCars") && fieldErrors["numberOfCars"] && (
                  <p className="text-sm text-red-500">{fieldErrors["numberOfCars"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="housingType">Housing Type</Label>
                <Select value={formData.housingType.value} onValueChange={handleHousingTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select housing type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(HousingTypeEnum).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touchedFields.has("housingType.value") && fieldErrors["housingType.value"] && (
                  <p className="text-sm text-red-500">{fieldErrors["housingType.value"]}</p>
                )}
              </div>
            </div>

            {formData.housingType.value === HousingTypeEnum.OTHER && (
              <div className="space-y-2">
                <Label htmlFor="customHousingType">Custom Housing Type</Label>
                <Input
                  id="customHousingType"
                  value={formData.housingType.customValue || ""}
                  onChange={(e) => handleFieldChange("housingType.customValue", e.target.value)}
                  onBlur={(e) => handleFieldBlur("housingType.customValue", e.target.value)}
                  required
                />
                {fieldErrors["housingType.customValue"] && (
                  <p className="text-sm text-red-500">{fieldErrors["housingType.customValue"]}</p>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Pets Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pets Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="hasPets"
                  checked={formData.hasPets}
                  onCheckedChange={(checked: boolean) => {
                    handleFieldChange("hasPets", checked);
                  }}
                />
                <Label htmlFor="hasPets">Has Pets</Label>
              </div>

              {formData.hasPets && (
                <div className="space-y-2">
                  <Label htmlFor="numberOfPets">Number of Pets</Label>
                  <Input
                    id="numberOfPets"
                    type="number"
                    min="1"
                    value={formData.numberOfPets}
                    onChange={(e) =>
                      handleFieldChange("numberOfPets", parseInt(e.target.value) || 0)
                    }
                    onBlur={(e) => handleFieldBlur("numberOfPets", parseInt(e.target.value) || 0)}
                    required
                  />
                  {touchedFields.has("numberOfPets") && fieldErrors["numberOfPets"] && (
                    <p className="text-sm text-red-500">{fieldErrors["numberOfPets"]}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Environmental Practices Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Environmental Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.values(EnvironmentalPracticeEnum).map((practice) => (
                <div key={practice} className="flex items-center space-x-2">
                  <Checkbox
                    value={practice}
                    id={practice}
                    checked={formData.environmentalPractices.includes(practice)}
                    onCheckedChange={(checkState) => {
                      handleEnvironmentalPracticeChange(practice, checkState);
                    }}
                  />
                  <Label htmlFor={practice}>{practice}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Survey Status Section
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Survey Status</h3>
            <div className="space-y-2">
              <Select
                value={formData.surveyStatus}
                onValueChange={(value: SurveyStatusEnum) => {
                  handleFieldChange("surveyStatus", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select survey status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SurveyStatusEnum).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div> */}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSaveChanges}
              disabled={isLoading}
            >
              Save Changes
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Complete Survey"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
