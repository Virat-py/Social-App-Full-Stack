"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {useState} from 'react'
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async () => {
    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        password: password,
      }),
    });
    if (res.status === 403) {
      setError("Error: Username already in use");
      return;
    }

    if (!res.ok) {
      console.error("Login failed");
      return;
    }

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    // 1️⃣ store token
    localStorage.setItem("token", data.access_token);

    // 2️⃣ redirect
    router.push("/posts");
  };

  const login = async () => {
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        password: password,
      }),
    });
    if (res.status === 401) {
      setError(`Error: Incorrect password for ${userId}`);
      return;
    }
    if (!res.ok) {
      console.error("Login failed");
      return;
    }

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    // 1️⃣ store token
    localStorage.setItem("token", data.access_token);

    // 2️⃣ redirect
    router.push("/posts");
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-indigo-700">
            Register or Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}
            <FieldGroup>
              <Field >
                <FieldLabel htmlFor="user_id" className="mt-4">User Name</FieldLabel>
                <Input
                  id="user_id"
                  type="user_id"
                  placeholder="Enter your User Name"
                  required
                  onChange={(e) => setUserId(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter your Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <Button type="submit" variant="secondary" onClick={register}>
                  Register
                </Button>
                <Button type="submit" onClick={login}>
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
