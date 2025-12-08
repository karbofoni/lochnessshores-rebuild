import Link from "next/link";
import { Tent, Sparkles } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 items-center mx-auto px-4 justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Tent className="h-6 w-6 text-brand-green" />
                    <span className="font-bold text-lg hidden md:inline-block">Loch Ness Camping</span>
                    <span className="font-bold text-lg md:hidden">Loch Ness</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <Link href="/campsites" className="transition-colors hover:text-brand-green">Campsites</Link>
                    <Link href="/trails" className="transition-colors hover:text-brand-green">Trails</Link>
                    <Link href="/extras" className="transition-colors hover:text-brand-green">Extras</Link>
                    <Link href="/guides" className="transition-colors hover:text-brand-green">Guides</Link>
                    <Link href="/plan" className="flex items-center gap-1 transition-colors hover:text-brand-green">
                        <Sparkles className="h-4 w-4" />
                        Plan Trip
                    </Link>
                </nav>
                <div className="flex items-center space-x-2 md:hidden">
                    <Link href="/campsites" className="p-2"><Tent className="h-5 w-5" /></Link>
                    <Link href="/plan" className="p-2"><Sparkles className="h-5 w-5" /></Link>
                </div>
            </div>
        </header>
    );
}
