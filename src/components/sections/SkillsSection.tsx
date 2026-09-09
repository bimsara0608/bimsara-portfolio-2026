'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Bot, Cpu, Activity, Award, ArrowUpRight } from 'lucide-react';

interface SkillItem {
  name: string;
  badge?: string;
}

interface SkillDomain {
  id: string;
  title: string;
  icon: typeof Box;
  description: string;
  skills: SkillItem[];
}

const SKILL_DOMAINS: SkillDomain[] = [
  {
    id: 'cad',
    title: '3D CAD & Mechanical Design',
    icon: Box,
    description:
      'Parametric SolidWorks modeling, rapid prototyping, DFM tolerances, and mechanism kinematics.',
    skills: [
      { name: 'SOLIDWORKS', badge: 'CSWP' },
      { name: 'AutoCAD' },
      { name: 'Autodesk Inventor' },
      { name: 'Blender (3D Visualization)' },
      { name: 'Kinematics & Mechanisms' },
      { name: 'DFM (Design for Manufacturing)' },
    ],
  },
  {
    id: 'robotics',
    title: 'Robotics & Industrial Automation',
    icon: Bot,
    description:
      'Industrial control architectures, automated motion pipelines, HMI interfaces, and autonomous UAV airframes.',
    skills: [
      { name: 'PLC Programming' },
      { name: 'Ladder Logic' },
      { name: 'HMI Development' },
      { name: 'Industrial Robotics' },
      { name: 'UAV & Autonomous Systems' },
    ],
  },
  {
    id: 'embedded',
    title: 'Embedded Systems & Hardware',
    icon: Cpu,
    description:
      'Microcontroller firmware, sensor telemetry, custom PCB layouts, and actuator integration.',
    skills: [
      { name: 'Arduino' },
      { name: 'ESP32 Microcontrollers' },
      { name: 'Raspberry Pi SBCs' },
      { name: 'PCB Design & Layout' },
      { name: 'Sensors Integration' },
      { name: 'Actuators & Motion Control' },
      { name: 'VHDL & FPGA' },
      { name: 'Embedded Systems' },
    ],
  },
  {
    id: 'simulation',
    title: 'Simulation & Scientific Computing',
    icon: Activity,
    description:
      'Structural FEA, aerodynamic CFD analysis, numerical modeling, and firmware scripting.',
    skills: [
      { name: 'ANSYS (FEA & CFD)' },
      { name: 'MATLAB & Simulink' },
      { name: 'Python (Robotics & Scripting)' },
      { name: 'C / C++ (Firmware)' },
      { name: 'JavaScript (Full-Stack & Web)' },
      { name: 'SQL (Data Architecture)' },
      { name: '3D Printing (Additive Prototyping)' },
    ],
  },
];

export function SkillsSection() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredDomains =
    activeTab === 'all' ? SKILL_DOMAINS : SKILL_DOMAINS.filter((d) => d.id === activeTab);

  const totalSkillsCount = SKILL_DOMAINS.reduce((acc, d) => acc + d.skills.length, 0);

  return (
    <section
      id="skills"
      className="w-full py-20 lg:py-28 px-6 lg:px-16 border-b border-white/[0.08] relative"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium tracking-widest uppercase text-zinc-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              Technical Competencies
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
              Engineering Arsenal &amp; Toolset.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-3 max-w-2xl leading-relaxed">
              {totalSkillsCount} specialized competencies categorized across parametric CAD
              modeling, industrial automation, embedded electronics, and finite element simulation.
            </p>
          </div>

          {/* Interactive Domain Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/20'
              }`}
            >
              All ({totalSkillsCount})
            </button>
            {SKILL_DOMAINS.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setActiveTab(domain.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === domain.id
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/20'
                }`}
              >
                {domain.title.split(' ')[0]} ({domain.skills.length})
              </button>
            ))}
          </div>
        </div>

        {/* 4 Bento Cards (Always maintaining balanced 4-column architecture) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SKILL_DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isSelected = activeTab === domain.id;
            const isDimmed = activeTab !== 'all' && !isSelected;

            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 shadow-lg ${
                  isSelected
                    ? 'border-white/30 bg-[#16161c] shadow-[0_0_30px_rgba(255,255,255,0.06)]'
                    : isDimmed
                      ? 'border-white/[0.04] bg-[#111114]/50 opacity-40 hover:opacity-100 hover:border-white/20'
                      : 'border-white/[0.08] bg-[#111114] hover:border-white/20 hover:bg-[#141418]'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-white/25 transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="text-[11px] font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-zinc-400">
                      {domain.skills.length} Skills
                    </span>
                  </div>

                  {/* Domain Title & Description */}
                  <h3 className="text-base font-semibold text-white tracking-tight mb-2">
                    {domain.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">{domain.description}</p>
                </div>

                {/* Skills Chips / Pills */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                  {domain.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-zinc-200 hover:text-white hover:border-white/20 hover:bg-white/[0.07] transition-all cursor-default"
                    >
                      <span>{skill.name}</span>
                      {skill.badge && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                          <Award size={9} />
                          {skill.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
