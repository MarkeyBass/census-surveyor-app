"use client";

// TODO: check!!!
import { Household, SurveyStatusEnum } from "@/types/household";
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

interface HouseholdCardProps {
  household: Household;
  onClick?: () => void;
}

export function HouseholdCard({ household, onClick }: HouseholdCardProps) {


  return (
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
  );
}
