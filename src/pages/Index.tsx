
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, TrendingUp, Users } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DonationStats from "@/components/DonationStats";
import TopDonors from "@/components/TopDonors";
import Navbar from "@/components/Navbar";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Navbar />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Support Happiness Club
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Help Nilgiri College's Happiness Club bring joy to students through
            activities, events, and community service.
          </p>
        </div>

        {/* Install PWA Prompt - PROMINENTLY DISPLAYED */}
        <div className="mb-8">
          <PWAInstallPrompt />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Heart className="h-12 w-12 text-donation-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Make a Difference</h2>
              <p className="text-muted-foreground mb-4">
                Your donation helps fund events, resources, and activities that
                bring happiness to students.
              </p>
              <Link to="/donate">
                <Button
                  size="lg"
                  className="w-full bg-donation-primary hover:bg-donation-primary/90 text-white"
                >
                  Donate Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <TrendingUp className="h-12 w-12 text-donation-secondary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Track Impact</h2>
              <p className="text-muted-foreground mb-4">
                See how your contributions are making a positive impact on the
                Happiness Club's initiatives.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-donation-secondary text-donation-secondary"
              >
                View Impact
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Users className="h-12 w-12 text-donation-tertiary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Join Community</h2>
              <p className="text-muted-foreground mb-4">
                Connect with other donors and see who's making the biggest
                difference through their generosity.
              </p>
              <Link to="/leaderboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-donation-tertiary text-donation-tertiary"
                >
                  View Leaderboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 mb-8">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="stats">Donation Stats</TabsTrigger>
              <TabsTrigger value="donors">Top Donors</TabsTrigger>
            </TabsList>
            <TabsContent value="stats">
              <DonationStats />
            </TabsContent>
            <TabsContent value="donors">
              <TopDonors />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
