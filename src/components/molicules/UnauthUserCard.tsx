import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

function UnauthUserCard() {
  return (
    <Card className="text-center">
      <CardHeader className="gap-3">
        <CardTitle className="text-xl font-bold">Welcome Back!</CardTitle>
        <CardDescription>Login to access your profile and connect with others.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-flow-row gap-2">
        <SignInButton>
            <Button variant="outline">Login</Button>
        </SignInButton>
        <SignUpButton>
            <Button>Sign Up</Button>
        </SignUpButton>
      </CardContent>
    </Card>
  );
}

export default UnauthUserCard;
