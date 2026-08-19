import Inquiry from "../models/Inquiry.js";

export async function createInquiry(data) {
  return Inquiry.create(data);
}

export async function findInquiries({ status, subject, limit = 50, page = 1 } = {}) {
  const query = {};
  if (status && status !== "all") query.status = status;
  if (subject && subject !== "all") query.subject = subject;

  const skip = (page - 1) * limit;

  const [inquiries, total] = await Promise.all([
    Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Inquiry.countDocuments(query),
  ]);

  return { inquiries, total, page, totalPages: Math.ceil(total / limit) };
}

export async function findInquiryById(id) {
  return Inquiry.findById(id);
}

export async function updateInquiryStatus(id, status) {
  return Inquiry.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
}
