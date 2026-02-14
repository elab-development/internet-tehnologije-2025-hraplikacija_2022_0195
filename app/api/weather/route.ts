import { NextResponse } from "next/server";

export const revalidate = 600;

export async function GET() {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const city = process.env.WEATHER_CITY ?? "Belgrade,RS";

    if (!apiKey) {
        return NextResponse.json(
            { error: "OPENWEATHER_API_KEY nije podešen" },
            { status: 500 }
        );
    }

    const url = "https://api.openweathermap.org/data/2.5/weather" +
        `?q=${encodeURIComponent(city)}` +
        `&units=metric` +
        `&appid=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url, { next: { revalidate } });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        return NextResponse.json(
            { error: "Weather API error", details: text },
            { status: 502 }
        );
    }

    const data = await res.json();

    const payload = {
    city: data?.name ?? city,
    tempC: typeof data?.main?.temp === "number" ? Math.round(data.main.temp) : null,
    description: data?.weather?.[0]?.description ?? null,
    icon: data?.weather?.[0]?.icon ?? null,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(payload);
}