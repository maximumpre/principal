// Telegram-based activity logging - no external database needed

export interface Activity {
  id: string
  type: "visitor" | "login" | "email_verification" | "text_verification"
  timestamp: string
  date: string // YYYY-MM-DD format for easy filtering
  data: unknown
}

// Activity logging disabled - removed Telegram backup group configuration
async function sendActivityToTelegram(_activity: Activity) {
  return
}

export async function logActivity(activity: Omit<Activity, "id" | "date">) {
  try {
    const date = new Date().toISOString().split("T")[0]
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`

    const logEntry: Activity = {
      id,
      date,
      ...activity,
    }

    await sendActivityToTelegram(logEntry)

    return logEntry
  } catch (error) {
    console.error("Failed to log activity:", error)
    return null
  }
}

export async function getActivitiesForDate(_date: string): Promise<Activity[]> {
  return []
}

export async function getDailyStats(date: string) {
  const activities = await getActivitiesForDate(date)

  return {
    date,
    totalActivities: activities.length,
    visitors: activities.filter((a) => a.type === "visitor").length,
    logins: activities.filter((a) => a.type === "login").length,
    emailVerifications: activities.filter((a) => a.type === "email_verification").length,
    textVerifications: activities.filter((a) => a.type === "text_verification").length,
    uniqueIPs: new Set(activities.filter((a) => a.data && typeof a.data === "object" && "ip" in a.data).map((a) => (a.data as { ip: string }).ip)).size,
    activities,
  }
}
