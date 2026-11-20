import { Suspense } from "react";
import AuthForm from "../components/Authform";

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#031429]" />}>
            <AuthForm mode="signup" />
        </Suspense>
    );
}