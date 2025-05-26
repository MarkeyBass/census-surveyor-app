// TODO: check!!!
export enum HousingTypeEnum {
  APARTMENT = "Apartment",
  HOUSE = "House",
  CONDO = "Condo",
  OTHER = "Other"
}

export enum EnvironmentalPracticeEnum {
  RECYCLING = "Recycling",
  COMPOSTING = "Composting",
  SOLAR_PANELS = "Solar Panels",
  WATER_CONSERVATION = "Water Conservation",
  ENERGY_EFFICIENT_APPLIANCES = "Energy Efficient Appliances"
}

export enum SurveyStatusEnum {
  PENDING = "pending",
  COMPLETED = "completed",
}

export interface FamilyMember {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface FocalPoint {
  firstName?: string;
  pictureUrl?: string;
  email: string;
}

export interface HousingType {
  value: HousingTypeEnum;
  customValue?: string;
}

export interface Household {
  _id: string;
  slug: string;
  familyName: string;
  address: string;
  surveyStatus: SurveyStatusEnum;
  dateSurveyed: string | null;
  focalPoint: FocalPoint;
  familyMembers: FamilyMember[];
  numberOfCars?: number;
  hasPets?: boolean;
  numberOfPets?: number;
  housingType?: HousingType;
  environmentalPractices?: EnvironmentalPracticeEnum[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
} 