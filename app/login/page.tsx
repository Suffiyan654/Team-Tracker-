import { LoginForm } from "@/components/login-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await getSession()

  // If already logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">EdTech Course Tracker</h1>
          <p className="mt-2 text-muted-foreground">Internal Team Portal</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
