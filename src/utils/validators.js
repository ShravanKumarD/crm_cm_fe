export const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const validateRequired = (value) => {
    return value.trim() !== '';
};
