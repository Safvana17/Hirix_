import Navbar from "../../components/layout/Navbar"
import Hero from '../../../assets/images/Hero.jpg'
import Footer from "../../components/layout/Footer"
import ScrollReveal from "../../components/ui/ScrollRevealProps"
import PersonWorking from '../../../assets/images/PersonWorking.png'
import Professionals from '../../../assets/images/Professionals2.png'
import { BrainCircuit, Building2, ClipboardList, Code2, Cpu, MailCheck, Target, Users } from "lucide-react"

const Home = () => {
  return (
    <div>
        <Navbar />

        <main className="flex-grow flex flex-col">

          <section className="relative h-[600px] overflow-hidden">
            <img src={Hero} alt="Hiring-background" className="absolute inset-0 w-400 h-full object-cover"/>
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">
              <h1 className="text-3xl md:text-6xl font-black text-white mb-6 uppercase tracking-widest drop-shadow-2xl">
                AI-POWERED HIRING & SKILL ASSESSMENT PLATFORM
              </h1>
              <p className="text-white/80 max-w-2xl">
                Create job roles, evaluate candidates with AI-driven tests, rank talent automatically, and hire faster. 
                Candidates can practice, code, and improve with AI feedback.
              </p>
            </div>
          </section>

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
                  { title: "Create a job role", desc: "Companies define roles, skills required, and evaluation criteria.", icon: Building2  },
                  { title: "Build & Assign Tests", desc: "Create coding / MCQ tests and assign them to candidates.", icon: ClipboardList },
                  { title: "AI Evaluation & Ranking", desc: "AI evaluates answers, scores candidates, and ranks them automatically.", icon: BrainCircuit },
                  { title: "Shortlist & Hire", desc: "Review ranked candidates, conduct interviews, and send offer letters.", icon: MailCheck }
                ].map((item, idx) => (
                  <ScrollReveal key={idx} delay={idx * 0.1}>
                    <div className="bg-white p-8 rounded-xl text-center space-y-4 shadow-sm hover:shadow-md transition h-full">
                      <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-amber-50 text-amber-700 mb-4">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg leading-tight uppercase">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </ScrollReveal>
                  ))}
              </div>
            </div>
          </section>

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
                    Hire Smarter. Assess Better. Hire Faster.
                  </h2>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                        <Cpu />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">AI Skill Evaluation</h4>
                        <p>Automatically score candidates using AI based on answers and coding performance.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                        <Code2 />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Real-Time Coding Tests</h4>
                        <p>Built-in coding editor for live technical assessments.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                        <Target />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Smart Hiring Decisions</h4>
                        <p>Ranked candidate insights help companies shortlist efficiently.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

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
                    q: "What is HiriX?",
                    a: "HiriX is an AI-powered hiring and assessment platform for companies and candidates."
                  },
                  {
                    q: "How does candidate evaluation work?",
                    a: "Candidates are assessed using coding tests, MCQs, and AI evaluation that ranks their performance."
                  },
                  {
                    q: "Can candidates practice before applying?",
                    a: "Yes. Candidates can practice coding problems and get AI feedback before applying."
                  },
                  {
                    q: "Does HiriX support interviews?",
                    a: "Yes. Companies can schedule interviews and manage hiring workflows in one platform."
                  }
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
                  At HiriX, we streamline hiring with AI-driven assessment, ranking, and interview automation.
                </p>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    value: "16,720",
                    label: "Active Companies",
                    icon: Building2,
                  },
                  {
                    value: "1459",
                    label: "Tests Created",
                    icon: ClipboardList,
                  },
                  {
                    value: "567",
                    label: "AI Evaluations",
                    icon: BrainCircuit,
                  },
                  {
                    value: "16,720",
                    label: "Successful Hires",
                    icon: Users,
                  },
                ].map((item, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-b-4 border-amber-600">
                      <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-amber-50 text-amber-700 mb-4">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-4xl font-bold">{item.value}</h3>
                      <p className="text-gray-500 mt-2">{item.label}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          <section className="py-32 bg-[#9A6605] relative overflow-hidden px-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="space-y-6 text-white text-center md:text-left">
                <ScrollReveal>
                  <h2 className="text-5xl font-black uppercase italic leading-none">START SMARTER HIRING WITH AI</h2>
                  <p className="text-amber-100 max-w-lg text-lg italic mt-4">Build job roles, evaluate candidates instantly, and make data-driven hiring decisions with Hirix.</p>
                  <button className="bg-white text-amber-700 px-10 py-3 rounded-full font-bold uppercase text-sm shadow-xl hover:bg-gray-100 transition mt-6">Get Started</button>
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
                    
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          </section>
        </main>
      <Footer />
    </div>
  )
}

export default Home
