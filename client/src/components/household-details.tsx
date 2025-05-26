"use client";

import { useState } from "react";
import { Household } from "@/types/household";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { EditHouseholdModal } from "./edit-household-modal";
import { format } from "date-fns";
import { Badge, getBadgeVariant } from "./ui/badge";
import { Separator } from "./ui/separator";
import { HousingTypeEnum } from "@/types/household";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User, Users, Pencil } from "lucide-react";
import { API_CONFIG } from "@/config/constants";
import { toast } from "sonner";

interface HouseholdDetailsProps {
  household: Household;
}

export function HouseholdDetails({ household: initialHousehold }: HouseholdDetailsProps) {
  const [household, setHousehold] = useState(initialHousehold);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const refetchHousehold = async () => {
    setIsRefetching(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOUSEHOLDS}/${household._id}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch updated household data");
      }

      const data = await response.json();
      setHousehold(data.data);
    } catch (error) {
      toast.error("Failed to refresh data", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsRefetching(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-5 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8 pb-4 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="hidden sm:inline">Household Details</span>
          </h1>
          <Button 
            className="cursor-pointer gap-2" 
            onClick={() => setIsEditModalOpen(true)}
            disabled={isRefetching}
          >
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Edit Household</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <div>
              <CardTitle className="text-xl">{household.familyName}</CardTitle>
              <p className="text-muted-foreground">{household.address}</p>
            </div>
            <Badge variant={getBadgeVariant(household.surveyStatus)}>
              {household.surveyStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-base font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Family Name</p>
                <p className="text-base font-medium">{household.familyName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-base font-medium">{household.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Housing Type</p>
                <p className="text-base font-medium">
                  {household.housingType?.value === HousingTypeEnum.OTHER
                    ? household.housingType.customValue
                    : household.housingType?.value || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Number of Cars</p>
                <p className="text-base font-medium">{household.numberOfCars || 0}</p>
              </div>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Focal Point Section */}
          <div>
            <h3 className="text-base font-semibold mb-3">Focal Point Information</h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={household.focalPoint.pictureUrl}
                    alt={household.focalPoint.firstName || "Focal Point"}
                  />
                  <AvatarFallback className="bg-primary/10">
                    {household.focalPoint.firstName ? (
                      getInitials(household.focalPoint.firstName)
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground">Profile Picture</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                <div>
                  <p className="text-sm text-muted-foreground">First Name</p>
                  <p className="text-base font-medium">{household.focalPoint.firstName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-base font-medium">{household.focalPoint.email}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Family Members Section */}
          <div>
            <h3 className="text-base font-semibold mb-3">Family Members</h3>
            <div className="space-y-4">
              {household.familyMembers && household.familyMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {household.familyMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg border bg-card"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10">
                          {getInitials(`${member.firstName} ${member.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-base font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Born: {format(new Date(member.birthDate), "PPP")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-6 text-muted-foreground">
                  <Users className="h-5 w-5 mr-2" />
                  <p>No family members recorded</p>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-3" />

          {/* Pets Section */}
          <div>
            <h3 className="text-base font-semibold mb-3">Pets</h3>
            <div className="flex items-center space-x-3 p-4 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5Z" />
                  <path d="M8 15v1a4 4 0 0 0 8 0v-1" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium">
                  {household.hasPets
                    ? `${household.numberOfPets} Pet${household.numberOfPets === 1 ? "" : "s"}`
                    : "No Pets"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {household.hasPets
                    ? "Living in the household"
                    : "Currently no pets in the household"}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Environmental Practices Section */}
          <div>
            <h3 className="text-base font-semibold mb-3">Environmental Practices</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {household.environmentalPractices && household.environmentalPractices.length > 0 ? (
                household.environmentalPractices.map((practice) => (
                  <div key={practice} className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <p className="text-base font-medium">{practice}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No environmental practices recorded</p>
              )}
            </div>
          </div>

          <Separator className="my-3" />

          {/* Additional Information Section */}
          <div>
            <h3 className="text-base font-semibold mb-3">Additional Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-base font-medium">{household.familyMembers.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-base font-medium">
                  {format(new Date(household.createdAt), "PPP")}
                </p>
              </div>
              {household.dateSurveyed && (
                <div>
                  <p className="text-sm text-muted-foreground">Surveyed</p>
                  <p className="text-base font-medium text-green-600 dark:text-green-500">
                    {format(new Date(household.dateSurveyed), "PPP")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <EditHouseholdModal
        household={household}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={async (updatedHousehold) => {
          setHousehold(updatedHousehold);
          await refetchHousehold(); // Refetch after update
        }}
      />
    </div>
  );
}
