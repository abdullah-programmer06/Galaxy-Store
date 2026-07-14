import { Route } from '../types';
import { useAdminData } from '../hooks/useAdminData';

interface FooterProps {
  onNavigate: (route: Route) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { settings } = useAdminData();

  return (
    <footer className="relative w-full border-t border-white/5 pt-12 pb-8 bg-surface-container-lowest bg-gradient-to-b from-surface to-surface-container-lowest mt-auto z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1 mb-8 md:mb-0 flex flex-col gap-2">
          <h2 className="font-headline-md text-headline-md text-primary italic tracking-tighter">Galaxy Store</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">High-Octane Digital Delivery.</p>
          <p className="font-label-sm text-label-sm text-secondary mt-2">© 2024 Galaxy Store.</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3 font-label-sm text-label-sm">
          <span className="text-primary font-bold mb-2 uppercase tracking-wider">Navigation</span>
          <button onClick={() => onNavigate('games')} className="text-left text-on-surface-variant hover:text-secondary-fixed transition-colors hover:translate-y-[-2px] transition-transform w-max">Games</button>
          <button onClick={() => onNavigate('software')} className="text-left text-on-surface-variant hover:text-secondary-fixed transition-colors hover:translate-y-[-2px] transition-transform w-max">Gift Cards</button>
          <button onClick={() => onNavigate('software')} className="text-left text-on-surface-variant hover:text-secondary-fixed transition-colors hover:translate-y-[-2px] transition-transform w-max">Software</button>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3 font-label-sm text-label-sm">
          <span className="text-primary font-bold mb-2 uppercase tracking-wider">Legal</span>
          <a href="#" className="text-on-surface-variant hover:text-secondary-fixed transition-colors hover:translate-y-[-2px] transition-transform w-max">Terms of Service</a>
          <a href="#" className="text-on-surface-variant hover:text-secondary-fixed transition-colors hover:translate-y-[-2px] transition-transform w-max">Privacy Policy</a>
          <a href="#" className="text-on-surface-variant hover:text-secondary-fixed transition-colors hover:translate-y-[-2px] transition-transform w-max">Refund Policy</a>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-3 font-label-sm text-label-sm">
          <span className="text-primary font-bold mb-2 uppercase tracking-wider">Support</span>
          <button onClick={() => onNavigate('support')} className="text-left text-on-surface-variant hover:text-secondary-fixed transition-colors hover:translate-y-[-2px] transition-transform w-max">Contact Support</button>
          <button onClick={() => onNavigate('support')} className="text-left text-on-surface-variant hover:text-secondary-fixed transition-colors hover:translate-y-[-2px] transition-transform w-max">FAQ</button>
        </div>
      </div>
    </footer>
  );
}
