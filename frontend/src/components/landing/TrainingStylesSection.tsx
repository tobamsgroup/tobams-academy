import { ICONS } from "@/assets/icons";

const STYLES = [
  {
    title: "Online Face-to-Face Training",
    body: "Experience personalised learning with Tobams Group Academy through our immersive Face-to-Face training sessions. Engage directly with expert instructors, participate in hands-on activities, and collaborate with peers in a dynamic classroom environment. This approach fosters a deep understanding of the material and builds strong professional networks.",
  },
  {
    title: "Online Self Learning",
    body: "Enjoy the flexibility of Tobams Group Academy's Online training sessions, designed for learners who prefer a virtual learning environment. Access course materials anytime, anywhere, and learn at your own pace on our LMS platform. Our online training offers interactive modules, live webinars, and virtual support, ensuring a comprehensive and convenient educational journey.",
  },
];

export function TrainingStylesSection() {
  return (
    <section className="bg-[#DDD0DA] px-5 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 md:text-3xl">Explore Our Training Styles</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {STYLES.map((style) => (
            <div key={style.title} className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <ICONS.Thunder/>
                <h3 className="text-lg font-bold text-[#B82B91]">{style.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-500">{style.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
