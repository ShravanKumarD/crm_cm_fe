import React, { useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Auth.css'; // Import custom CSS

const AuthPage = () => {
    const [isSignup, setIsSignup] = useState(false);

    const toggleForm = () => {
        setIsSignup(!isSignup);
    };

    return (
        <div className="auth-container">
                        <div className="auth-box">
                            <label className="text-center auth-header"><strong>{isSignup ? 'Signup' : 'Login'}</strong></label>
                            {isSignup ? <SignupPage /> : <LoginPage />}
                            <div className="text-center mt-3">
                                <button className="btn btn-link btn-toggle loginText" onClick={toggleForm}>
                                    {isSignup ? 'Already have an account? Login' : 'Don\'t have an account? Signup'}
                                </button>
                    </div>
                </div>
        </div>
    );
};

export default AuthPage;
