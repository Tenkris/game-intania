"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/utils/api/auth";
import Link from "next/link";

export default function Signup() {

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget)

    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!email || !password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await register(email, password)
    
    if (res && "detail" in res) {
      alert(res.detail);
      return;
    }
    
  }


  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <form
        onSubmit={onSubmit}
        className="card w-96 items-center justify-center"
      >
        <h1 className="text-2xl font-bold">Register</h1>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          required
        />
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm Password"
          required
        />
        <button type="submit" className="button">Create Account</button>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
