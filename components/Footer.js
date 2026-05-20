import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/50 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="8" fill="#c9a84c"/>
                <path d="M8 26V12l10-4 10 4v14" stroke="#1e3a5f" strokeWidth="1.5" fill="none"/>
                <rect x="14" y="18" width="8" height="8" rx="1" fill="#1e3a5f" opacity="0.9"/>
                <path d="M10 14h16M10 18h4M22 18h4" stroke="#1e3a5f" strokeWidth="1.2" opacity="0.6"/>
              </svg>
              <div>
                <div className="font-display text-lg font-bold text-white leading-none">
                  StudyNook
                </div>
                <div className="text-xs text-gold tracking-widest mt-0.5">
                  UNIVERSITY LIBRARY
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Browse and book quiet, private study rooms in your university library. List your own room and earn.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { title: "Facebook", d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                { title: "X", d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { title: "LinkedIn", d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" },
              ].map(({ title, d }) => (
                <a key={title} href="#" title={title}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center
                    text-white/50 transition-all hover:border-gold hover:text-gold">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d={d}/>
                  </svg>
                </a>
              ))}
              <a href="#" title="Instagram"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center
                  text-white/50 transition-all hover:border-gold hover:text-gold">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <div className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "All Rooms", href: "/rooms" },
                { label: "Add Room", href: "/add-room" },
                { label: "My Bookings", href: "/my-bookings" },
                { label: "My Profile", href: "/profile" }, // ← added
              ].map(({ label, href }) => (
                <Link key={label} href={href}
                  className="block text-sm text-white/50 hover:text-gold transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
              Contact
            </h4>
            <div className="space-y-2.5 text-sm">
              <p>📧 studynook@university.edu</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 Central Library, Campus</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © 2026 StudyNook University Library. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a key={item} href="#"
                className="text-xs text-white/35 hover:text-gold transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}