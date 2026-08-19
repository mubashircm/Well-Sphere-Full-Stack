import * as contactService from "../services/contactService.js";

export async function submitContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;
    const inquiry = await contactService.submitInquiry({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out. Your inquiry has been received.",
      data: {
        id: inquiry.id,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getInquiries(req, res, next) {
  try {
    const { status, subject, page, limit } = req.query;
    const result = await contactService.listInquiries({
      status,
      subject,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await contactService.setInquiryStatus(id, status);

    res.status(200).json({
      success: true,
      message: `Inquiry marked as ${status}.`,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
}
