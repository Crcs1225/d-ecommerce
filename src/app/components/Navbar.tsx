import Link from "next/link";

export default function Navbar(){
    return (
        <nav className="flex justify-between items-center p-4 bg-white sticky top-0 z-50">
            <div className="text-xl font-bold">Daddy&apos;s Shop</div>
            <div className="flex gap-6">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
            </div>
        </nav>
    );
}