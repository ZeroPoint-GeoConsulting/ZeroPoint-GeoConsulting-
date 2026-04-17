import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-primary-foreground/80">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-gold flex items-center justify-center">
                <span className="font-display font-extrabold text-sm text-accent-foreground">ZP</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-primary-foreground text-lg">ZeroPoint</span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-gold">GeoConsulting</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/60">
              Engineering-grade surveying, geodetic control & field execution for infrastructure and renewable energy projects across South Africa.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-primary-foreground">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-gold transition-colors">Engineering Surveying</Link></li>
              <li><Link to="/services" className="hover:text-gold transition-colors">Geodetic & GNSS Control</Link></li>
              <li><Link to="/services" className="hover:text-gold transition-colors">Renewable Energy Surveying</Link></li>
              <li><Link to="/services" className="hover:text-gold transition-colors">UAV Mapping</Link></li>
              <li><Link to="/services" className="hover:text-gold transition-colors">GIS & Spatial Data</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-primary-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-gold transition-colors">Our Services</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-primary-foreground">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-gold mt-0.5 shrink-0" />
                <a href="mailto:info@zeropointgeo.co.za" className="hover:text-gold transition-colors">
                  info@zeropointgeo.co.za
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="text-gold mt-0.5 shrink-0" />
                <a href="tel:+27272316960" className="hover:text-gold transition-colors">
                  +27 27 231 6960
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span>Operating Nationally Across South Africa</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} ZeroPoint GeoConsulting (Pty) Ltd. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/40">
            Professional Indemnity Insured · Registered Professional Engineering Surveyor
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
