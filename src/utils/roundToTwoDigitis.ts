const roundToTwoDigits = (num: number): number => {
  return Math.round(num * 100) / 100;
};

export default roundToTwoDigits;
