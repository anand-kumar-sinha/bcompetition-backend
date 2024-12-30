const generateReferralCode = () => {
    const otp = Math.floor(100000 + Math.random() * 9000000);
    return otp.toString(); 
  };
  
  module.exports = generateReferralCode;