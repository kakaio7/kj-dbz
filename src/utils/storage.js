export function readStoredNumberArray(key, fallback = []) {
  if (typeof window === "undefined") {
    return fallback
  }

  try {
    const rawValue = window.localStorage.getItem(key)

    if (!rawValue) {
      return fallback
    }

    const parsed = JSON.parse(rawValue)

    if (!Array.isArray(parsed)) {
      return fallback
    }

    const sanitized = parsed
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 0)

    return [...new Set(sanitized)]
  } catch {
    return fallback
  }
}

export function writeStoredNumberArray(key, values) {
  if (typeof window === "undefined") {
    return
  }

  try {
    const normalized = Array.isArray(values)
      ? values
          .map((value) => Number(value))
          .filter((value) => Number.isInteger(value) && value >= 0)
      : []

    window.localStorage.setItem(key, JSON.stringify([...new Set(normalized)]))
  } catch {
    // Ignore storage quota/privacy issues in browser environments.
  }
}

export function readStoredString(key, fallback = "", maxLength = 140) {
  if (typeof window === "undefined") {
    return fallback
  }

  try {
    const rawValue = window.localStorage.getItem(key)

    if (!rawValue) {
      return fallback
    }

    const parsed = JSON.parse(rawValue)
    return typeof parsed === "string" ? parsed.trim().slice(0, maxLength) : fallback
  } catch {
    return fallback
  }
}

export function writeStoredString(key, value, maxLength = 140) {
  if (typeof window === "undefined" || typeof value !== "string") {
    return false
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value.trim().slice(0, maxLength)))
    return true
  } catch {
    return false
  }
}
