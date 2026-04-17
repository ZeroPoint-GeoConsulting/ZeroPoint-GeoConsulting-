import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Upload, Send, Loader2, CheckCircle, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_URL = import.meta.env.VITE_CONTACT_API_URL;

const projectTypes = [
  "Engineering & Construction Surveying",
  "Geodetic & GNSS Control",
  "Renewable Energy / Solar Farm",
  "UAV Mapping & Photogrammetry",
  "GIS & Spatial Data",
  "Technical Consulting & QA/QC",
  "Tender Submission",
  "Other",
];

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  company: string;
  projectType: string;
  location: string;
  phone: string;
  email: string;
  message: string;
}

const initialFormData: FormData = {
  name: "",
  company: "",
  projectType: "",
  location: "",
  phone: "",
  email: "",
  message: "",
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const payload: Record<string, string> = { ...formData };

      if (file) {
        payload.fileName = file.name;
        payload.fileType = file.type;
        payload.fileBase64 = await fileToBase64(file);
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      setStatus("success");
      setFormData(initialFormData);
      setFile(null);
    } catch {
      setStatus("error");
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-navy pt-32 pb-20 px-4 md:px-8">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3 inline-block">Contact Us</span>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-primary-foreground mb-4">
              Contact ZeroPoint GeoConsulting
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              Ready to discuss your project requirements? Whether you require engineering control, site-based survey execution, or UAV mapping — our team is ready to assist.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-6">Get in Touch</h2>
                <div className="space-y-5">
                  <a href="mailto:info@zeropointgeo.co.za" className="flex items-start gap-3 group">
                    <div className="w-10 h-10 rounded-md bg-gold/10 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                      <p className="text-sm text-foreground group-hover:text-gold transition-colors">info@zeropointgeo.co.za</p>
                    </div>
                  </a>
                  <a href="tel:+27272316960" className="flex items-start gap-3 group">
                    <div className="w-10 h-10 rounded-md bg-gold/10 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                      <p className="text-sm text-foreground group-hover:text-gold transition-colors">+27 27 231 6960</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-md bg-gold/10 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Coverage</p>
                      <p className="text-sm text-foreground">Operating Nationally Across South Africa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              {status === "success" ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center space-y-4">
                  <CheckCircle size={48} className="text-green-500 mx-auto" />
                  <h3 className="font-display font-bold text-xl text-foreground">Enquiry Sent</h3>
                  <p className="text-sm text-muted-foreground">Thank you for reaching out. We'll be in touch shortly.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-sm text-gold hover:underline"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-5">
                  {status === "error" && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-md px-4 py-3 text-sm text-red-400">
                      <X size={16} />
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Project Type *</label>
                      <select
                        name="projectType"
                        required
                        value={formData.projectType}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors disabled:opacity-50"
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors resize-none disabled:opacity-50"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                      Attach Tender Documents (Optional)
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer bg-background border border-dashed border-border rounded-md px-4 py-4 hover:border-gold/50 transition-colors">
                      <Upload size={18} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {file?.name || "Click to upload files"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-accent-foreground font-semibold px-8 py-3 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {isSubmitting ? "Sending..." : "Send Enquiry"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
