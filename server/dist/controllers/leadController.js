import * as leadService from '../services/leadService.js';
export const createLead = async (req, res, next) => {
    try {
        const lead = await leadService.createLead(req.body, String(req.user?._id));
        res.status(201).json(lead);
    }
    catch (error) {
        next(error);
    }
};
export const getLeads = async (req, res, next) => {
    try {
        const data = await leadService.getLeads(req.query);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
};
export const getLeadById = async (req, res, next) => {
    try {
        const lead = await leadService.getLeadById(req.params.id);
        res.json(lead);
    }
    catch (error) {
        next(error);
    }
};
export const updateLead = async (req, res, next) => {
    try {
        const lead = await leadService.updateLead(req.params.id, req.body);
        res.json(lead);
    }
    catch (error) {
        next(error);
    }
};
export const deleteLead = async (req, res, next) => {
    try {
        const result = await leadService.deleteLead(req.params.id);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
export const exportLeads = async (req, res, next) => {
    try {
        const csv = await leadService.exportLeadsCSV();
        res.header('Content-Type', 'text/csv');
        res.attachment('leads.csv');
        res.send(csv);
    }
    catch (error) {
        next(error);
    }
};
