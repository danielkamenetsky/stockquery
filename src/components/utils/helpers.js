export const formatMarketCap = (value) => {
  console.log('value in mcap', value);
  return `$${Number(value).toString()}`;
};

export const formatVolume = (value) => {
  console.log('value in volume', value);
  return `$${Math.round(Number(value)).toString()}`;
};

export const formatDate = (value) => {
  console.log('value in date', value);
  return new Date(value).toDateString();
};

