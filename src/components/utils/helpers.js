// src/components/utils/helpers.js

export const formatMarketCap = (marketCap) => {
  if (!marketCap || isNaN(marketCap)) return 'N/A';
  
  if (marketCap >= 1e12) {  // Trillion
      return `${(marketCap / 1e12).toLocaleString(undefined, { maximumFractionDigits: 2 })}T`;
  } else if (marketCap >= 1e9) {  // Billion
      return `${(marketCap / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 })}B`;
  } else if (marketCap >= 1e6) {  // Million
      return `${(marketCap / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 })}M`;
  }
  return marketCap.toLocaleString();
};

// Rest of your helper functions remain the same
export const formatVolume = (volume) => {
  if (!volume || isNaN(volume)) return 'N/A';
  if (volume >= 1e12) {  // Trillion
    return `${(volume / 1e12).toLocaleString(undefined, { maximumFractionDigits: 2 })}T`;
} else if (volume >= 1e9) {  // Billion
    return `${(volume / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 })}B`;
} else if (volume >= 1e6) {  // Million
    return `${(volume / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 })}M`;
}
  return volume.toLocaleString();
};

export const formatDate = (date) => {
  if (!date || date === 'Invalid Date' || date === 'N/A') {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 90));
      return futureDate.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
      });
  }
  
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
      return 'N/A';
  }
  
  return parsedDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
  });
};

export const formatNumber = (num) => {
  if (!num || isNaN(num)) return 'N/A';
  return parseFloat(num).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  });
};