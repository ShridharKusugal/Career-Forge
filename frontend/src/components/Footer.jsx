import React from 'react';
import { 
    HelpCircle, Gift, Briefcase, Award
} from 'lucide-react';

const XIcon = ({ size = 14, className = "" }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const FacebookIcon = ({ size = 16, className = "" }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
);

const YoutubeIcon = ({ size = 16, className = "" }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
    </svg>
);

const InstagramIcon = ({ size = 16, className = "" }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
);

const Footer = () => {
    return (
        <footer className="bg-[#171717] text-white font-sans text-xs select-none w-full">
            {/* Top section with columns */}
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
                
                {/* Column 1: About */}
                <div className="space-y-2.5">
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-2.5">About</h3>
                    <ul className="space-y-1.5 font-bold">
                        <li><a href="#" className="hover:underline text-gray-200">Contact Us</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">About Us</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">Careers</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">CareerForge Stories</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">Press</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">Corporate Information</a></li>
                    </ul>
                </div>

                {/* Column 2: Group Platforms */}
                <div className="space-y-2.5">
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-2.5">Group Platforms</h3>
                    <ul className="space-y-1.5 font-bold">
                        <li><a href="#" className="hover:underline text-gray-200">PrepConsole</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">DevConnect</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">CodeArena</a></li>
                    </ul>
                </div>

                {/* Column 3: Help */}
                <div className="space-y-2.5">
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-2.5">Help</h3>
                    <ul className="space-y-1.5 font-bold">
                        <li><a href="#" className="hover:underline text-gray-200">Payments</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">Subscriptions</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">Refund Policy</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">FAQ</a></li>
                    </ul>
                </div>

                {/* Column 4: Policy */}
                <div className="space-y-2.5">
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-2.5">Consumer Policy</h3>
                    <ul className="space-y-1.5 font-bold">
                        <li><a href="#" className="hover:underline text-gray-200">Cancellation & Returns</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">Terms Of Use</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">Security</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">Privacy</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">Sitemap</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">Grievance Redressal</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">EPR Compliance</a></li>
                        <li><a href="#" className="hover:underline text-gray-200">AI Code Policy</a></li>
                    </ul>
                </div>

                {/* Vertical Divider (Desktop Only) */}
                <div className="hidden lg:block border-l border-gray-700/50 h-3/4 self-center justify-self-center w-px mx-2" />

                {/* Column 5: Mail Us & Socials */}
                <div className="space-y-4 lg:col-span-1">
                    <div>
                        <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-2.5">Mail Us:</h3>
                        <p className="text-gray-300 leading-relaxed font-semibold text-[11px]">
                            CareerForge Technologies Private Limited,<br />
                            Buildings Alyssa, Begonia &<br />
                            Clove Embassy Tech Village,<br />
                            Outer Ring Road, Devarabeesanahalli Village,<br />
                            Bengaluru, 560103,<br />
                            Karnataka, India
                        </p>
                    </div>

                    {/* Social links */}
                    <div className="space-y-2">
                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[11px] block">Socials:</span>
                        <div className="flex items-center gap-3 text-gray-300">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                                <FacebookIcon size={16} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                                <XIcon size={14} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                                <YoutubeIcon size={16} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                                <InstagramIcon size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Column 6: Registered Office */}
                <div className="space-y-2.5">
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-2.5">Registered Office Address:</h3>
                    <p className="text-gray-300 leading-relaxed font-semibold text-[11px]">
                        CareerForge Technologies Private Limited,<br />
                        Buildings Alyssa, Begonia &<br />
                        Clove Embassy Tech Village,<br />
                        Outer Ring Road, Devarabeesanahalli Village,<br />
                        Bengaluru, 560103,<br />
                        Karnataka, India<br />
                        CIN : U51109KA2012PTC066107<br />
                        Telephone: <a href="tel:044-45614700" className="text-blue-400 hover:underline">044-45614700</a> / <a href="tel:044-67415800" className="text-blue-400 hover:underline">044-67415800</a>
                    </p>
                </div>

            </div>

            {/* Bottom strip with yellow icon details & payments */}
            <div className="bg-[#101010] border-t border-gray-800/80 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    
                    {/* Yellow Link Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-6 font-bold text-gray-200">
                        <a href="#" className="flex items-center gap-1.5 hover:text-white transition-colors group">
                            <Briefcase size={14} className="text-amber-500 group-hover:scale-110 transition-transform" />
                            <span>Become a Partner</span>
                        </a>
                        <a href="#" className="flex items-center gap-1.5 hover:text-white transition-colors group">
                            <Award size={14} className="text-amber-500 group-hover:scale-110 transition-transform" />
                            <span>Advertise</span>
                        </a>
                        <a href="#" className="flex items-center gap-1.5 hover:text-white transition-colors group">
                            <Gift size={14} className="text-amber-500 group-hover:scale-110 transition-transform" />
                            <span>Scholarships</span>
                        </a>
                        <a href="#" className="flex items-center gap-1.5 hover:text-white transition-colors group">
                            <HelpCircle size={14} className="text-amber-500 group-hover:scale-110 transition-transform" />
                            <span>Help Center</span>
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="text-gray-300 font-semibold text-[11px]">
                        © 2007-2026 CareerForge.com
                    </div>

                    {/* Payment / Trusted Badges */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 tracking-wider">
                            Visa
                        </span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 tracking-wider">
                            Mastercard
                        </span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 tracking-wider">
                            RuPay
                        </span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 tracking-wider">
                            Net Banking
                        </span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 tracking-wider">
                            EMI Option
                        </span>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
