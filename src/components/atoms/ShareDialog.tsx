"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

function ShareDialog({
    url,
    title = "Share this post",
    open,
    onClose,
} : {
    url : string,
    title?: string,
    open : boolean,
    onClose : () => void,
}) {

  const [isCopied, setIsCopied] = useState(false);

    function copyLink() {
        setIsCopied(true);
        navigator.clipboard.writeText(url);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Input
              id="share-url"
                value={url}
                readOnly
              className="col-span-3"
            />
            <Button onClick={copyLink}>
              {isCopied ? "Copied" : "Copy"}
            </Button>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;
