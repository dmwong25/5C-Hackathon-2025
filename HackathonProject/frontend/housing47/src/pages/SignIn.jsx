import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing in a field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      // Send POST request to your server
      const response = await axios.post('https://backend-housing47.onrender.comlogin', formData);
      
      console.log("Login successful:", response.data);
      
      // Store user data or token in localStorage/sessionStorage if needed
      localStorage.setItem('userId', response.data.user.id);
      
      // Redirect to dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      
      // More detailed error handling
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        const errorMessage = error.response.data.message || 
                            error.response.data || 
                            "Login failed. Please check your credentials.";
        setSubmitError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      } else if (error.request) {
        // The request was made but no response was received
        setSubmitError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setSubmitError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleGoToSignUp = () => {
    navigate("/signup");
  };

  return (
    <div style={styles.page}>
      <div style={styles.loginContainer}>
        <div style={styles.header}>
          <button 
            onClick={handleBackToHome}
            style={styles.backButton}
          >
            ← Back
          </button>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>🏠</span>
            <span style={styles.logoText}>Housing47</span>
          </div>
        </div>
        
        <h1 style={styles.title}>Sign In</h1>
        <p style={styles.subtitle}>Welcome back to Housing47</p>
        
        {submitError && (
          <div style={styles.submitErrorContainer}>
            <p style={styles.submitErrorText}>{submitError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {})
              }}
              placeholder="your.email@university.edu"
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {})
              }}
              placeholder="••••••••"
            />
            {errors.password && <p style={styles.errorText}>{errors.password}</p>}
            <div style={styles.forgotPassword}>
              <a href="#" style={styles.link}>Forgot password?</a>
            </div>
          </div>
          
          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
        
        <div style={styles.signupLink}>
          Don't have an account? <a href="#" onClick={handleGoToSignUp} style={styles.link}>Sign up</a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #EBF4FF, #E0E7FF)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  loginContainer: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '2rem',
    width: '100%',
    maxWidth: '500px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#4F46E5',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: '1.25rem',
    color: '#4F46E5',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6B7280',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  submitErrorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1.5rem',
    borderLeft: '4px solid #EF4444',
  },
  submitErrorText: {
    color: '#B91C1C',
    margin: 0,
    fontSize: '0.875rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #D1D5DB',
    fontSize: '1rem',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: '0.75rem',
    margin: '0.25rem 0 0 0',
  },
  forgotPassword: {
    textAlign: 'right',
    fontSize: '0.75rem',
    marginTop: '0.5rem',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    color: 'white',
    fontWeight: '500',
    fontSize: '1rem',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '0.5rem',
  },
  signupLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.875rem',
    color: '#6B7280',
  },
  link: {
    color: '#4F46E5',
    fontWeight: '500',
    textDecoration: 'none',
  },
};