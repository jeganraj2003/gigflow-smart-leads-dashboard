import { Request, Response, NextFunction } from 'express';
import * as leadService from '../services/leadService.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const createLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lead = await leadService.createLead(req.body, String(req.user?._id));
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await leadService.getLeads(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await leadService.getLeadById(req.params.id as string);
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await leadService.updateLead(req.params.id as string, req.body);
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await leadService.deleteLead(req.params.id as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const exportLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const csv = await leadService.exportLeadsCSV();
    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
