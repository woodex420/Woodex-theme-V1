import { Link } from 'react-router';
import { Phone } from 'lucide-react';
import EditableElement from '@/components/builder/EditableElement';
import Reveal from './Reveal';
import { SITE } from '@/data/site';

interface Props {
  title?: React.ReactNode;
  text?: string;
  image?: string;
}

export default function CTASection({
  title = (
    <>
      Start Your <strong>Interior Project</strong>
    </>
  ),
  text = 'Planning a new interior, workplace or retail space? Speak with Woodex Interior about your requirements, preferred design direction and project scope.',
  image = '/images/project-kitchen.jpg',
}: Props) {
  return (
    <section className="relative py-24 lg:py-36 overflow-hidden">
      {/* bg */}
      <div className="absolute inset-0">
        <img src={image} alt="" className="w-full h-full object-cover img-lux" loading="lazy" />
        <div className="absolute inset-0 bg-[rgba(8,8,8,0.88)]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 60%)' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <Reveal>
          <EditableElement path="cta.eyebrow" contentText="Request a Consultation">
            <span className="eyebrow eyebrow--center">Request a Consultation</span>
          </EditableElement>
        </Reveal>
        <Reveal delay={1}>
          <EditableElement path="cta.title">
            <h2 className="section-title text-[clamp(2.2rem,5vw,4rem)] mt-6 mb-6">{title}</h2>
          </EditableElement>
        </Reveal>
        <Reveal delay={2}>
          <EditableElement path="cta.text" contentText={typeof text === 'string' ? text : undefined}>
            <p className="text-[#D4C5A9] font-light text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">{text}</p>
          </EditableElement>
        </Reveal>
        <Reveal delay={3}>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link to="/contact" className="btn-lux btn-gold">Request a Consultation</Link>
            <a href={SITE.whatsappText} target="_blank" rel="noopener noreferrer" className="btn-lux btn-outline">
              WhatsApp Us
            </a>
          </div>
        </Reveal>
        <Reveal delay={4}>
          <a href={`tel:${SITE.phoneIntl}`} className="inline-flex items-center gap-2 mt-8 text-[#C9A84C] font-semibold tracking-wider hover:text-[#E2C97E] transition-colors">
            <Phone size={16} /> {SITE.phone}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
