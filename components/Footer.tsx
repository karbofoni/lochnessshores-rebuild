import Link from "next/link";
import { UnofficialDisclaimer } from "./UnofficialDisclaimer";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Loch Ness Camping & Trails</h3>
                        <p className="text-sm leading-relaxed">
                            Your independent guide to exploring the wild side of Loch Ness.
                            Find campsites, hiking trails, and local secrets.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Explore</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/campsites" className="hover:text-white">All Campsites</Link></li>
                            <li><Link href="/trails" className="hover:text-white">Hiking & Trails</Link></li>
                            <li><Link href="/extras" className="hover:text-white">Activities & Extras</Link></li>
                            <li><Link href="/faq" className="hover:text-white">Camping FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white">Terms of Use</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 mt-8">
                    <UnofficialDisclaimer />
                    <p className="text-center text-xs text-slate-500 mt-4">
                        &copy; {new Date().getFullYear()} Loch Ness Camping & Trails Guide. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
