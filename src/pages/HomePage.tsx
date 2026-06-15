import { ArrowRight, Zap, Target, Trophy, BarChart3, CheckCircle2 } from 'lucide-react';

export default function HomePage({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/40 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-lime-200/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-700 font-medium">Climate Action Starts Here</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Understand Your Carbon
            <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Footprint in 60 Seconds
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Answer 5 simple questions. Get your personalized Carbon Score, a detailed breakdown,
            and an actionable plan to reduce your impact.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setPage('assessment')}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-green-600/25 hover:shadow-green-600/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Calculate My Impact
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setPage('dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-green-50 text-gray-700 font-semibold text-lg px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md transition-all duration-200"
            >
              View Demo Dashboard
            </button>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
            {[
              { num: '1.7B', label: 'Tons CO₂/year' },
              { num: '800kg', label: 'Indian average' },
              { num: '42%', label: 'Can be reduced' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.num}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-green-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Three simple steps to a greener you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-7 h-7" />,
                step: '01',
                title: 'Assess',
                description: 'Answer 5 quick questions about your daily habits — travel, electricity, food & shopping.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Zap className="w-7 h-7" />,
                step: '02',
                title: 'Understand',
                description: 'Get your Carbon Score, see what pollutes the most, and compare with your region.',
                color: 'from-emerald-500 to-teal-500'
              },
              {
                icon: <Target className="w-7 h-7" />,
                step: '03',
                title: 'Reduce',
                description: 'Follow personalized actions and complete Eco Challenges to earn points and make a difference.',
                color: 'from-teal-500 to-cyan-500'
              },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r " style={{}} />
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-100/50 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-green-600 mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Why GreenSteps?</h2>
            <p className="mt-4 text-lg text-gray-600">Not just another calculator — a real change starter</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: 'Personalized Insights',
                description: 'Not generic advice. Actions tailored to YOUR specific lifestyle and habits.'
              },
              {
                icon: <Trophy className="w-6 h-6" />,
                title: 'Eco Challenges',
                description: 'Gamified challenges that make sustainability fun and rewarding. Earn points for real actions.'
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Clear Breakdown',
                description: 'Know exactly what pollutes the most — transportation, electricity, food, or shopping.'
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Measurable Goals',
                description: 'Set targets, track progress, and see how much CO₂ you\'ve actually saved.'
              },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-10 sm:p-16 text-center overflow-hidden shadow-2xl shadow-green-600/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
              <p className="text-green-100 text-lg mb-8 max-w-lg mx-auto">
                Every ton of CO₂ saved matters. Start your journey towards a greener future today.
              </p>
              <button
                onClick={() => setPage('assessment')}
                className="inline-flex items-center gap-2 bg-white text-green-700 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-green-50 shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Now — It's Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2025 GreenSteps — Built with 🌿 for a better planet.
          </p>
        </div>
      </footer>
    </div>
  );
}
