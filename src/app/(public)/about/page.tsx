import Image from "next/image";

export default function AboutPage() {
  const experiences = [
    {
      company: "MAS Holdings",
      role: "Design Engineer",
      period: "2023 - Present",
      description: "Leading 3D modeling and product design initiatives, bridging the gap between mechanical engineering and aesthetic product realization."
    },
    {
      company: "VirtualPensar",
      role: "3D Generalist",
      period: "2021 - 2023",
      description: "Created high-fidelity 3D assets, animations, and renders for client projects."
    },
    {
      company: "SEDS Sri Lanka",
      role: "Mechanical Design Lead",
      period: "2020 - 2022",
      description: "Led the mechanical design team for robotics and aerospace student projects."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 w-full">
      {/* Bio Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-40 items-center">
        <div className="lg:col-span-5">
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 glass rounded-2xl overflow-hidden shadow-xl">
            {/* Portrait Placeholder */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-muted">
              Portrait Photo
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-7">
          <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-6">/01 About Me</h2>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
            I&apos;m Bimsara, a multidisciplinary designer with a passion for turning ideas into visually impactful <span className="italic text-gray-400">physical and digital experiences</span>.
          </h1>
          <div className="space-y-6 text-xl text-muted leading-relaxed">
            <p>
              Since 2020, I have been deeply immersed in the world of 3D animation using Blender. My journey quickly evolved into precision engineering, earning my certification as a SOLIDWORKS Professional (CSWP).
            </p>
            <p>
              Every design I create is rooted in purpose. Whether it&apos;s a complex mechanical assembly, a sleek consumer product, or a custom 3D printed prototype, I bring empathy, strategy, and clean aesthetics to the table.
            </p>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="mb-40">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-4">/02 Experience</h2>
            <h3 className="text-4xl font-bold">The Expertise Behind Every Detail</h3>
          </div>
          
          <div className="md:w-2/3 flex flex-col">
            {experiences.map((exp, index) => (
              <div key={index} className="border-b border-gray-200 py-8 first:pt-0">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                  <div>
                    <h4 className="text-2xl font-bold">{exp.role}</h4>
                    <span className="text-lg text-muted font-medium">{exp.company}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2 sm:mt-0">{exp.period}</span>
                </div>
                <p className="text-muted text-lg max-w-xl">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capabilities Section */}
      <div>
        <h2 className="text-sm uppercase tracking-widest text-muted font-bold mb-12 text-center">/03 Core Stack</h2>
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-center tracking-tighter hover:text-gray-600 transition-colors cursor-default">SOLIDWORKS</h1>
          <h2 className="text-5xl md:text-7xl font-bold text-center tracking-tight text-gray-800 hover:text-gray-500 transition-colors cursor-default">BLENDER 3D</h2>
          <h3 className="text-4xl md:text-6xl font-semibold text-center tracking-tight text-gray-600 hover:text-gray-400 transition-colors cursor-default">PRODUCT DESIGN</h3>
          <h4 className="text-3xl md:text-5xl font-medium text-center tracking-tight text-gray-400 hover:text-gray-300 transition-colors cursor-default">3D PRINTING</h4>
        </div>
      </div>
    </div>
  );
}
