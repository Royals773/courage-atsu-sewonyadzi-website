import { Button } from "@/components/ui/button";

/**
 * lucide-react no longer ships brand/logo icons, so social links are
 * rendered as short text badges rather than guessed-at generic icons.
 */
export function SocialLinks({
  className,
  social,
}: {
  className?: string;
  social: { linkedin: string; instagram: string; youtube: string };
}) {
  const socialLinks = [
    { label: "LinkedIn", href: social.linkedin },
    { label: "Instagram", href: social.instagram },
    { label: "YouTube", href: social.youtube },
  ];

  return (
    <div className={className}>
      {socialLinks.map((item) => (
        <Button
          key={item.label}
          variant="outline"
          size="sm"
          render={
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
            />
          }
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
