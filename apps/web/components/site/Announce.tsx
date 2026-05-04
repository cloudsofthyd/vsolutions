import { SITE } from "@/lib/site";

export function Announce() {
  return (
    <div className="announce">
      <div className="container">
        <div className="left">
          <span className="live">Welcome to VSolutions Digital</span>
        </div>
        <div className="right">
          <a href={SITE.phoneHref} className="phone">
            📞 Call Us {SITE.phone.replace(/-/g, " ")}
          </a>
          <a href={`mailto:${SITE.email}`}>✉ {SITE.email}</a>
        </div>
      </div>
    </div>
  );
}
