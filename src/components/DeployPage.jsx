"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function DeployPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDeploy = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        throw new Error("Deployment failed");
      }

      setSuccess(true);
      setRepoUrl("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12 px-4 flex justify-center items-center">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-gray-200 shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-900">
              Deploy Your Repository 
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg mt-2">
              Paste your GitHub repository URL below to deploy your application.
              We'll handle the build and deployment process automatically.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                id="repo-url"
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full px-4 py-6 text-base"
                disabled={loading}
              />
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="border-red-200 bg-red-50 text-red-700"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert
                variant="success"
                className="border-green-200 bg-green-50 text-green-700"
              >
                <AlertDescription>
                  Deployment initiated successfully! Your site will be live
                  shortly.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleDeploy}
              disabled={loading || !repoUrl}
              className="w-full py-6 text-base font-medium"
              variant={repoUrl ? "default" : "outline"}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Deploying...
                </>
              ) : (
                "Deploy Now"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
