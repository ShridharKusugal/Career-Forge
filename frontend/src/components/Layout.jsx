import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children, containerClassName = "max-w-6xl mx-auto space-y-6 sm:space-y-8" }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] text-slate-800 dark:text-slate-100 flex flex-col font-sans mesh-bg overflow-x-hidden">
            {/* Top header */}
            <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

            {/* Main scrollable body containing sidebar, main content, and full-width footer */}
            <div className="flex-1 flex flex-col overflow-y-auto max-h-[calc(100vh-4rem)]">
                <div className="flex flex-1 relative w-full min-w-0">
                    <Sidebar 
                        mobileMenuOpen={mobileMenuOpen} 
                        onClose={() => setMobileMenuOpen(false)} 
                    />
                    <main className="flex-1 p-3 sm:p-6 md:p-8 w-full min-w-0 max-w-full overflow-x-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className={containerClassName}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
                {/* Footer spans the entire width */}
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
