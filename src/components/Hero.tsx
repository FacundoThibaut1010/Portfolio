import { FadeInView } from './FadeInView';
import { MapPin } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="mb-24 mt-12">
      <FadeInView>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">
          Hello, I'm Facundo Thibaut
        </h1>
      </FadeInView>
      <FadeInView delay={0.1}>
        <p className="text-lg md:text-xl text-secondary max-w-2xl leading-relaxed mb-6">
          <span className="text-primary font-medium">Software Engineer</span> specializing in modern web applications, scalable architectures, and seamless user experiences.
        </p>
      </FadeInView>
      <FadeInView delay={0.2}>
        <div className="flex items-center text-secondary gap-2 hover:text-primary transition-colors w-fit">
          <MapPin size={18} />
          <span>Buenos Aires, Argentina</span>
        </div>
      </FadeInView>
    </section>
  );
};
