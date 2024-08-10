require('dotenv').config();

const CryptoJS = require('crypto-js');

export const encrypt = (data: string) => {
    const secret = process.env.SECRET_KEY;
    return CryptoJS.AES.encrypt(data, secret).toString();
}

export const decrypt = (data: string) => {
    const secret = process.env.SECRET_KEY;
    const bytes = CryptoJS.AES.decrypt(data, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
}

