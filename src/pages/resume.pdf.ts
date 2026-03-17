import type { APIRoute } from "astro";
import { getResumeUrl } from "@/lib/sanity";
import fallbackResumeAssetUrl from "../assets/resume-fallback.pdf?url";

export const prerender = false;

const CACHE_CONTROL =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";
const CONTENT_TYPE = "application/pdf";
const CONTENT_DISPOSITION = 'inline; filename="resume.pdf"';
function createHeaders() {
  return new Headers({
    "Content-Type": CONTENT_TYPE,
    "Content-Disposition": CONTENT_DISPOSITION,
    "Cache-Control": CACHE_CONTROL,
  });
}

async function getLocalResume(request: Request): Promise<Response | null> {
  try {
    const fallbackUrl = new URL(fallbackResumeAssetUrl, request.url);
    const fallbackResponse = await fetch(fallbackUrl);
    if (!fallbackResponse.ok) {
      return null;
    }

    return new Response(fallbackResponse.body, {
      status: 200,
      headers: createHeaders(),
    });
  } catch {
    return null;
  }
}

async function getSanityResume(): Promise<Response | null> {
  try {
    const resumeUrl = await getResumeUrl();
    if (!resumeUrl) {
      return null;
    }

    const sanityResponse = await fetch(resumeUrl);
    if (!sanityResponse.ok) {
      return null;
    }

    const contentType = sanityResponse.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes(CONTENT_TYPE)) {
      return null;
    }

    return new Response(sanityResponse.body, {
      status: 200,
      headers: createHeaders(),
    });
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ request }) => {
  const sanityResume = await getSanityResume();
  if (sanityResume) {
    return sanityResume;
  }

  const localResume = await getLocalResume(request);
  if (localResume) {
    return localResume;
  }

  return new Response("Resume is unavailable.", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};
