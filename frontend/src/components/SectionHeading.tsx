import EditableElement from '@/components/builder/EditableElement';
import Reveal from './Reveal';

interface Props {
  pageKey?: string;
  sectionKey?: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}

export default function SectionHeading({ pageKey, sectionKey, eyebrow, title, subtitle, align = 'left', dark = true, className = '' }: Props) {
  const center = align === 'center';
  const prefix = pageKey ? `${pageKey}.${sectionKey || 'section'}` : 'anonymous';

  return (
    <div className={`${center ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
      <Reveal>
        <EditableElement path={`${prefix}.eyebrow`} contentText={eyebrow}>
          <span className={`eyebrow ${center ? 'eyebrow--center' : ''}`}>{eyebrow}</span>
        </EditableElement>
      </Reveal>
      <Reveal delay={1}>
        <EditableElement path={`${prefix}.title`}>
          <h2 className="section-title text-[clamp(2rem,4.4vw,3.6rem)] mt-5 mb-5">{title}</h2>
        </EditableElement>
      </Reveal>
      {subtitle && (
        <Reveal delay={2}>
          <EditableElement path={`${prefix}.subtitle`} contentText={subtitle}>
            <p className={`font-body font-light text-base md:text-lg leading-relaxed ${dark ? 'text-[#D4C5A9]' : 'text-[#4a423a]'} ${center ? 'mx-auto' : ''} max-w-2xl`}>
              {subtitle}
            </p>
          </EditableElement>
        </Reveal>
      )}
    </div>
  );
}
