import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-accent text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Let&apos;s Stay Connected!</h2>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="glass-input-dark px-4 py-2 w-full focus:outline-none"
              />
              <button className="bg-white text-accent px-4 py-2 font-medium hover:bg-gray-200 transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-400 mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3 font-medium">
              <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
              <li><Link href="/about" className="hover:text-gray-300">About</Link></li>
              <li><Link href="/projects" className="hover:text-gray-300">Projects</Link></li>
              <li><Link href="/services" className="hover:text-gray-300">Services</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-400 mb-4 uppercase tracking-wider text-sm">Social Media</h3>
            <ul className="space-y-3 font-medium">
              <li><a href="https://linkedin.com/in/bimsara" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">LinkedIn</a></li>
              <li><a href="https://github.com/bimsara0608" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">GitHub</a></li>
              <li><a href="#" className="hover:text-gray-300">GrabCAD</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-400 mb-4 uppercase tracking-wider text-sm">Contact</h3>
            <p className="font-medium mb-2">hello@bimsara.com</p>
            <p className="text-gray-400 text-sm">Based in Colombo, Sri Lanka.<br />Available worldwide.</p>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Bimsara Gunawardana. All rights reserved.</p>
          <div className="font-bold text-xl tracking-tight text-white mt-4 md:mt-0">Bimsara</div>
        </div>
      </div>
    </footer>
  );
}
