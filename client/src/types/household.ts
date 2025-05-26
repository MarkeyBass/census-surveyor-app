// TODO: check!!!
export enum HousingTypeEnum {
  APARTMENT = "Apartment",
  HOUSE = "House",
  CONDOMINIUM = "Condominium",
  DUPLEX = "Duplex",
  MOBILE_HOME = "Mobile home",
  OTHER = "Other"
}

export enum EnvironmentalPracticeEnum {
  RECYCLING = "Recycling",
  COMPOSTING = "Composting food scraps",
  WATER_CONSERVATION = "Conserving water",
  PLASTIC_REDUCTION = "Reducing plastic use",
  REUSABLE_BAGS = "Using reusable shopping bags",
  LOCAL_INITIATIVES = "Participating in local environmental initiatives"
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
  email: string;
  pictureUrl?: string;
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