import { siteConfig } from "@/lib/content/site-config";
import { Button } from "@/components/ui/button";

/**
 * lucide-react no longer ships brand/logo icons, so social links are
 * rendered as short text badges rather than guessed-at generic icons.
 */
const socialLinks = [
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "YouTube", href: siteConfig.social.youtube },
];

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      {socialLinks.map((social) => (
        <Button
          key={social.label}
          variant="outline"
          size="sm"
          render={
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
            />
          }
        >
          {social.label}
        </Button>
      ))}
    </div>
  );
}
