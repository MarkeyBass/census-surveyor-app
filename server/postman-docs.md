# Household API Documentation

## Base URL
```
{{base_url}}/api/v1/households
```

## Endpoints

### Get All Households
```http
GET {{base_url}}/api/v1/households
```

**Description:** Retrieves all households, sorted by creation date (newest first)

**Response:**
- Status: 200 OK
- Body: Array of household objects
```json
[
  {
    "_id": "string",
    "familyName": "string",
    "slug": "string"
    "address": "string",
    "surveyStatus": "pending" | "completed",
    "dateSurveyed": "date",
    "focalPoint": {
      "firstName": "string",
      "pictureUrl": "string",
      "email": "string"
    },
    "familyMembers": [
      {
        "firstName": "string",
        "lastName": "string",
        "birthDate": "date"
      }
    ],
    "numberOfCars": "number",
    "hasPets": "boolean",
    "numberOfPets": "number",
    "housingType": {
      "value": "Apartment" | "House" | "Condominium" | "Duplex" | "Mobile home" | "Other",
      "customValue": "string"
    },
    "environmentalPractices": [
      "Recycling" | "Composting food scraps" | "Conserving water" | "Reducing plastic use" | "Using reusable shopping bags" | "Participating in local environmental initiatives"
    ],
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

### Get Single Household
```http
GET {{base_url}}/api/v1/households/:id
```

**Description:** Retrieves a single household by ID

**Parameters:**
- `id` (path parameter): Household ID

**Response:**
- Status: 200 OK
- Body: Household object
```json
{
  "_id": "string",
  "familyName": "string",
  "slug": "string"
  "address": "string",
  "surveyStatus": "pending" | "completed",
  "dateSurveyed": "date",
  "focalPoint": {
    "firstName": "string",
    "pictureUrl": "string",
    "email": "string"
  },
  "familyMembers": [
    {
      "firstName": "string",
      "lastName": "string",
      "birthDate": "date"
    }
  ],
  "numberOfCars": "number",
  "hasPets": "boolean",
  "numberOfPets": "number",
  "housingType": {
    "value": "Apartment" | "House" | "Condominium" | "Duplex" | "Mobile home" | "Other",
    "customValue": "string"
  },
  "environmentalPractices": [
    "Recycling" | "Composting food scraps" | "Conserving water" | "Reducing plastic use" | "Using reusable shopping bags" | "Participating in local environmental initiatives"
  ],
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Create New Household
```http
POST {{base_url}}/api/v1/households
```

**Description:** Creates a new household

**Body:**
```json
{
  "familyName": "string",
  "address": "string",
  "focalPoint": {
    "firstName": "string",
    "pictureUrl": "string",
    "email": "string"
  },
  "familyMembers": [
    {
      "firstName": "string",
      "lastName": "string",
      "birthDate": "date"
    }
  ],
  "numberOfCars": "number",
  "hasPets": "boolean",
  "numberOfPets": "number",
  "housingType": {
    "value": "Apartment" | "House" | "Condominium" | "Duplex" | "Mobile home" | "Other",
    "customValue": "string"
  },
  "environmentalPractices": [
    "Recycling" | "Composting food scraps" | "Conserving water" | "Reducing plastic use" | "Using reusable shopping bags" | "Participating in local environmental initiatives"
  ]
}
```

**Response:**
- Status: 201 Created
- Body: Created household object

### Update Household
```http
PUT {{base_url}}/api/v1/households/:id
```

**Description:** Updates an existing household

**Parameters:**
- `id` (path parameter): Household ID

**Body:**
```json
{
  "familyName": "string",
  "address": "string",
  "focalPoint": {
    "firstName": "string",
    "pictureUrl": "string",
    "email": "string"
  },
  "familyMembers": [
    {
      "firstName": "string",
      "lastName": "string",
      "birthDate": "date"
    }
  ],
  "numberOfCars": "number",
  "hasPets": "boolean",
  "numberOfPets": "number",
  "housingType": {
    "value": "Apartment" | "House" | "Condominium" | "Duplex" | "Mobile home" | "Other",
    "customValue": "string"
  },
  "environmentalPractices": [
    "Recycling" | "Composting food scraps" | "Conserving water" | "Reducing plastic use" | "Using reusable shopping bags" | "Participating in local environmental initiatives"
  ]
}
```

**Response:**
- Status: 200 OK
- Body: Updated household object

### Complete Survey
```http
PUT {{base_url}}/api/v1/households/:id/complete
```

**Description:** Marks a household survey as completed and sets the survey date

**Parameters:**
- `id` (path parameter): Household ID

**Body:**
```json
{
  "familyName": "string",
  "address": "string",
  "focalPoint": {
    "firstName": "string",
    "pictureUrl": "string",
    "email": "string"
  },
  "familyMembers": [
    {
      "firstName": "string",
      "lastName": "string",
      "birthDate": "date"
    }
  ],
  "numberOfCars": "number",
  "hasPets": "boolean",
  "numberOfPets": "number",
  "housingType": {
    "value": "Apartment" | "House" | "Condominium" | "Duplex" | "Mobile home" | "Other",
    "customValue": "string"
  },
  "environmentalPractices": [
    "Recycling" | "Composting food scraps" | "Conserving water" | "Reducing plastic use" | "Using reusable shopping bags" | "Participating in local environmental initiatives"
  ]
}
```

**Response:**
- Status: 200 OK
- Body: Updated household object with `surveyStatus: "completed"` and `dateSurveyed` set

### Delete Household
```http
DELETE {{base_url}}/api/v1/households/:id
```

**Description:** Deletes a household

**Parameters:**
- `id` (path parameter): Household ID

**Response:**
- Status: 200 OK
- Body:
```json
{
  "message": "Household deleted successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Error message",
  "error": "Detailed error information"
}
```

### 404 Not Found
```json
{
  "message": "Household not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message",
  "error": "Detailed error information"
}
```
