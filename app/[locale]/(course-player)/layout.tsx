// app/[locale]/(course-player)/layout.tsx

// This is the dedicated layout for the course player view.
// It does not include the main site's header or footer,
// allowing the lesson page to have its own "full-screen" layout.
export default function CoursePlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
