import Reveal from './Reveal';
import EditableElement from '@/components/builder/EditableElement';

interface Props {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  image: string;
  watermark?: string;
  pageName?: string;
}

export default function PageHero({ eyebrow, title, subtitle, image, watermark, pageName = 'home' }: Props) {
  return (
    <section className="relative min-h-[62vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img src={image} alt="" className="w-full h-full object-cover img-lux" />
        <div className="absolute inset-0" style={{ background: 'var(--grad-hero)' }} />
        <div className="absolute inset-0 bg-[rgba(10,10,10,0.35)]" />
      </div>
      {watermark && <span className="bg-watermark bottom-4 right-0 z-[1]">{watermark}</span>}

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 pb-16 pt-40">
        <Reveal>
          <EditableElement path={`${pageName}.hero.eyebrow`} contentText={eyebrow}>
            <span className="eyebrow">{eyebrow}</span>
          </EditableElement>
        </Reveal>
        <Reveal delay={1}>
          <EditableElement path={`${pageName}.hero.title`}>
            <h1 className="font-display font-light text-white text-[clamp(2.4rem,5.5vw,4.8rem)] leading-[1.06] mt-6 max-w-4xl">
              {title}
            </h1>
          </EditableElement>
        </Reveal>
        {subtitle && (
          <Reveal delay={2}>
            <EditableElement path={`${pageName}.hero.subtitle`} contentText={subtitle}>
              <p className="text-[#D4C5A9] font-light text-base md:text-lg leading-relaxed mt-6 max-w-2xl">{subtitle}</p>
            </EditableElement>
          </Reveal>
        )}
      </div>

      {/* bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px z-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />
    </section>
  );
}
