import { Request, Response } from 'express';
import { HouseholdModel } from '../models/Household';
import { HouseholdType } from '../types';

export const householdController = {
  // Get all households
  async getAllHouseholds(req: Request, res: Response) {
    try {
      const households = await HouseholdModel.find().sort({ createdAt: -1 });
      res.json(households);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching households', error });
    }
  },

  // Get a single household by ID
  async getHouseholdById(req: Request, res: Response) {
    try {
      const household = await HouseholdModel.findById(req.params.id);
      if (!household) {
        return res.status(404).json({ message: 'Household not found' });
      }
      res.json(household);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching household', error });
    }
  },

  // Create a new household
  async createHousehold(req: Request, res: Response) {
    try {
      const householdData: Partial<HouseholdType> = {
        ...req.body,
        surveyStatus: 'pending'
      };
      const household = new HouseholdModel(householdData);
      await household.save();
      res.status(201).json(household);
    } catch (error) {
      res.status(400).json({ message: 'Error creating household', error });
    }
  },

  // Update a household
  async updateHousehold(req: Request, res: Response) {
    try {
      const household = await HouseholdModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!household) {
        return res.status(404).json({ message: 'Household not found' });
      }
      res.json(household);
    } catch (error) {
      res.status(400).json({ message: 'Error updating household', error });
    }
  },

  // Complete a survey
  async completeSurvey(req: Request, res: Response) {
    try {
      const household = await HouseholdModel.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          surveyStatus: 'completed',
          dateSurveyed: new Date()
        },
        { new: true, runValidators: true }
      );
      if (!household) {
        return res.status(404).json({ message: 'Household not found' });
      }
      res.json(household);
    } catch (error) {
      res.status(400).json({ message: 'Error completing survey', error });
    }
  },

  // Delete a household
  async deleteHousehold(req: Request, res: Response) {
    try {
      const household = await HouseholdModel.findByIdAndDelete(req.params.id);
      if (!household) {
        return res.status(404).json({ message: 'Household not found' });
      }
      res.json({ message: 'Household deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting household', error });
    }
  }
}; 