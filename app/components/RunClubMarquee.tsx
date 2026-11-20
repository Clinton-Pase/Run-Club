export default function RunClubMarquee() {
  return (
    <div className="w-full min-w-0 overflow-hidden bg-[#000810] py-3">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            key={index}
            className="mx-8 text-sm font-bold uppercase tracking-[0.25em] text-orange-50"
          >
            ALX RUN CLUB — WE DO HARD THINGS
          </span>
        ))}
      </div>
    </div>
  );
}