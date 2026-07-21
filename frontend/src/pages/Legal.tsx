import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { SITE } from '@/data/site';

export function PrivacyPolicy() {
  return (
    <>
      <PageHero pageName="legal" eyebrow="Legal" title={<>Privacy <span className="text-gold-grad font-semibold not-italic">Policy</span></>} image="/images/project-bedroom.jpg" />
      <section className="py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-6 prose-lux">
          <Reveal>
            <p>Woodex Interior respects your privacy. This policy explains how information submitted through this website is handled.</p>
            <h2>Information We Collect</h2>
            <p>When you submit an inquiry, we collect the details you provide — name, phone number, email address, project information and any files you choose to attach.</p>
            <h2>How We Use It</h2>
            <ul>
              <li>To respond to your inquiry and prepare quotations</li>
              <li>To plan site reviews and consultations</li>
              <li>To communicate about your project</li>
            </ul>
            <h2>Sharing</h2>
            <p>We do not sell your information. Details are shared only with the Woodex team members handling your project.</p>
            <h2>Contact</h2>
            <p>Questions about this policy: <strong>{SITE.email}</strong> or {SITE.phone}.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export function Terms() {
  return (
    <>
      <PageHero pageName="legal" eyebrow="Legal" title={<>Terms of <span className="text-gold-grad font-semibold not-italic">Service</span></>} image="/images/project-bedroom.jpg" />
      <section className="py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-6 prose-lux">
          <Reveal>
            <p>These terms govern the use of the Woodex Interior website.</p>
            <h2>Website Content</h2>
            <p>Content on this website describes Woodex Interior's services in general terms. Project scopes, deliverables, timelines and pricing are confirmed individually in writing before work begins.</p>
            <h2>Inquiries</h2>
            <p>Submitting an inquiry does not create a contract. A project begins only after scope and terms are agreed by both parties.</p>
            <h2>Intellectual Property</h2>
            <p>Designs, drawings and visual material produced by Woodex Interior remain the property of Woodex Interior until transferred under a written agreement.</p>
            <h2>Contact</h2>
            <p>Questions about these terms: <strong>{SITE.email}</strong> or {SITE.phone}.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
