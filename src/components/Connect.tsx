import { FadeInView } from './FadeInView';

const links = [
  { name: 'Email', url: 'mailto:contact@example.com' },
  { name: 'GitHub', url: 'https://github.com/FacundoThibaut' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/facundothibaut' },
  { name: 'X / Twitter', url: 'https://twitter.com/facundothibaut' }
];

export const Connect = () => {
  return (
    <section className="mb-24 pb-12">
      <FadeInView>
        <h2 className="text-2xl font-semibold mb-8 text-primary">Connect</h2>
      </FadeInView>
      <FadeInView delay={0.1}>
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-colors group w-fit text-lg"
            >
              <span className="underline decoration-secondary/30 underline-offset-4 group-hover:decoration-primary/60 transition-all">
                {link.name}
              </span>
            </a>
          ))}
        </div>
      </FadeInView>
      <FadeInView delay={0.3}>
        <div className="mt-20 text-sm text-secondary/50">
          © {new Date().getFullYear()} Facundo Thibaut. Minimalist portfolio.
        </div>
      </FadeInView>
    </section>
  );
};
