import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../firebase/config';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import '../css/Registration.css';

const Registration = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, pending, verified, rejected
  const [verificationMessage, setVerificationMessage] = useState('');
  const [currentUserUid, setCurrentUserUid] = useState(null);

  const [formData, setFormData] = useState({
    email: '',  
    password: '',
    confirmPassword: '',
    fullName: '',
    collegeRollNo: '',
    registrationNo: '',
    branch: 'CSE',
    gender: 'Male',
    phone: '',
    utrNumber: '',
  });

  const [files, setFiles] = useState({
    profilePhoto: null,
    paymentScreenshot: null
  });

  const [previews, setPreviews] = useState({
    profile: null,
    payment: null
  });

  // Handle Text Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Uploads with 250KB Limit
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 250 * 1024) {
        alert("File size must be less than 250KB");
        e.target.value = null;
        return;
      }
      
      setFiles({ ...files, [type]: file });
      const objectUrl = URL.createObjectURL(file);
      setPreviews({ ...previews, [type === 'profilePhoto' ? 'profile' : 'payment']: objectUrl });
    }
  };

  // Validate Step 1
  const handleNext = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    if (!files.profilePhoto) {
      alert("Please upload a profile photo.");
      return;
    }
    setStep(2);
  };

  // Final Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.paymentScreenshot || !formData.utrNumber) {
      alert("Please provide payment details (Screenshot & UTR).");
      return;
    }

    setLoading(true);

    try {
      // Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      setCurrentUserUid(user.uid);

      // Upload Profile Photo
      const profileRef = ref(storage, `fresher2025/${user.uid}/profile.jpg`);
      await uploadBytes(profileRef, files.profilePhoto);
      const profileUrl = await getDownloadURL(profileRef);

      // Upload Payment Screenshot
      const paymentRef = ref(storage, `fresher2025/${user.uid}/payment.jpg`);
      await uploadBytes(paymentRef, files.paymentScreenshot);
      const paymentUrl = await getDownloadURL(paymentRef);

      // Save Data to Firestore
      const userData = {
        uid: user.uid,
        email: formData.email,
        fullName: formData.fullName,
        collegeRollNo: formData.collegeRollNo,
        registrationNo: formData.registrationNo,
        branch: formData.branch,
        gender: formData.gender,
        phone: formData.phone,
        utrNumber: formData.utrNumber,
        profileUrl: profileUrl,
        paymentUrl: paymentUrl,
        status: 'pending',
        createdAt: new Date(),
        adminEmail: 'achintyasingh48@gmail.com'
      };

      await setDoc(doc(db, "registrations", user.uid), userData);

      // Update State to "Pending Verification"
      setVerificationStatus('pending');
      setLoading(false);

    } catch (error) {
      console.error("Registration Error:", error);
      let msg = error.message;
      if(error.code === 'auth/email-already-in-use') msg = "Email is already registered.";
      alert(msg);
      setLoading(false);
    }
  };

  // Real-time Listener for Admin Verification
  useEffect(() => {
    if (verificationStatus === 'pending' && currentUserUid) {
      const unsub = onSnapshot(doc(db, "registrations", currentUserUid), (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          
          if (data.status === 'verified') {
            setVerificationStatus('verified');
            setVerificationMessage(data.verificationMessage || 'Your payment has been verified successfully!');
          } else if (data.status === 'rejected') {
            setVerificationStatus('rejected');
            setVerificationMessage(data.verificationMessage || 'Your payment verification was rejected. Please contact admin.');
          }
        }
      });
      return () => unsub();
    }
  }, [verificationStatus, currentUserUid]);

  // Reset and try again
  const handleRetry = () => {
    setVerificationStatus('idle');
    setStep(1);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      collegeRollNo: '',
      registrationNo: '',
      branch: 'CSE',
      gender: 'Male',
      phone: '',
      utrNumber: '',
    });
    setFiles({ profilePhoto: null, paymentScreenshot: null });
    setPreviews({ profile: null, payment: null });
  };

  // RENDER: Success Screen
  if (verificationStatus === 'verified') {
    return (
      <div className="reg-container success-container">
        <div className="success-card">
          <div className="checkmark-circle">
            <div className="background"></div>
            <div className="checkmark draw"></div>
          </div>
          <h1>Welcome Aboard! 🎉</h1>
          <p className="success-message">{verificationMessage}</p>
          <p>You are officially registered for the Fresher 2025 Event.</p>
          <div className="ticket-info">
            <p className="ticket-id">
              <strong>ID:</strong> {formData.collegeRollNo}
            </p>
            <p className="ticket-id">
              <strong>Name:</strong> {formData.fullName}
            </p>
          </div>
          <a href="/" className="btn-primary" style={{display: 'inline-block', marginTop: '1rem', textDecoration: 'none'}}>
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // RENDER: Rejection Screen
  if (verificationStatus === 'rejected') {
    return (
      <div className="reg-container">
        <div className="rejection-card">
          <div className="rejection-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="#ff2d2d" strokeWidth="4"/>
              <path d="M25 25 L55 55 M55 25 L25 55" stroke="#ff2d2d" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>Payment Verification Failed</h2>
          <div className="rejection-message">
            <p><strong>Admin Message:</strong></p>
            <p>{verificationMessage}</p>
          </div>
          <div className="rejection-details">
            <p><strong>Your UTR:</strong> {formData.utrNumber}</p>
            <p><strong>Submitted Email:</strong> {formData.email}</p>
          </div>
          <p className="help-text">
            Please contact the admin at <a href="mailto:achintyasingh48@gmail.com">achintyasingh48@gmail.com</a> for assistance.
          </p>
          <button onClick={handleRetry} className="btn-primary">
            Register Again
          </button>
        </div>
      </div>
    );
  }

  // RENDER: Waiting Screen
  if (verificationStatus === 'pending') {
    return (
      <div className="reg-container">
        <div className="verification-card">
          <div className="loader-ring"></div>
          <h2>Verification in Progress</h2>
          <p>We are verifying your payment details.</p>
          <div className="info-box">
            <p><strong>UTR:</strong> {formData.utrNumber}</p>
            <p><strong>Status:</strong> Pending Admin Approval</p>
          </div>
          <div className="admin-notification">
            <div className="notification-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#ff2d2d"/>
              </svg>
            </div>
            <p>
              An alert has been sent to <strong>achintyasingh48@gmail.com</strong>
            </p>
          </div>
          <p className="admin-note">
            This page will update automatically once verified or if there are any issues.
            <br />
            <small>You can safely close this page and check back later.</small>
          </p>
        </div>
      </div>
    );
  }

  // RENDER: Registration Form
  return (
    <div className="reg-container">
      <form className="reg-form" onSubmit={step === 1 ? handleNext : handleSubmit}>
        <h2>Fresher 2024   Registration</h2>
        <div className="step-indicator">Step {step} of 2</div>

        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <div className="form-step fade-in">
            {/* Photo Upload */}
            <div className="photo-upload-wrapper">
              <label htmlFor="profilePhoto" className="photo-label">
                {previews.profile ? (
                  <img src={previews.profile} alt="Preview" className="photo-preview" />
                ) : (
                  <div className="photo-placeholder">
                    <span>Upload Photo</span>
                    <small>(Max 250KB)</small>
                  </div>
                )}
              </label>
              <input 
                type="file" 
                id="profilePhoto" 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, 'profilePhoto')} 
                style={{display: 'none'}} 
              />
            </div>

            <div className="form-grid">
              <input 
                type="text" name="fullName" placeholder="Full Name" required 
                value={formData.fullName} onChange={handleChange} 
              />
              <input 
                type="tel" name="phone" placeholder="Phone Number" required 
                value={formData.phone} onChange={handleChange} 
              />
              
              <input 
                type="text" name="collegeRollNo" placeholder="College Roll No" required 
                value={formData.collegeRollNo} onChange={handleChange} 
              />
              <input 
                type="text" name="registrationNo" placeholder="College Reg No" required 
                value={formData.registrationNo} onChange={handleChange} 
              />

              {/* Branch Selector */}
              <select name="branch" onChange={handleChange} value={formData.branch} required>
                <option value="CSE">CSE</option>
                <option value="AI/ML">CSE (AI & ML)</option>
                <option value="DS">CSE (Data Science)</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="EEE">EEE</option>
                <option value="ECE">ECE</option>
              </select>

              {/* Gender Selector */}
              <select name="gender" onChange={handleChange} value={formData.gender} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-full">
              <input 
                type="email" name="email" placeholder="Email Address" required 
                value={formData.email} onChange={handleChange} 
              />
              <div className="password-grid">
                <input 
                  type="password" name="password" placeholder="Create Password" required 
                  value={formData.password} onChange={handleChange} 
                />
                <input 
                  type="password" name="confirmPassword" placeholder="Confirm Password" required 
                  value={formData.confirmPassword} onChange={handleChange} 
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">Next: Payment Details</button>
          </div>
        )}

        {/* STEP 2: Payment Details */}
        {step === 2 && (
          <div className="form-step fade-in">
            <div className="payment-info">
              <h3>Contribution Amount: ₹500</h3>
              <p>Please scan the QR code to pay.</p>
              <div className="qr-placeholder">
                <img src="https://via.placeholder.com/200x200/1a1a1a/ff2d2d?text=QR+CODE" alt="Payment QR Code" />
              </div>
            </div>

            <input 
              type="text" 
              name="utrNumber" 
              placeholder="Enter UTR / Transaction ID" 
              required 
              value={formData.utrNumber}
              onChange={handleChange} 
              className="utr-input"
            />

            <div className="photo-upload-wrapper rectangle">
              <label htmlFor="paymentScreenshot" className="photo-label">
                {previews.payment ? (
                  <img src={previews.payment} alt="Payment" className="photo-preview" />
                ) : (
                  <div className="photo-placeholder">
                    <span>Upload Payment Screenshot</span>
                    <small>(Max 250KB)</small>
                  </div>
                )}
              </label>
              <input 
                type="file" 
                id="paymentScreenshot" 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, 'paymentScreenshot')} 
                style={{display: 'none'}} 
              />
            </div>

            <div className="btn-group">
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Complete Registration'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Registration;