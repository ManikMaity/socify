import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShieldAlertIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-150px)]">
    <Card className="text-center w-fit">
        <CardHeader className="flex flex-col justify-center items-center">
            <ShieldAlertIcon className="w-11 h-11"/>
            <h2 className="text-xl font-bold">Page Not Found</h2>
            <p className="text-muted-foreground text-sm">The page you are looking for does not exist</p>
        </CardHeader>
      <CardContent>
        <Link href="/">
          <Button variant={"outline"}>Go to Home</Button>
        </Link>
      </CardContent>
    </Card>
    </div>
  );
}
