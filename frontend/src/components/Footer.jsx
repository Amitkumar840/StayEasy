const Footer = () => {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">StayEase</h3>
          <p className="text-slate-400 text-sm">
            Comfortable stays. Smart bookings. Personalized service.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-2">Contact</h4>
          <p className="text-slate-400 text-sm">123 Smart Avenue, Business District</p>
          <p className="text-slate-400 text-sm">+91-98765-43210</p>
          <p className="text-slate-400 text-sm">info@StayEase.example.com</p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-2">Quick links</h4>
          <div className="flex flex-col gap-1 text-sm">
            <a href="/rooms" className="text-slate-400 hover:text-white transition">Rooms</a>
            <a href="/login" className="text-slate-400 hover:text-white transition">Log in</a>
            <a href="/register" className="text-slate-400 hover:text-white transition">Register</a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 px-6 py-4 text-center text-slate-500 text-xs">
        {"\u00A9"} 2026 StayEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;