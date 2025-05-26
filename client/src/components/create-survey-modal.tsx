"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/constants";

interface CreateSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSurveyModal({ isOpen, onClose }: CreateSurveyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    familyName: "",
    address: "",
    focalPoint: {
      email: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOUSEHOLDS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      toast.success("Survey created successfully", {
        description: (
          <span style={{ color: '#dcfce7' }}>
            Your survey has been created successfully.
          </span>
        ),
        style: {
          background: '#22c55e',
          color: 'white',
        },
      });
      onClose();
      // Reset form
      setFormData({
        familyName: "",
        address: "",
        focalPoint: {
          email: "",
        },
      });
    } catch (error) {
      // console.error('Error creating survey:', error);
      toast.error("Error creating survey", {
        description: (
          <span style={{ color: '#fee2e2' }}>
            {error instanceof Error ? error.message : "Failed to create survey. Please try again."}
          </span>
        ),
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Survey</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="space-y-2">
            <Label htmlFor="email">Focal Point Email</Label>
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
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Survey"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 