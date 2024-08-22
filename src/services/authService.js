// Simulated authentication service

export const login = async (credentials) => {
    // Simulate user login
    if (credentials.username === 'admin' && credentials.password === 'password') {
        return { username: 'admin', token: 'fake-jwt-token' };
    }
    throw new Error('Invalid credentials');
};

export const logout = () => {
    // Simulate user logout
};
