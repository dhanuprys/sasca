// utils/userAgent.js
import UAParser from 'ua-parser-js';

function getBrowserInfo() {
    const parser = new UAParser();
    const result = parser.getResult();
    return result.browser;
};

export default getBrowserInfo;