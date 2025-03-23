import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const UnAuthenticatedSidebar = () => {
  return (
    <div className="sticky top-25 mt-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Pull up, Mzansi vibes only!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground mb-4">
          <p className="mb-2">Login to vibe with with others</p>
          <SignInButton mode="modal">
            <Button className="w-full" variant={"outline"}>
              Login
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="w-full mt-2" variant={"default"}>
              Sign Up
            </Button>
          </SignUpButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnAuthenticatedSidebar;
