# Census Surveyor API

A RESTful API for managing household census surveys.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/census-surveyor
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Households

#### GET /api/households
Get all households.

#### GET /api/households/:id
Get a specific household by ID.

#### POST /api/households
Create a new household.

Request body:
```json
{
  "familyName": "string",
  "address": "string",
  "numberOfCars": "number",
  "hasPets": "boolean",
  "numberOfPets": "number (optional)",
  "housingType": "Apartment | House | Condominium | Duplex | Mobile home | Other",
  "environmentalPractices": [
    "Recycling",
    "Composting food scraps",
    "Conserving water",
    "Reducing plastic use",
    "Using reusable shopping bags",
    "Participating in local environmental initiatives"
  ]
}
```

#### PUT /api/households/:id
Update a household.

#### POST /api/households/:id/complete-survey
Complete a survey for a household.

#### DELETE /api/households/:id
Delete a household.

## Data Models

### Household
```typescript
interface Household {
  familyName: string;
  address: string;
  surveyStatus: 'pending' | 'completed';
  dateSurveyed?: Date;
  focalPoint?: {
    firstName: string;
    pictureUrl?: string;
  };
  familyMembers: Array<{
    firstName: string;
    lastName: string;
    birthDate: Date;
  }>;
  numberOfCars: number;
  hasPets: boolean;
  numberOfPets?: number;
  housingType: 'Apartment' | 'House' | 'Condominium' | 'Duplex' | 'Mobile home' | 'Other';
  environmentalPractices: Array<
    | 'Recycling'
    | 'Composting food scraps'
    | 'Conserving water'
    | 'Reducing plastic use'
    | 'Using reusable shopping bags'
    | 'Participating in local environmental initiatives'
  >;
  createdAt: Date;
  updatedAt: Date;
}
``` 