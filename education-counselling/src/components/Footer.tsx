import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#081c10] text-[#c9decb] py-16 border-t border-[#123d29]">
      <div className="max-w-[1320px] mx-auto px-[6vw] grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <span className="text-white text-xl font-bold tracking-[0.16em] uppercase">
            PAKSARZAMEEN
          </span>
          <p className="text-[14px] leading-relaxed text-[#a2b5a4] max-w-[320px]">
            Working from Bahawalpur through volunteer programs, education support, health outreach, blood bank response, environmental action, and animal welfare.
          </p>
        </div>

        {/* Center Column */}
        <div className="flex flex-col gap-4">
          <strong className="text-white text-[12px] uppercase tracking-wider">
            Quick Links
          </strong>
          <div className="grid grid-cols-2 gap-2 text-[14px]">
            <a href="https://paksarzameenwfo.com/about" className="hover:text-white transition-colors">About Us</a>
            <a href="https://paksarzameenwfo.com/impact" className="hover:text-white transition-colors">Impact & GWR</a>
            <a href="https://paksarzameenwfo.com/healthcare" className="hover:text-white transition-colors">Healthcare</a>
            <a href="https://paksarzameenwfo.com/volunteer" className="hover:text-white transition-colors">Volunteer</a>
            <a href="https://paksarzameenwfo.com/news" className="hover:text-white transition-colors">News Updates</a>
            <a href="https://paksarzameenwfo.com/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <strong className="text-white text-[12px] uppercase tracking-wider">
            Counselling Portal
          </strong>
          <p className="text-[14px] leading-relaxed text-[#a2b5a4]">
            Providing student admissions, academic pathways, and entry scholarship guidance to top-tier universities.
          </p>
          <div className="text-[12px] text-[#819684] mt-2">
            © {new Date().getFullYear()} PakSarZameen WFO. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
