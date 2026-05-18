import Lead from '../models/Lead.js';
import { createLeadSchema, updateLeadSchema } from '../validators/leadValidator.js';
import { Parser } from 'json2csv';
export const createLead = async (leadData, userId) => {
    const validatedData = createLeadSchema.parse(leadData);
    const lead = await Lead.create({
        ...validatedData,
        createdBy: userId,
    });
    return lead;
};
export const getLeads = async (queryOptions) => {
    const { status, source, search, sort, page = 1, limit = 10 } = queryOptions;
    const query = {};
    if (status)
        query.status = status;
    if (source)
        query.source = source;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }
    const sortOptions = {};
    if (sort === 'oldest') {
        sortOptions.createdAt = 1;
    }
    else {
        sortOptions.createdAt = -1;
    }
    const skip = (Number(page) - 1) * Number(limit);
    const leads = await Lead.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate('createdBy', 'name email');
    const total = await Lead.countDocuments(query);
    return {
        leads,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
    };
};
export const getLeadById = async (id) => {
    const lead = await Lead.findById(id).populate('createdBy', 'name email');
    if (!lead)
        throw new Error('Lead not found');
    return lead;
};
export const updateLead = async (id, leadData) => {
    const validatedData = updateLeadSchema.parse(leadData);
    const lead = await Lead.findByIdAndUpdate(id, validatedData, { new: true });
    if (!lead)
        throw new Error('Lead not found');
    return lead;
};
export const deleteLead = async (id) => {
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead)
        throw new Error('Lead not found');
    return { message: 'Lead removed' };
};
export const exportLeadsCSV = async () => {
    const leads = await Lead.find({}).populate('createdBy', 'name email').lean();
    const formattedLeads = leads.map((lead) => ({
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
    return json2csvParser.parse(formattedLeads);
};
