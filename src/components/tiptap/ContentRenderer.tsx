interface ContentRendererProps {
  content?: string | null;
  className?: string;
}

export function ContentRenderer({
  content = "",
  className = "",
}: ContentRendererProps) {
  return (
    <div
      className={`
        [&>h1]:mb-6 [&>h1]:mt-10
        [&>h2]:mb-4 [&>h2]:mt-8
        [&>p]:mb-4 [&>p]:leading-relaxed
        [&>pre]:bg-zinc-100 [&>pre]:text-zinc-900 [&>pre]:dark:bg-zinc-900 [&>pre]:dark:text-zinc-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-6
        [&>code]:bg-zinc-200 [&>code]:text-zinc-900 [&>code]:dark:bg-zinc-800 [&>code]:dark:text-zinc-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded
        [&>pre>code]:bg-transparent [&>pre>code]:text-inherit [&>pre>code]:dark:bg-transparent [&>pre>code]:p-0
        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: content || "" }}
    />
  );
}
