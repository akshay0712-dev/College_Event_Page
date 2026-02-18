import emailjs from '@emailjs/browser';

// ============================================================
// ✅ REPLACE THESE WITH YOUR ACTUAL EmailJS CREDENTIALS
// Get them from: https://www.emailjs.com/
// Account → API Keys → Public Key
// Email Services → Your Service ID
// Email Templates → Your Template IDs
// ============================================================
const SERVICE_ID = 'service_lox9a47';         // e.g. 'service_abc123'
const PUBLIC_KEY = 'owVDz9Fo3FQoYw3_x';         // e.g. 'xKj2_abc123XYZ'
const TEMPLATE_VERIFIED = 'template_welcome123'; // e.g. 'template_abc123'
const TEMPLATE_REJECTED = 'template_reject123'; // e.g. 'template_xyz456'

// Initialize EmailJS — also call this in main.jsx
export const initEmailJS = () => {
  emailjs.init(PUBLIC_KEY);
};

// ── Send Welcome / Verification Email ──
export const sendWelcomeEmail = async (registration) => {
  try {
    const templateParams = {
      to_name: registration.fullName || registration.name || 'Student',
      to_email: registration.email,
      branch: registration.branch || 'N/A',
      roll_no: registration.collegeRollNo || registration.rollNo || 'N/A',
      reg_no: registration.registrationNo || registration.regNo || 'N/A',
      verification_message:
        registration.verificationMessage ||
        'Payment verified! Welcome to Fresher 2026.',
      event_name: 'GEC Fresher 2026',
    };

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_VERIFIED,
      templateParams,
      PUBLIC_KEY
    );

    console.log('✅ Welcome email sent:', result.status);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Welcome email failed:', error);
    return { success: false, error: error.text || error.message };
  }
};

// ── Send Rejection Email ──
export const sendRejectionEmail = async (registration, reason) => {
  try {
    const templateParams = {
      to_name: registration.fullName || registration.name || 'Student',
      to_email: registration.email,
      rejection_reason:
        reason || 'Your payment could not be verified. Please contact admin.',
      event_name: 'GEC Fresher 2026',
    };

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_REJECTED,
      templateParams,
      PUBLIC_KEY
    );

    console.log('✅ Rejection email sent:', result.status);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Rejection email failed:', error);
    return { success: false, error: error.text || error.message };
  }
};