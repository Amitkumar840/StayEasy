import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Footer from "../components/Footer.jsx";

const Contact = () => {
  return (
    <div className="bg-slate-900">
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-slate-300 text-lg mb-10">
          Have a question about a booking, a room, or anything else? Reach out any time -
          our team typically responds within a few hours.
        </p>

        <div className="space-y-5">
          <div className="bg-slate-800 rounded-2xl p-5 flex items-start gap-4">
            <MapPin className="text-blue-400 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-white font-semibold mb-1">Address</h3>
              <p className="text-slate-400 text-sm">123 Smart Avenue, Business District</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-5 flex items-start gap-4">
            <Phone className="text-blue-400 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-white font-semibold mb-1">Phone</h3>
              <a href="tel:+919876543210" className="text-slate-400 text-sm hover:text-white transition">
                +91-98765-43210
              </a>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-5 flex items-start gap-4">
            <Mail className="text-blue-400 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-white font-semibold mb-1">Email</h3>
              <a
                href="mailto:info@StayEase.example.com"
                className="text-slate-400 text-sm hover:text-white transition"
              >
                info@StayEase.example.com
              </a>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-5 flex items-start gap-4">
            <Clock className="text-blue-400 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-white font-semibold mb-1">Front desk hours</h3>
              <p className="text-slate-400 text-sm">Available 24/7 for guests</p>
            </div>
          </div>
        </div>

        <p className="text-slate-400 text-sm mt-8">
          For booking-specific questions, you can also chat with our StayEase AI
          assistant - look for the chat icon in the bottom-right corner once logged in.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
