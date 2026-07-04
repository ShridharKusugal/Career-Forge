import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children, containerClassName = "max-w-6xl mx-auto space-y-8" }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] text-slate-800 dark:text-slate-100 flex flex-col font-sans mesh-bg">
            {/* Top header */}
            <Navbar />

            {/* Main scrollable body containing sidebar, main content, and full-width footer */}
            <div className="flex-1 flex flex-col overflow-y-auto max-h-[calc(100vh-4rem)]">
                <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 p-8">
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
