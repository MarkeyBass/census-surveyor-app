"use client";

// TODO: check!!!
import { Household } from "@/types/household";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface HouseholdCardProps {
  household: Household;
  onClick?: () => void;
}

export function HouseholdCard({ household, onClick }: HouseholdCardProps) {
  return (
    <Card 
      className="w-full cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>
          {household.address || 'No Address'}
        </CardTitle>
        <CardDescription>
          Created on {format(new Date(household.createdAt), 'PPP')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {household.city && household.state && (
            <p className="text-sm text-muted-foreground">
              {household.city}, {household.state} {household.zipCode}
            </p>
          )}
          {household.residents && (
            <p className="text-sm text-muted-foreground">
              {household.residents} {household.residents === 1 ? 'resident' : 'residents'}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Last updated: {format(new Date(household.updatedAt), 'PPP')}
      </CardFooter>
    </Card>
  );
} 