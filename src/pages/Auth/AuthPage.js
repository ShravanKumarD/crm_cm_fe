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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="auth-container">
                        <div className="auth-card">
                            <h2 className="text-center auth-header">{isSignup ? 'Signup' : 'Login'}</h2>
                            {isSignup ? <SignupPage /> : <LoginPage />}
                            <div className="text-center mt-3">
                                <button className="btn btn-link btn-toggle loginText" onClick={toggleForm}>
                                    {isSignup ? 'Already have an account? Login' : 'Don\'t have an account? Signup'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
