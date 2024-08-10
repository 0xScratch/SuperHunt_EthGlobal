require('dotenv').config();

const CryptoJS = require('crypto-js');

export const encrypt = (data: string) => {
    const secret = process.env.NEXT_PUBLIC_SECRET_KEY;
    if (!secret) {
        throw new Error('Secret key not found');
    }
    return CryptoJS.AES.encrypt(data, secret).toString();
}

export const decrypt = (data: string) => {
    const secret = process.env.NEXT_PUBLIC_SECRET_KEY;
    const bytes = CryptoJS.AES.decrypt(data, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
}

