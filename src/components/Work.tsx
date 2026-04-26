import { FadeInView } from './FadeInView';

interface Project {
  name: string;
  description: string;
  year: string;
  link?: string;
}

const projects: Project[] = [
  {
    name: "E-Commerce API",
    description: "High-performance REST API with microservices architecture, handling 10K+ requests/sec.",
    year: "2025"
  },
  {
    name: "Analytics Dashboard",
    description: "Real-time analytics platform with interactive data visualizations and custom reports.",
    year: "2024"
  },
  {
    name: "AI Chat Platform",
    description: "Conversational AI interface with natural language processing and context awareness.",
    year: "2023"
  }
];

export const Work = () => {
  return (
    <section className="mb-24">
      <FadeInView>
        <h2 className="text-2xl font-semibold mb-8 text-primary">Projects</h2>
      </FadeInView>
      <div className="flex flex-col gap-6">
        {projects.map((project, index) => (
          <FadeInView key={project.name} delay={0.1 + index * 0.1}>
            <div className="group flex flex-col sm:flex-row sm:items-baseline justify-between p-4 -mx-4 rounded-lg transition-all duration-300 hover:bg-white/[0.03] cursor-default border border-transparent hover:border-white/[0.05]">
              <div className="flex flex-col gap-1 max-w-lg mb-2 sm:mb-0">
                <h3 className="text-primary font-medium group-hover:text-white transition-colors">
                  {project.name}
                </h3>
                <p className="text-secondary text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>
              <span className="text-secondary/60 text-sm whitespace-nowrap">
                {project.year}
              </span>
            </div>
          </FadeInView>
        ))}
      </div>
    </section>
  );
};
