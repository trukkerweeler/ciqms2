import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const config = {
DB_HOST: "ciqms.chgubqsqxrvz.us-east-2.rds.amazonaws.com",
DB_USER: "admin",
DB_PASS: "$4Aws36009",
PORT: 3010
};

module.exports = config;