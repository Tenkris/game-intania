import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackButton({ href }: { href: string }) {
    return (
        <Link href={href} className="btn btn-ghost">
            <ArrowLeft />
        </Link>
    );
}