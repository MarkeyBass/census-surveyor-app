"use client";

import { useState } from "react";
import { Household } from "@/types/household";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/constants";

interface AdminEmailUpdateModalProps {
  household: Household;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedHousehold: Household) => void;
}

export function AdminEmailUpdateModal({
  household,
  isOpen,
  onClose,
  onUpdate,
}: AdminEmailUpdateModalProps) {
  const [email, setEmail] = useState(household.focalPoint.email);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOUSEHOLDS}/${household._id}/admin-update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            focalPoint: {
              ...household.focalPoint,
              email,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update email");
      }

      const data = await response.json();
      onUpdate(data.data);
      toast.success("Email updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update email");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter new email"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="hover:cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="hover:cursor-pointer">
              {isLoading ? "Updating..." : "Update Email"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
