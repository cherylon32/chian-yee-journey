import { useMemo } from "react";
import { EMCEE_H, EMCEE_W, emceeMarkup, type EmceeOptions } from "../character/emcee";

interface Props extends EmceeOptions {
  /** Rendered width in px; height follows the 2:3 sprite ratio. */
  width?: number;
  className?: string;
  /** Pass "" for purely decorative use. */
  label?: string;
}

/** The chibi Cheryl character as inline SVG. */
export function Emcee({ width = 64, className, label = "Chibi illustration of Chian Yee", ...opts }: Props) {
  const markup = useMemo(() => emceeMarkup({ animated: true, ...opts }), [opts.dir, opts.pose, opts.frame]);
  return (
    <svg
      viewBox={`0 0 ${EMCEE_W} ${EMCEE_H}`}
      width={width}
      height={(width * EMCEE_H) / EMCEE_W}
      className={className}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
