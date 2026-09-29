
const isEmailConfigured = () => {
  return Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

const sendEmail = async ({ to, subject, body }) => {
  if (!isEmailConfigured()) {
    console.log(`[emailService] Email not configured - would have sent:`);
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Body: ${body}`);
    return { sent: false, reason: "Email not configured" };
  }

  console.log(`[emailService] Would send real email to ${to}: ${subject}`);
  return { sent: true };
};

export const sendBookingConfirmationEmail = async (user, booking) => {
  return sendEmail({
    to: user.email,
    subject: "Your StayEase booking is confirmed",
    body: `Hi ${user.name}, your booking for ${booking.checkIn} to ${booking.checkOut} is confirmed. Total: Rs.${booking.totalAmount}.`,
  });
};

export const sendCancellationEmail = async (user, booking) => {
  return sendEmail({
    to: user.email,
    subject: "Your StayEase booking has been cancelled",
    body: `Hi ${user.name}, your booking for ${booking.checkIn} to ${booking.checkOut} has been cancelled.`,
  });
};

export const sendComplaintUpdateEmail = async (user, complaint) => {
  return sendEmail({
    to: user.email,
    subject: "Update on your StayEase complaint",
    body: `Hi ${user.name}, your complaint "${complaint.subject}" status is now: ${complaint.status}.`,
  });
};

export const sendVerificationEmail = async (user, code) => {
  return sendEmail({
    to: user.email,
    subject: "Verify your StayEase account",
    body: `Hi ${user.name}, your verification code is: ${code}. This code expires in 15 minutes.`,
  });
};