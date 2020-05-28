import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { format, getDay, getMonth, getYear, formatDistance, differenceInHours, formatRelative } from 'date-fns'

function shortenUnits (str) {
  return str
    .replace('about ', '')
    .replace('minutes', 'min')
    .replace('minute', 'min')
    .replace('seconds', 'sec')
    .replace('second', 'sec')
    .replace('hours', 'hr')
    .replace('hour', 'hr')
}

export default {
  // https://date-fns.org/v2.0.0-alpha.10/docs/format

  /*
   Rules:
    1. If less than 8 hours ago, display the relative time (8 hours being a regular working day)
    2. If its the same day, but over 8 hours, show the exact time.
    3. If its not the same day but is the same month, show the date and the exact time.
    4. If its not the same month, show the date
    5. If its not the same year, show the date and year
  */

  timeRelative (date) {
    return formatRelative(date, new Date())
  },

  timeAgo (date, now = new Date()) {
    const diff = differenceInHours(now, date)

    const day = getDay(date)
    const curDay = getDay(now)

    if (day === curDay && diff < 6) {
      const when = shortenUnits(formatDistance(date, now))
      return when + ' ago'
    }

    return format(date, 'h:mm a')
  },

  timeAgoVerbose (date, now = new Date()) {
    const diff = differenceInHours(now, date)

    const day = getDay(date)
    const curDay = getDay(now)

    if (day === curDay && diff < 6) {
      const when = shortenUnits(formatDistance(date, now))
      return when + ' ago' // today
    }

    else if (day === curDay) {
      return format(date, 'h:mm a')
    }

    const year = getYear(date)
    const curYear = getYear(now)

    const month = getMonth(date)
    const curMonth = getMonth(now)

    if (year !== curYear) {
      return format(date, 'MMM, yyyy') // a different year
    }

    else if (month !== curMonth) {
      return format(date, 'MMM d') // a different month
    }

    return format(date, 'MMM d') // this month
  },

  displayName (contact) {
    if (contact.first || contact.last) {
      if (contact.first && contact.last) {
        return contact.first.trim() + ' ' + contact.last.trim()
      } else {
        return (contact.first || contact.last).trim()
      }
    } else {
      return 'Unknown Contact'
    }
  },

  phoneNumber (phone) {
    try {
      const phoneNumber = parsePhoneNumberFromString(phone, 'US')
      return phoneNumber.formatNational()
    } catch (e) {
      return phone
    }
  },

  phoneNumberInternational (phone) {
    try {
      const phoneNumber = parsePhoneNumberFromString(phone, 'US')
      return phoneNumber.formatInternational()
    } catch (e) {
      return phone
    }
  }
}
