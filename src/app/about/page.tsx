import Link from 'next/link';
import { BarChart3, Layers, Paintbrush, ShieldCheck, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: "About Us - GENGRAPHS & GRAPHICS",
  description: "Learn more about GENGRAPHS AND GRAPHICS PVT. LTD., founded by Mohit Bhardwaj. Discover our services in Data Analytics, Business Intelligence, and UX/UI Design.",
};

export default function AboutPage() {
  return (
    <div className="relative w-full min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-indigo-500/30 flex flex-col justify-between">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-blue-600/5 blur-[110px] rounded-full pointer-events-none" />

      <main className="relative z-10 flex-grow pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Tag & Subtitle */}
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-500 mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Founded in 2026</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              GENGRAPHS AND GRAPHICS <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                PVT. LTD.
              </span>
            </h1>
            
            <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              We approach every engagement like a mini-strategy initiative—mapping KPIs to core business goals and delivering high-impact visual solutions that empower executives to act in minutes, not hours.
            </p>
          </div>

          {/* Intro Grid: Split content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-stretch">
            {/* Left Card: Brand spotlight */}
            <div className="lg:col-span-5 rounded-3xl bg-card border border-border p-8 backdrop-blur-xl flex flex-col justify-between shadow-[0_30px_70px_rgba(0,0,0,0.04)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                  The Strategic Standard
                </h2>
                <div className="h-1 w-12 bg-indigo-500 rounded-full mb-6" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Founded in <span className="text-foreground font-semibold">2026 by Mohit Bhardwaj</span>, Gengraphs &amp; Graphics stands at the intersection of complex quantitative analysis and high-fidelity product design. 
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We don&apos;t just build dashboards or graphics. We build cognitive workflows that allow decision-makers to visual-inspect operations and execute strategies rapidly.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Led By</div>
                  <div className="text-sm font-semibold text-foreground mt-1">Mohit Bhardwaj</div>
                </div>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition-all border border-indigo-500/20 group/btn"
                >
                  <span>Browse Visuals</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Card: Full text details with glass indicators */}
            <div className="lg:col-span-7 rounded-3xl bg-card/60 p-8 border border-border/80 shadow-sm backdrop-blur-md flex flex-col justify-center space-y-6">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                  01
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">Deep Analytic Framework</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Drawing on deep expertise in <span className="text-foreground font-medium">Power BI, Tableau, Advanced Excel, and Project Management</span>, we align your operational metrics with corporate objectives. We help isolate high-impact variables and design dashboards that turn noise into operational clarity.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold font-mono">
                  02
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">End-to-End Product &amp; Visual Design</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Alongside data, we offer comprehensive visual and product design services. This includes <span className="text-foreground font-medium">brand-aligned graphic design, presentation &amp; pitch-deck design, and UX/UI blueprints</span> for dashboards, internal tools, and business websites—ensuring your insights look as powerful as they perform.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pillars of Excellence (Grid) */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Our Pillars of Excellence</h2>
              <p className="text-sm text-muted-foreground">Core capabilities engineered for executive-level impact.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pillar 1 */}
              <div className="group rounded-2xl bg-card hover:bg-accent/40 p-6 border border-border hover:border-border/80 shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 transition-all duration-300 group-hover:scale-110">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Data Analytics</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Leveraging deep knowledge in data wrangling, model building, and query writing to build robust analytical systems.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="group rounded-2xl bg-card hover:bg-accent/40 p-6 border border-border hover:border-border/80 shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 transition-all duration-300 group-hover:scale-110">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Business Intelligence</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Advanced Power BI &amp; Tableau deployment. Interactive visuals mapped directly to core business KPIs.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="group rounded-2xl bg-card hover:bg-accent/40 p-6 border border-border hover:border-border/80 shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4 transition-all duration-300 group-hover:scale-110">
                  <Paintbrush className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Product Design</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Beautiful UX/UI dashboard frameworks, responsive mockups, landing pages, and interactive tool designs.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="group rounded-2xl bg-card hover:bg-accent/40 p-6 border border-border hover:border-border/80 shadow-sm transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 transition-all duration-300 group-hover:scale-110">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Project Management</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Rigorous oversight from scoping to testing, ensuring fast timelines, zero visual compromises, and premium execution.
                </p>
              </div>
            </div>
          </div>

          {/* Strategy Highlight */}
          <div className="relative rounded-3xl overflow-hidden border border-border bg-card p-8 sm:p-12 text-center shadow-md">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 relative z-10">
              Act on Insights in Minutes, Not Hours
            </h2>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 relative z-10">
              We eliminate complex spreadsheets and dense decks. By designing brand-aligned dashboards and presentation suites, we ensure your insights are digestible instantly at the executive board level.
            </p>
            <div className="relative z-10">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white transition-all shadow-[0_10px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_10px_25px_rgba(99,102,241,0.4)]"
              >
                <span>Browse Custom Visuals</span>
                <Trophy className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
