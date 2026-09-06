import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      title: "3D Modeling and Rendering",
      description: "Transforming concepts into high-fidelity 3D visual assets. Using Blender and industry-standard render engines to create photorealistic product shots and animations that elevate your brand.",
      features: ["Photorealistic Product Renders", "3D Animation", "Lighting & Texturing", "Asset Creation"]
    },
    {
      title: "Product Design and Prototyping",
      description: "End-to-end design engineering. I bridge the gap between aesthetics and manufacturability, taking your initial sketch to a fully realized, functional prototype.",
      features: ["Concept Development", "Ergonomics Study", "Functional Prototyping", "DFM (Design for Manufacturing)"]
    },
    {
      title: "CAD Engineering",
      description: "Precision 3D modeling for manufacturing and engineering applications. As a Certified SOLIDWORKS Professional (CSWP), I ensure all models meet exact tolerances and industry standards.",
      features: ["Parametric Modeling", "Assemblies & Mates", "Technical Drafting", "Reverse Engineering"]
    },
    {
      title: "Custom 3D Printing",
      description: "Rapid prototyping and custom part fabrication using advanced FDM and resin 3D printing technologies. Ideal for testing fit, form, and function before mass production.",
      features: ["Rapid Prototyping", "Functional Parts", "Material Selection", "Post-Processing"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 w-full">
      
      {/* Header */}
      <div className="mb-24 text-center max-w-3xl mx-auto">
        <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">/01 Services</h2>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">What I Can Help With</h1>
        <p className="text-xl text-muted">
          Comprehensive design and engineering services tailored to bring your ideas into reality, from digital concepts to physical prototypes.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
        {services.map((service, idx) => (
          <div key={idx} className="card p-10 flex flex-col h-full">
            <h3 className="text-3xl font-bold mb-6">{service.title}</h3>
            <p className="text-muted text-lg mb-8 flex-grow">
              {service.description}
            </p>
            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm text-muted mb-4">Includes</h4>
              <ul className="space-y-3">
                {service.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 font-medium">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Why Work With Me */}
      <div className="bg-white card p-12 md:p-16 mb-32">
        <h2 className="text-4xl font-bold mb-12 text-center">Why Work With Me?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Technical Depth</h3>
            <p className="text-muted">CSWP certified with deep expertise in both mechanical tolerances and visual aesthetics.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Design Quality</h3>
            <p className="text-muted">An eye for clean, modern aesthetics that ensure your product not only works well but looks premium.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Reliable Communication</h3>
            <p className="text-muted">Clear, consistent updates throughout the project lifecycle to ensure we hit your goals.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-8">Ready to start your project?</h2>
        <Link href="/contact" className="inline-flex bg-accent text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors">
          Get in Touch
        </Link>
      </div>
      
    </div>
  );
}
