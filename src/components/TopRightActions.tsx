import { Download, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  const handleClose = () => {
    // Best-effort: window.close() only works for windows opened by script.
    window.close();
    // Fallback: if it didn't close, at least reset to app root.
    window.location.assign(import.meta.env.BASE_URL);
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

