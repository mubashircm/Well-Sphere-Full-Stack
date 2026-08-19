import AppError from "../utils/AppError.js";
import * as contactRepo from "../repositories/contactRepository.js";

const VALID_SUBJECTS = [
  "Editorial Feedback",
  "Article Suggestion",
  "General Inquiry",
  "Bug Report",
  "Partnership",
];

const VALID_STATUSES = ["unread", "in-review", "resolved"];

export async function submitInquiry({ name, email, subject, message }) {
  if (!name || !name.trim()) {
    throw new AppError(400, "VALIDATION_ERROR", "Full name is required.");
  }
  if (!email || !email.trim()) {
    throw new AppError(400, "VALIDATION_ERROR", "Email address is required.");
  }
  if (!subject || !VALID_SUBJECTS.includes(subject)) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      `Subject must be one of: ${VALID_SUBJECTS.join(", ")}`
    );
  }
  if (!message || !message.trim()) {
    throw new AppError(400, "VALIDATION_ERROR", "Message cannot be empty.");
  }

  const inquiry = await contactRepo.createInquiry({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject,
    message: message.trim(),
  });

  return inquiry;
}

export async function listInquiries(filters) {
  return contactRepo.findInquiries(filters);
}

export async function setInquiryStatus(id, status) {
  if (!VALID_STATUSES.includes(status)) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      `Status must be one of: ${VALID_STATUSES.join(", ")}`
    );
  }

  const updated = await contactRepo.updateInquiryStatus(id, status);
  if (!updated) {
    throw new AppError(404, "NOT_FOUND", "Inquiry message not found.");
  }

  return updated;
}
