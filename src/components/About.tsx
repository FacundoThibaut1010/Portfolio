import { FadeInView } from './FadeInView';

export const About = () => {
  return (
    <section className="mb-24">
      <FadeInView>
        <h2 className="text-2xl font-semibold mb-8 text-primary">About</h2>
      </FadeInView>
      <FadeInView delay={0.1}>
        <div className="text-secondary leading-relaxed space-y-6">
          <p>
            I am a Software Engineer with a passion for building scalable, high-performance web applications. My development philosophy is rooted in a strong foundation of clean code, performance optimization, and continuous learning.
          </p>
          <p>
            Currently, I am focused on translating complex business requirements into robust technical solutions. Whether it's crafting intuitive frontend experiences or engineering resilient microservices, I strive for excellence in every layer of the stack.
          </p>
        </div>
      </FadeInView>
    </section>
  );
};
