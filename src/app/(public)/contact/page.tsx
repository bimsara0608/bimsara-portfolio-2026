"use client";

import { useState } from "react";
import { submitContactForm } from "@/app/actions";
import { ArrowRight, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);

    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
      setMessage("Thanks for reaching out! I'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div>
          <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">/01 Contact</h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Ready to<br/>collaborate?</h1>
          <p className="text-xl text-muted mb-12 max-w-md">
            Whether you have a specific project in mind or just want to say hi, my inbox is always open.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-full border border-gray-200">
                <Mail className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Email</h3>
                <a href="mailto:hello@bimsara.com" className="text-muted hover:text-foreground transition-colors font-medium text-lg">
                  hello@bimsara.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-full border border-gray-200">
                <MapPin className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Location</h3>
                <p className="text-muted font-medium text-lg">
                  Colombo, Sri Lanka<br />
                  <span className="text-sm">Available worldwide</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-8 md:p-12 relative overflow-hidden bg-white">
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-accent transition-colors font-medium"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-accent transition-colors font-medium"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">Message</label>
              <textarea
                name="message"
                id="message"
                rows={5}
                required
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-accent transition-colors font-medium resize-none"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-accent text-white px-8 py-4 font-bold text-lg hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {status === "loading" ? "Sending..." : "Send Message"} 
              <ArrowRight size={20} />
            </button>

            {status === "success" && (
              <p className="text-green-600 font-medium text-center mt-4">{message}</p>
            )}
            {status === "error" && (
              <p className="text-red-600 font-medium text-center mt-4">{message}</p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
