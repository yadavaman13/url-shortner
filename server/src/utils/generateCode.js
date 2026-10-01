const generateCode = () => {
    const mainStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let shortCode = '';

    for (let i = 0; i < 6; i++) {
        shortCode += mainStr.charAt(Math.floor(Math.random() * mainStr.length));
    }

    return shortCode;
};

export default generateCode;
