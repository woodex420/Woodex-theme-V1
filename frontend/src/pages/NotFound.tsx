import { Link } from 'react-router';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <span className="bg-watermark">404</span>
      <div className="relative z-10 text-center px-6">
        <span className="eyebrow eyebrow--center">Page Not Found</span>
        <h1 className="font-display font-light text-white text-[clamp(3rem,8vw,6rem)] mt-6 mb-6">
          Lost in <span className="text-gold-grad font-semibold not-italic">Space?</span>
        </h1>
        <p className="text-[#8A8073] font-light max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist — but great interiors do. Let's get you back.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-lux btn-gold text-[0.68rem]">Back to Home</Link>
          <Link to="/services" className="btn-lux btn-outline text-[0.68rem]">View Services</Link>
        </div>
      </div>
    </section>
  );
}
