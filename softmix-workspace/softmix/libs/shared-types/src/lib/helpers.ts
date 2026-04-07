function getCurrentSeconds() {
  return Math.floor(Date.now() / 1000);
}

function isTokenData(obj: any) {
  return (
    obj != null &&
    typeof obj === 'object' &&
    'accessToken' in obj &&
    'refreshToken' in obj &&
    'expiresIn' in obj
  );
}

const getPageOffset = (page: number, limit: number) => {
  return (page - 1) * limit;
}

export {
  getCurrentSeconds,
  isTokenData,
  getPageOffset,
}
