import type { Section } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { getSection } from "~/models/section.server";

type LoaderData = {
  section: Section;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const sectionId = params.sectionId;
  if (!sectionId) {
    return {};
  }
  const section = await getSection({ id: sectionId });
  return { section };
};

export default function ViewSectionPage() {
  const { section } = useLoaderData<LoaderData>();
  return (
    <div>
      <div>{section?.name}</div>
      <div>
        <pre>{JSON.stringify(section, null, 2)}</pre>
      </div>
    </div>
  );
}
