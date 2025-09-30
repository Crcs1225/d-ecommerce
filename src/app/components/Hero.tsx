import { ReactNode } from "react";
export default function Hero({children} : {children : ReactNode}) {
    return (
        <section className="h-[-70ch] flex flex-col justify-center items-center text-center bg-gradient-to-r from-green-300 to-green-500 p-6 rounded-2xl shadow-lg">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Your Daddy&apos;s Marketplace
            </h1>
            <p className="text-lg text-white mb-6">
                Search, explore, and discover products with AI
            </p>
            {children}
        </section>
    );
}