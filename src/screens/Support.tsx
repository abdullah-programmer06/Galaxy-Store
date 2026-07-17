import { useState } from "react";
import { motion } from "motion/react";
import {
  Truck,
  MessageSquare,
  Gamepad2,
  Mail,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAdminData } from "../hooks/useAdminData";

export function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { settings } = useAdminData();

  const faqs = [
    {
      q: "How long does digital delivery take?",
      a: "In most cases, digital keys and gift cards are delivered to your email instantly after payment confirmation. During peak times, it may take up to 15 minutes.",
    },
    {
      q: "What is your refund policy for game keys?",
      a: "Unused keys can be refunded within 14 days of purchase. Once a key has been viewed or activated, it is no longer eligible for a refund.",
    },
    {
      q: "My code isn't working, what should I do?",
      a: "Please ensure you are activating the code on the correct platform and region. If issues persist, contact our Live Chat support with your Order ID.",
    },
  ];

  return (
    <div className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">
      {/* Background glow */}

      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-container/20 rounded-none blur-[100px] -z-10" />
        <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-4 text-glow">
          How can we help you?
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Track your digital delivery, find answers in our FAQ, or connect with
          our support squad for immediate assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Track Order */}
        <div className="md:col-span-8 glass-panel tech-clip p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="text-primary-fixed" size={32} />
            <h2 className="font-headline-md text-on-surface">Track My Order</h2>
          </div>
          <p className="font-body-md text-on-surface-variant mb-6">
            Enter your Order ID to see the status of your digital delivery or
            gift card code.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-bold">
                #
              </span>
              <input
                type="text"
                placeholder="e.g. GLX-8932-XYZ"
                required
                className="w-full bg-black/40 border border-white/10 text-on-surface rounded-none py-4 pl-12 pr-4 font-body-md focus:outline-none focus:border-primary-fixed-dim focus:shadow-[0_0_15px_rgba(0,219,231,0.3)] transition-all placeholder:text-outline"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-br from-[#00f2ff] to-[#b600f8] text-[#00363a] font-label-sm rounded-none px-8 py-4 uppercase tracking-wider flex items-center justify-center gap-2 relative z-10 transition-all hover:opacity-90"
            >
              Track
            </button>
          </form>
        </div>

        {/* Contact Options */}
        <div className="md:col-span-4 flex flex-col gap-gutter">
          <motion.a
            href={settings?.contactInfo?.whatsapp || "#"}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="glass-panel tech-clip p-6 flex items-center gap-4 group transition-shadow duration-300 hover:shadow-[0_10px_30px_-10px_#00ffcc60] hover:border-primary/30"
          >
            <div className="w-12 h-12 rounded-none bg-primary-container/10 flex items-center justify-center group-hover:bg-primary-container/20 transition-colors text-primary-fixed">
              <MessageSquare />
            </div>
            <div>
              <h3 className="font-label-sm text-on-surface mb-1">
                WhatsApp Live Chat
              </h3>
              <p className="font-body-md text-on-surface-variant text-sm">
                24/7 Instant Support
              </p>
            </div>
          </motion.a>

          <motion.a
            href={settings?.contactInfo?.discord || "#"}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="glass-panel tech-clip p-6 flex items-center gap-4 group transition-shadow duration-300 hover:shadow-[0_10px_30px_-10px_#00ffcc60] hover:border-primary/30"
          >
            <div className="w-12 h-12 rounded-none bg-secondary-container/10 flex items-center justify-center group-hover:bg-secondary-container/20 transition-colors text-secondary">
              <Gamepad2 />
            </div>
            <div>
              <h3 className="font-label-sm text-on-surface mb-1">
                Community Discord
              </h3>
              <p className="font-body-md text-on-surface-variant text-sm">
                Join the discussion
              </p>
            </div>
          </motion.a>

          <motion.a
            href={
              settings?.contactInfo?.email
                ? settings.contactInfo.email.startsWith("mailto:")
                  ? settings.contactInfo.email
                  : `mailto:${settings.contactInfo.email}`
                : "#"
            }
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="glass-panel tech-clip p-6 flex items-center gap-4 group transition-shadow duration-300 hover:shadow-[0_10px_30px_-10px_#00ffcc60] hover:border-primary/30"
          >
            <div className="w-12 h-12 rounded-none bg-outline/10 flex items-center justify-center group-hover:bg-outline/20 transition-colors text-outline-variant">
              <Mail />
            </div>
            <div>
              <h3 className="font-label-sm text-on-surface mb-1">
                Email Support
              </h3>
              <p className="font-body-md text-on-surface-variant text-sm">
                Responses within 24h
              </p>
            </div>
          </motion.a>
        </div>

        {/* FAQ Section */}
        <div className="md:col-span-12 mt-8">
          <h2 className="font-headline-md text-primary mb-6 flex items-center gap-3">
            <HelpCircle /> Frequently Asked Questions
          </h2>
          <div className="glass-panel tech-clip overflow-hidden">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/5 last:border-0">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-white/5 transition-colors focus:outline-none text-on-surface"
                >
                  <span className="font-body-md font-semibold">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="text-primary" />
                  ) : (
                    <ChevronDown className="text-outline" />
                  )}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-6 pb-5 text-on-surface-variant font-body-md"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
