import Navbar from "../../components/layout/Navbar"
import Hero from '../../../assets/images/Hero.jpg'
import Footer from "../../components/layout/Footer"
import ScrollReveal from "../../components/ui/ScrollRevealProps"
import PersonWorking from '../../../assets/images/PersonWorking.png'

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
