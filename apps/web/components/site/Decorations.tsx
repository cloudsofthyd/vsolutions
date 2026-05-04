// Decorative cloud/sparkle layer copied from the homepage HTML.
// All purely decorative; lives behind content via CSS z-index.

const SPARKLES = [
  { cls: "rose large", top: "8%", left: "5%", dur: 3, delay: 0 },
  { cls: "sky", top: "15%", left: "18%", dur: 4, delay: 0.5 },
  { cls: "amber tiny", top: "6%", right: "25%", dur: 3.5, delay: 1 },
  { cls: "indigo", top: "22%", right: "8%", dur: 5, delay: 1.5 },
  { cls: "rose tiny", top: "35%", left: "8%", dur: 4, delay: 2 },
  { cls: "sky large", top: "45%", right: "15%", dur: 3.5, delay: 0.8 },
  { cls: "amber", top: "55%", left: "12%", dur: 4.5, delay: 1.2 },
  { cls: "cyan tiny", top: "65%", right: "30%", dur: 3, delay: 2.5 },
  { cls: "rose", top: "75%", left: "20%", dur: 4, delay: 0 },
  { cls: "indigo", top: "85%", right: "18%", dur: 5, delay: 1.8 },
  { cls: "sky tiny", top: "25%", left: "45%", dur: 3.5, delay: 2.2 },
  { cls: "amber large", top: "50%", right: "45%", dur: 4, delay: 1.5 },
  { cls: "cyan", top: "90%", left: "50%", dur: 3, delay: 0.5 },
  { cls: "rose", top: "30%", left: "65%", dur: 4, delay: 2 },
  { cls: "indigo tiny", top: "70%", left: "75%", dur: 3.5, delay: 0.8 },
];

export function Decorations() {
  return (
    <>
      <div className="cloud-bg" />
      <div className="cursor-glow" id="cursorGlow" />
      <div className="cloud c1" />
      <div className="cloud c2" />
      <div className="cloud c3" />
      <div className="cloud c4" />
      <div className="sparkle-layer">
        {SPARKLES.map((s, i) => {
          const style: React.CSSProperties & Record<string, string> = {
            top: s.top,
            "--dur": `${s.dur}s`,
            "--delay": `${s.delay}s`,
          };
          if (s.left) style.left = s.left;
          if (s.right) style.right = s.right;
          return <span key={i} className={`sparkle ${s.cls}`} style={style} />;
        })}
      </div>
    </>
  );
}
