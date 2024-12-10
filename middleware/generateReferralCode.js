const gereferralCode = ()=>{
    const referralCode = Math.floor(1000000 + Math.random() * 9000000)
    return referralCode.toString(); 
}

module.exports = referralCode;