"use client";

import { useState } from "react";
import { Household } from "@/types/household";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Badge, getBadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { AdminEmailUpdateModal } from "./admin-email-update-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HouseholdCardProps {
  household: Household;
  onClick?: () => void;
}

export function HouseholdCard({ household, onClick }: HouseholdCardProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleEmailUpdate = () => {
    // You might want to add a callback prop to handle the update in the parent component
    window.location.reload(); // Temporary solution - refresh the page to show updated data
  };

  return (
    <>
      <Card className="w-full cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{household.familyName}</CardTitle>
              <CardDescription>{household.address}</CardDescription>
            </div>
            <Badge variant={getBadgeVariant(household.surveyStatus)}>{household.surveyStatus}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium border-b dark:border-gray-200 border-gray-800 pb-1">Focal Point :</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>First Name:</span>
              <span className="font-medium">{household.focalPoint.firstName || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Email:</span>
              <span className="font-medium">{household.focalPoint.email}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 gap-1 text-xs cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEmailModalOpen(true);
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                      <span>Edit</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Update email addres - Admin only</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Family Members:</span>
              <span className="font-medium">{household.familyMembers.length}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <div className="flex flex-col items-start justify-between gap-2">
            <span>Created: {format(new Date(household.createdAt), "PPP")}</span>
            {household.dateSurveyed && (
              <span className="font-extrabold text-green-600 dark:text-green-500">Surveyed: {format(new Date(household.dateSurveyed), "PPP")}</span>
            )}
          </div>
        </CardFooter>
      </Card>

      <AdminEmailUpdateModal
        household={household}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onUpdate={handleEmailUpdate}
      />
    </>
  );
}
