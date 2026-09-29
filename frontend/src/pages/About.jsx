import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Clock, Bot } from "lucide-react";
import Footer from "../components/Footer.jsx";

const About = () => {
  return (
    <div className="bg-slate-900">
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">About StayEase</h1>
        <p className="text-slate-300 text-lg mb-8">
          StayEase is a modern hotel focused on comfortable stays, smart bookings, and
          personalized service. We built our booking platform from the ground up to make
          finding and reserving the right room simple, transparent, and fast - no hidden
          fees, no guesswork on availability, and real support whenever you need it.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-800 rounded-2xl p-5">
            <Sparkles className="text-blue-400 mb-3" size={28} />
            <h3 className="text-white font-semibold mb-1">Easy booking</h3>
            <p className="text-slate-400 text-sm">
              Reserve a room in minutes, with a clear price and no hidden fees.
            </p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-5">
            <ShieldCheck className="text-blue-400 mb-3" size={28} />
            <h3 className="text-white font-semibold mb-1">Secure by design</h3>
            <p className="text-slate-400 text-sm">
              Your account and bookings are protected with industry-standard security.
            </p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-5">
            <Clock className="text-blue-400 mb-3" size={28} />
            <h3 className="text-white font-semibold mb-1">Real-time availability</h3>
            <p className="text-slate-400 text-sm">
              We check real bookings, not just a status flag - so you never book a room
              that is already taken.
            </p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-5">
            <Bot className="text-blue-400 mb-3" size={28} />
            <h3 className="text-white font-semibold mb-1">AI hotel assistant</h3>
            <p className="text-slate-400 text-sm">
              Ask questions or book a room right from chat, any time of day.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/rooms"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-6 py-3 transition inline-block"
          >
            Explore Rooms
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;