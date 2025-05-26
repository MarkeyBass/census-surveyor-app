"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { X, Plus } from "lucide-react";

interface FamilyMember {
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface FamilyMembersFormProps {
  members: FamilyMember[];
  onChange: (members: FamilyMember[]) => void;
  onBlur?: (field: string, value: any) => void;
  errors?: { [key: string]: string };
  touched?: Set<string>;
}

export function FamilyMembersForm({
  members,
  onChange,
  onBlur,
  errors,
  touched,
}: FamilyMembersFormProps) {
  const addMember = () => {
    onChange([
      ...members,
      { firstName: "", lastName: "", birthDate: "" },
    ]);
  };

  const removeMember = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    onChange(newMembers);
  };

  const updateMember = (index: number, field: keyof FamilyMember, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    onChange(newMembers);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Family Members</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMember}
          className="gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="space-y-4">
        {members.map((member, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Member {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMember(index)}
                  className="h-8 w-8 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${index}`}>First Name</Label>
                  <Input
                    id={`firstName-${index}`}
                    value={member.firstName}
                    onChange={(e) => updateMember(index, "firstName", e.target.value)}
                    onBlur={() => onBlur?.(`familyMembers.${index}.firstName`, member.firstName)}
                    maxLength={50}
                  />
                  {touched?.has(`familyMembers.${index}.firstName`) &&
                    errors?.[`familyMembers.${index}.firstName`] && (
                      <p className="text-sm text-red-500">
                        {errors[`familyMembers.${index}.firstName`]}
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                  <Input
                    id={`lastName-${index}`}
                    value={member.lastName}
                    onChange={(e) => updateMember(index, "lastName", e.target.value)}
                    onBlur={() => onBlur?.(`familyMembers.${index}.lastName`, member.lastName)}
                    maxLength={50}
                  />
                  {touched?.has(`familyMembers.${index}.lastName`) &&
                    errors?.[`familyMembers.${index}.lastName`] && (
                      <p className="text-sm text-red-500">
                        {errors[`familyMembers.${index}.lastName`]}
                      </p>
                    )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`birthDate-${index}`}>Birth Date</Label>
                  <Input
                    id={`birthDate-${index}`}
                    type="date"
                    value={member.birthDate}
                    onChange={(e) => updateMember(index, "birthDate", e.target.value)}
                    onBlur={() => onBlur?.(`familyMembers.${index}.birthDate`, member.birthDate)}
                  />
                  {touched?.has(`familyMembers.${index}.birthDate`) &&
                    errors?.[`familyMembers.${index}.birthDate`] && (
                      <p className="text-sm text-red-500">
                        {errors[`familyMembers.${index}.birthDate`]}
                      </p>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {members.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No family members added yet. Click "Add Member" to add one.
          </div>
        )}
      </div>
    </div>
  );
} 