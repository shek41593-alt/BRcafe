import { format, parse, isWithinInterval, addDays, getDay, isSameDay } from 'date-fns';

/**
 * Calculates if the store is currently open and returns relevant status info.
 * 
 * @param {Object} store - The store object from Prisma with regularHours and holidayHours included.
 * @param {Date} now - The reference date (defaults to current date).
 * @returns {Object} - { isOpen: boolean, message: string, status: 'open' | 'closed' }
 */
export function getStoreStatus(store, now = new Date()) {
  if (!store || !store.regularHours) {
    return { isOpen: false, message: 'Store information unavailable', status: 'closed' };
  }

  // 1. Check for Holiday Hours first
  const holiday = store.holidayHours?.find(h => isSameDay(new Date(h.date), now));
  
  if (holiday) {
    if (holiday.isClosed) {
      return { isOpen: false, message: `Closed today for ${holiday.reason || 'Holiday'}`, status: 'closed' };
    }
    
    if (holiday.openTime && holiday.closeTime) {
      const openTime = parse(holiday.openTime, 'HH:mm', now);
      const closeTime = parse(holiday.closeTime, 'HH:mm', now);
      
      const isOpen = isWithinInterval(now, { start: openTime, end: closeTime });
      return { 
        isOpen, 
        message: isOpen ? `Open today (${holiday.openTime} - ${holiday.closeTime})` : `Closed (Holiday Hours: ${holiday.openTime} - ${holiday.closeTime})`,
        status: isOpen ? 'open' : 'closed'
      };
    }
  }

  // 2. Check Regular Hours
  const currentDay = getDay(now); // 0 = Sunday
  const todayHours = store.regularHours.find(rh => rh.dayOfWeek === currentDay);

  if (!todayHours || todayHours.isClosed) {
    return { isOpen: false, message: 'Closed today', status: 'closed' };
  }

  const openTime = parse(todayHours.openTime, 'HH:mm', now);
  const closeTime = parse(todayHours.closeTime, 'HH:mm', now);

  const isOpen = isWithinInterval(now, { start: openTime, end: closeTime });

  return {
    isOpen,
    message: isOpen ? `Open now until ${todayHours.closeTime}` : `Closed (Regular hours: ${todayHours.openTime} - ${todayHours.closeTime})`,
    status: isOpen ? 'open' : 'closed',
    todayHours
  };
}
