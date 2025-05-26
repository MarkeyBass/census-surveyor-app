"use client";

import { useState } from "react";
import { Household, HousingTypeEnum, EnvironmentalPracticeEnum, SurveyStatusEnum } from "@/types/household";
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

interface EditHouseholdModalProps {
  household: Household;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedHousehold: Household) => void;
}

export function EditHouseholdModal({ household, isOpen, onClose, onUpdate }: EditHouseholdModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
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
    environmentalPractices: household.environmentalPractices || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOUSEHOLDS}/${household._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      onUpdate(data.data);
      toast.success("Household updated successfully", {
        description: (
          <span style={{ color: '#dcfce7' }}>
            Your changes have been saved.
          </span>
        ),
        duration: 3000,
        style: {
          background: '#22c55e',
          color: 'white',
        },
      });
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update household. Please try again.";
      toast.error("Error updating household", {
        description: (
          <span style={{ color: '#fee2e2' }}>
            {errorMessage || "Failed to update household. Please try again."}
          </span>
        ),
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnvironmentalPracticeChange = (practice: EnvironmentalPracticeEnum) => {
    setFormData(prev => ({
      ...prev,
      environmentalPractices: prev.environmentalPractices.includes(practice)
        ? prev.environmentalPractices.filter(p => p !== practice)
        : [...prev.environmentalPractices, practice]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Household</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="familyName">Family Name</Label>
                <Input
                  id="familyName"
                  value={formData.familyName}
                  onChange={(e) =>
                    setFormData({ ...formData, familyName: e.target.value })
                  }
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                  maxLength={200}
                />
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      focalPoint: { ...formData.focalPoint, firstName: e.target.value },
                    })
                  }
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.focalPoint.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      focalPoint: { ...formData.focalPoint, email: e.target.value },
                    })
                  }
                  required
                  maxLength={100}
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
                  onChange={(e) =>
                    setFormData({ ...formData, numberOfCars: parseInt(e.target.value) || 0 })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="housingType">Housing Type</Label>
                <Select
                  value={formData.housingType.value}
                  onValueChange={(value: HousingTypeEnum) =>
                    setFormData({
                      ...formData,
                      housingType: { ...formData.housingType, value },
                    })
                  }
                >
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
              </div>
            </div>

            {formData.housingType.value === HousingTypeEnum.OTHER && (
              <div className="space-y-2">
                <Label htmlFor="customHousingType">Custom Housing Type</Label>
                <Input
                  id="customHousingType"
                  value={formData.housingType.customValue || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      housingType: { ...formData.housingType, customValue: e.target.value },
                    })
                  }
                  required
                />
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
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, hasPets: checked })
                  }
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
                      setFormData({ ...formData, numberOfPets: parseInt(e.target.value) || 0 })
                    }
                    required
                  />
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
                    id={practice}
                    checked={formData.environmentalPractices.includes(practice)}
                    onCheckedChange={() => handleEnvironmentalPracticeChange(practice)}
                  />
                  <Label htmlFor={practice}>{practice}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Survey Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Survey Status</h3>
            <div className="space-y-2">
              <Select
                value={formData.surveyStatus}
                onValueChange={(value: SurveyStatusEnum) =>
                  setFormData({ ...formData, surveyStatus: value })
                }
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
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 