"use client";
import React, { useState } from "react";
import { CreateSurveyModal } from "./create-survey-modal";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const HouseholdsHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="sticky top-5 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8 pb-4 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl 2lg:text-3xl font-bold ">
          <span className="hidden sm:inline">Household Surveys - </span>Admin Panel
        </h1>

        <div
          className="flex items-center justify-center gap-3 flex-shrink-0"
          id="clerk-user-container"
        >
          <Button
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Survey</span>
          </Button>
        </div>
      </div>
      <CreateSurveyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default HouseholdsHeader;
