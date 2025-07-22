import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Button>Get Started</Button>
      <Card className="mt-4 w-80">
        <CardHeader>
          <CardTitle>Welcome to MyMo</CardTitle>
          <CardDescription>Your personal AI habit tracker.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Track your habits and improve your life with AI assistance.</p>
        </CardContent>
        <CardFooter>
          <Button>Learn More</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
