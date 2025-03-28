import { ArrowLeft, RotateCw } from "lucide-react";
import Link from "next/link";
import { MouseEventHandler } from "react";

export default function ReloadButton({ onClick }: { onClick: MouseEventHandler<HTMLButtonElement> }) {
    return (
        <button onClick={onClick} className="btn btn-ghost">
            <RotateCw />
        </button>
    );
}