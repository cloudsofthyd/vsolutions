import { SITE } from "@/lib/site";
import { PhoneIcon } from "./PhoneIcon";

export function Announce() {
  return (
    <div className="announce">
      <div className="container">
        <div className="left">
          <span className="live">Welcome to VSolutions</span>
        </div>
        <div className="right">
          <a href={SITE.phoneHref} className="phone">
            <PhoneIcon size={13} /> Call Us {SITE.phone}
          </a>
          <a href={`mailto:${SITE.email}`}>✉ {SITE.email}</a>
        </div>
      </div>
    </div>
  );
}
