import Navbar from "../../components/layout/Navbar"
import Hero from '../../../assets/images/Hero.jpg'
import Footer from "../../components/layout/Footer"
import ScrollReveal from "../../components/ui/ScrollRevealProps"
import PersonWorking from '../../../assets/images/PersonWorking.png'
import Professionals from '../../../assets/images/Professionals2.png'

const Home = () => {
  return (
    <div>
        <Navbar />

        {/* Hero section */}
        <main className="flex-grow flex flex-col">
           <section className="relative h-[600px] overflow-hidden">
            <img src={Hero} alt="Hiring-background" className="absolute inset-0 w-400 h-full object-cover"/>
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-widset drop-shadow-2xl">GET THE PERFECT DEVELOPERS</h1>
            </div>
           </section>

           {/* How it works */}

                <section className="py-20 px-12 bg-[#fdfaf5]">
                    <div className="max-w-7xl mx-auto">
                        <ScrollReveal>
                            <div className="flex justify-between items-end mb-12">
                                <h2 className="text-3xl font-black italic uppercase">How it Works</h2>
                                <button className="px-8 py-3 bg-amber-700 text-white rounded-full font-bold text-sm hover:bg-amber-800 transition">
                                    For Hiring
                                </button>
                            </div>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { title: "Create a job role", desc: "Shortlist candidate, personalize and hire effortlessly", icon: "⚙️" },
                                { title: "Create a Test for job Role", desc: "Select questions, test skills, and customize and send unique link", icon: "👥" },
                                { title: "Heir with AI and schedule interview", desc: "Digital recruit, analyze candidate and schedule expert interview", icon: "📊" },
                                { title: "Sent offer letter", desc: "Select offer letter model and edit as required and send email", icon: "⭐" }
                            ].map((item, idx) => (
                                <ScrollReveal key={idx} delay={idx * 0.1}>
                                    <div className="bg-white p-8 rounded-xl text-center space-y-4 shadow-sm hover:shadow-md transition h-full">
                                        <div className="text-3xl">{item.icon}</div>
                                        <h3 className="font-bold text-lg leading-tight uppercase">{item.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

{/* Access Professionals Section */}
<section className="py-24 px-6 bg-[#f8f8f8]">
  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

    {/* Image Side */}
    <ScrollReveal>
      <div className="relative flex justify-center">
        <div className="absolute top-0 left-10 w-28 h-28 border-4 border-amber-700"></div>

        <img
          src={Professionals}
          alt="Professional working"
          className="relative z-10 rounded-xl shadow-xl w-full max-w-md"
        />
      </div>
    </ScrollReveal>

    {/* Content Side */}
    <ScrollReveal delay={0.2}>
      <div>
        <h2 className="text-4xl font-black uppercase leading-tight mb-6">
          Access Millions Of Skilled Professionals On Demand
        </h2>

        <p className="text-gray-600 mb-8">
          Connect with skilled developers across multiple categories and
          get quality work done quickly and efficiently.
        </p>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
              📦
            </div>
            <div>
              <h4 className="font-bold text-lg">Create a Job Role</h4>
              <p className="text-gray-500 text-sm">
                Create your job posting by describing requirements,
                budget and timeline.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
              🧑‍💻
            </div>
            <div>
              <h4 className="font-bold text-lg">Create Test</h4>
              <p className="text-gray-500 text-sm">
                Evaluate candidate skills through customizable tests.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
              ✅
            </div>
            <div>
              <h4 className="font-bold text-lg">Hire Candidates</h4>
              <p className="text-gray-500 text-sm">
                Review results, schedule interviews and hire confidently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  </div>
</section>

{/* FAQ Section */}
<section className="py-24 px-6 bg-white">
  <div className="max-w-5xl mx-auto">

    <ScrollReveal>
      <h2 className="text-center text-4xl font-black uppercase mb-12">
        Frequently Asked Questions
      </h2>
    </ScrollReveal>

    <div className="space-y-6">

      {[
        {
          q: "How does HireX work?",
          a: "Create a job role, evaluate candidates through tests, conduct interviews and hire the best talent.",
        },
        {
          q: "Is posting a job free on HireX?",
          a: "Yes. Creating a job role is free. Additional premium features may require a subscription.",
        },
        {
          q: "Is my payment secure?",
          a: "Yes. We use trusted payment gateways and secure encryption standards.",
        },
        {
          q: "How do I choose the right candidate?",
          a: "Use skill assessments, AI insights, rankings and interview feedback to make informed decisions.",
        },
      ].map((faq, index) => (
        <ScrollReveal key={index} delay={index * 0.1}>
          <div className="bg-[#f8f6f3] rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-xl mb-3">{faq.q}</h3>
            <div className="h-px bg-gray-300 mb-3"></div>
            <p className="text-gray-600">{faq.a}</p>
          </div>
        </ScrollReveal>
      ))}

    </div>

    <div className="flex justify-end mt-8">
      <button className="bg-[#9A6605] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#845704] transition">
        Go to FAQ
      </button>
    </div>
  </div>
</section>

{/* Achievement Section */}
<section className="bg-[#1e2b3d] py-20 px-6 relative overflow-hidden">
  <div className="max-w-7xl mx-auto text-center">
    <ScrollReveal>
      <h2 className="text-4xl font-black uppercase text-white mb-2">
        Achievement We Have Earned
      </h2>
      <p className="text-gray-300 mb-12">
        At Freelancer, we believe that talent is borderless and opportunity should be too.
      </p>
    </ScrollReveal>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        {
          value: "16,720",
          label: "Active Companies",
          icon: "🏢",
        },
        {
          value: "1459",
          label: "Tests",
          icon: "💼",
        },
        {
          value: "567",
          label: "Challenges",
          icon: "</>",
        },
        {
          value: "16,720",
          label: "Successful Hires",
          icon: "📊",
        },
      ].map((item, index) => (
        <ScrollReveal key={index} delay={index * 0.1}>
          <div className="bg-white rounded-2xl p-8 shadow-lg border-b-4 border-amber-600">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="text-4xl font-bold">{item.value}</h3>
            <p className="text-gray-500 mt-2">{item.label}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  </div>
</section>


                {/* CTA */}
                <section className="py-32 bg-[#9A6605] relative overflow-hidden px-12">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="space-y-6 text-white text-center md:text-left">
                            <ScrollReveal>
                                <h2 className="text-5xl font-black uppercase italic leading-none">READY TO GET STARTED?</h2>
                                <p className="text-amber-100 max-w-lg text-lg italic mt-4">Join thousands of businesses crafting their dreams through application build performance driven settings.</p>
                                <button className="bg-white text-amber-700 px-10 py-3 rounded-full font-bold uppercase text-sm shadow-xl hover:bg-gray-100 transition mt-6">Join Now</button>
                            </ScrollReveal>
                        </div>
                        <div className="relative">
                            <ScrollReveal delay={0.3}>
                                <img
                                    src={PersonWorking}
                                    alt="Person working"
                                    className="w-80 h-80 object-cover rounded-full border-8 border-white/20"
                                />
                            </ScrollReveal>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                </section>
        </main>

        <Footer />
    </div>
  )
}

export default Home
