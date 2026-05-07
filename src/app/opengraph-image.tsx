import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Audrey Baliao · Stories, dreams, everyday moments";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fonts loaded from Google Fonts CSS endpoints. next/og will fetch and embed
// the actual font binaries at render time. No runtime dependency on these.
async function loadFont(url: string): Promise<ArrayBuffer> {
  const css = await fetch(url, {
    headers: {
      // Edge UA so Google returns woff2 (which next/og can decode).
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  }).then((r) => r.text());
  const match = css.match(/src: url\((https:[^)]+\.woff2)\)/);
  if (!match) throw new Error("Could not find font URL in CSS response.");
  const font = await fetch(match[1]).then((r) => r.arrayBuffer());
  return font;
}

export default async function Image() {
  const [merriweather, italianno] = await Promise.all([
    loadFont(
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@900&display=swap",
    ),
    loadFont(
      "https://fonts.googleapis.com/css2?family=Italianno&display=swap",
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #fbfaf5 0%, #dcf2e5 55%, #f3d77a 100%)",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: "Merriweather",
            fontSize: 160,
            fontWeight: 900,
            color: "#0a2418",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Audrey
        </div>
        <div
          style={{
            fontFamily: "Italianno",
            fontSize: 220,
            color: "#d8a83a",
            lineHeight: 1,
            marginTop: -10,
          }}
        >
          Dhey
        </div>

        {/* Boarding-pass strip: hairline + two dots */}
        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#0a2418", opacity: 0.35 }} />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#2c945f",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#d8a83a",
            }}
          />
          <div style={{ flex: 1, height: 1, background: "#0a2418", opacity: 0.35 }} />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Merriweather",
            fontSize: 16,
            color: "#0a2418",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          <span>Stories · Dreams · Travel</span>
          <span>Audrey Baliao</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Merriweather", data: merriweather, weight: 900, style: "normal" },
        { name: "Italianno", data: italianno, weight: 400, style: "normal" },
      ],
    },
  );
}
