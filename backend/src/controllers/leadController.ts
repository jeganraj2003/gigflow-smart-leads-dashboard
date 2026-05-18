import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest } from '../middleware/authMiddleware';
import { Parser } from 'json2csv';

export const createLead = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, status, source } = req.body;
    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user._id,
    });
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server Error' });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const { status, source, search, sort, page = 1, limit = 10 } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions: any = {};
    if (sort === 'oldest') {
      sortOptions.createdAt = 1;
    } else {
      sortOptions.createdAt = -1; // latest
    }

    const skip = (Number(page) - 1) * Number(limit);

    const leads = await Lead.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'name email');

    const total = await Lead.countDocuments(query);

    res.json({
      leads,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server Error' });
  }
};

export const getLeadById = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (lead) {
      res.json(lead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server Error' });
  }
};

export const updateLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.name = req.body.name || lead.name;
      lead.email = req.body.email || lead.email;
      lead.status = req.body.status || lead.status;
      lead.source = req.body.source || lead.source;

      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server Error' });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      await Lead.deleteOne({ _id: lead._id });
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server Error' });
  }
};

export const exportLeadsCSV = async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find({}).populate('createdBy', 'name email').lean();
    
    // Format data for CSV
    const formattedLeads = leads.map((lead: any) => ({
      _id: lead._id,
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      createdAt: lead.createdAt,
      createdBy: lead.createdBy ? lead.createdBy.name : 'Unknown'
    }));

    const fields = ['_id', 'name', 'email', 'status', 'source', 'createdAt', 'createdBy'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(formattedLeads);

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server Error' });
  }
};
