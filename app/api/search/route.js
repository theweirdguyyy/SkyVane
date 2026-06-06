import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query.trim()
      )}&count=6&language=en&format=json`,
      {
        next: { revalidate: 3600 }, // Cache search results for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Geocoding service returned an error");
    }

    const data = await response.json();
    return NextResponse.json({ results: data.results || [] });
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json(
      { error: "Failed to fetch location suggestions" },
      { status: 500 }
    );
  }
}
