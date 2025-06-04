const jwt = require('jsonwebtoken');

const generateTokens = (userId) => {
  const payload = { userId };
  
  // Access token - short lived (15 minutes)
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '15m',
      issuer: 'examinr',
      audience: 'examinr-users'
    }
  );
  
  // Refresh token - long lived (7 days)
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh',
    { 
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d',
      issuer: 'examinr',
      audience: 'examinr-users'
    }
  );
  
  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'examinr',
    audience: 'examinr-users'
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(
    token, 
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh',
    {
      issuer: 'examinr',
      audience: 'examinr-users'
    }
  );
};

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken
};