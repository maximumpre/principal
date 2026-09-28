import { permanentRedirect } from "next/navigation";

type LegacyLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LegacyLoginRedirect({ searchParams }: LegacyLoginPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        query.append(key, item);
      }
    } else {
      query.set(key, value);
    }
  }

  const suffix = query.toString();
  permanentRedirect(suffix ? `/?${suffix}` : "/");
}
