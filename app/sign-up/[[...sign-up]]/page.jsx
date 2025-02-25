import { GraduationCap } from "lucide-react";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap />
            </div>
            <Link href={"/"}>Studyfy</Link>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full">
            <SignUp />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://plus.unsplash.com/premium_vector-1682303296126-45b410e1babf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3R1ZHlpbmd8ZW58MHx8MHx8fDA%3D"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
