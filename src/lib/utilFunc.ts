
export function generateUsername (email : string) {
    const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, ""); 
    const uniqueSuffix = Date.now().toString().slice(-4); 
    return baseUsername + uniqueSuffix;
}

export function formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }