import { S } from "./style";

// Production stand-in for the design tool's <image-slot>: shows `src` when a screenshot has been
// provided; empty slots render as the bare tinted frame, exactly as the design shows them.
export default function ImageSlot({ id, placeholder, src }: { id: string; placeholder: string; src?: string }) {
  if (src) return <img id={id} src={src} alt={placeholder} style={S("display:block;width:100%;height:100%;object-fit:cover;")} />;
  return <div id={id} role="img" aria-label={placeholder} style={S("width:100%;height:100%;")} />;
}
