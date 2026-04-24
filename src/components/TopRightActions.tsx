import { Download, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

function download(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function TopRightActions() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    // In the prototype shell, React is mounted in an <aside>. Closing should NOT hard-navigate,
    // otherwise the main page reloads and the user loses their scroll position.
    const layout = document.getElementById("prototype-layout");
    const aside = document.getElementById("prototype-aside");
    const didClosePrototypeAside = Boolean(layout && aside);

    if (layout) layout.classList.remove("prototype-sidebar-open");
    if (aside) aside.classList.remove("prototype-aside-open");
    document.body.classList.remove("h360-aside-open");

    // If we're not inside the prototype shell (or if the user is on a facility route),
    // fall back to soft navigation to the app root (no full reload).
    if (!didClosePrototypeAside || location.pathname.startsWith("/facility/")) {
      navigate("/", { replace: true });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title || "Facility Review";

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or share failed; fall through to copy.
      }
    }

    const copied = await copyToClipboard(url);
    if (copied) toast("Link copied", { description: "Paste it into WhatsApp, email, or notes." });
    else toast("Couldn't share automatically", { description: "Copy the URL from the address bar." });
  };

  const handleDownload = () => {
    const url = `${import.meta.env.BASE_URL}data.tsv`;
    download(url, "data.tsv");
    toast("Downloading data.tsv");
  };

  return (
    <div className="fixed right-1.5 top-1.5 z-50 flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Download data"
        onClick={handleDownload}
        className="h-8 w-8 hover:bg-surface-sunken"
      >
        <Download className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Share"
        onClick={handleShare}
        className="h-8 w-8 hover:bg-surface-sunken"
      >
        <Share2 className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Close"
        onClick={handleClose}
        className="h-8 w-8 hover:bg-surface-sunken"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

