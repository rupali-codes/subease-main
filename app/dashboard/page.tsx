"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "../components/mode-toggle";
import SocialLinks from "../components/SocialLinks";
import { UserButton } from "@clerk/nextjs";
import AddSubscriptionButton from "../components/AddSubscriptionButton";
import axios from "axios";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const subscriptions = [
  {
    name: "Netflix",
    price: 14.99,
    renewalDate: "05/15/2023",
    category: "Entertainment",
  },
  {
    name: "Spotify",
    price: 9.99,
    renewalDate: "05/20/2023",
    category: "Entertainment",
  },
  {
    name: "Adobe Creative Cloud",
    price: 52.99,
    renewalDate: "05/25/2023",
    category: "Productivity",
  },
  {
    name: "Amazon Prime",
    price: 12.99,
    renewalDate: "06/01/2023",
    category: "Shopping",
  },
  {
    name: "Gym Membership",
    price: 29.99,
    renewalDate: "06/05/2023",
    category: "Health",
  },
];

const categories = [
  { name: "Entertainment", value: 24.98 },
  { name: "Productivity", value: 52.99 },
  { name: "Shopping", value: 12.99 },
  { name: "Health", value: 29.99 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function CategoryBreakdownChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        Loading chart...
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categories}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {categories.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

type userDataObj = {
  clerkId: string;
  email: string;
};

interface SubsInterface {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  billingCycle: string;
  renewalDate: Date;
  note?: string;
}

export default function Dashboard() {
  const totalSpending = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<userDataObj>({
    clerkId: "",
    email: "",
  });
  const [subs, setSubs] = useState<SubsInterface[]>([]);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const res = await axios.get("/api/user/get-clerk-user");
        console.log(res.data);
        setUserData((prev) => ({
          ...prev,
          clerkId: res.data.id,
          email: res.data.emailAddresses[0].emailAddress,
        }));
      } catch (error) {
        console.log(error);
      }
    }

    getCurrentUser();
  }, []);

  useEffect(() => {
    async function storeUserData() {
      if (userData) {
        try {
          const response = await axios.post("/api/user/create", userData);
          // console.log(response)
          console.log("Saved user data:", userData);
          setSubs(response.data.user?.subscriptions)
        } catch (error: unknown) {
          if (axios.isAxiosError(error) && error.response) {
            setSubs(error.response.data.user?.subscriptions || []);
            console.log("Error saving user data:", error.response.data);
          } else {
            console.error("Unexpected error:", error);
          }
        }
      }
    }

    storeUserData();
    // async function getSubs() {
    //   if (userData) {
    //     try {
    //       const response = await axios.get("/api/subscription/get", {
    //         params: { clerkID: userData.clerkId },
    //       });
    //       console.log("subscriptions: ", response.data);
    //       setSubs(response.data);
    //     } catch (error: any) {
    //       console.log("Error fetching subscriptions", error);
    //     }
    //   }
    // }
   
    // getSubs();
  }, [userData]);

  // console.log(subs)

  //------------disabled temporarily
  // useEffect(() => {
  //   async function checkAuth() {
  //     if (isLoaded && !isSignedIn) {
  //       router.push("/sign-in");
  //     }
  //   }
  //   checkAuth();
  // }, [isLoaded, isSignedIn, router]);

  // if (!isLoaded || !isSignedIn) {
  //   return <p className="text-center">Loading...</p>;
  // }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-muted">
      <header className="sticky top-0 z-10 bg-background shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-semibold text-primary">
            ottidy.
          </Link>
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <ModeToggle />
            <UserButton
              appearance={{
                elements: { avatarBox: { width: "2rem", height: "2rem" } },
              }}
            />
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Subscription Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Subscriptions
                  </p>
                  <p className="text-3xl font-bold">{subscriptions.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Monthly Spending
                  </p>
                  <p className="text-3xl font-bold">
                    ${totalSpending.toFixed(2)}
                  </p>
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                  <AddSubscriptionButton />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-full md:col-span-1 lg:col-span-1">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryBreakdownChart />
            </CardContent>
          </Card>
          <Card className="col-span-full md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Subscription List</CardTitle>
            </CardHeader>
            <CardContent>
              {
                subs?.length ? <div className="space-y-4">
                {subs.map((sub) => (
                  <div
                    key={sub.name}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4"
                  >
                    <div className="flex-grow">
                      <h3 className="font-medium">{sub.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {sub.category}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-medium">
                        {sub.currency} {sub.price.toFixed(2)}/{sub.billingCycle}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Renews: {new Date(sub.renewalDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-initial"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-initial"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div> : <div>
                <p>No Subscriptions Found</p>
              </div>
              }
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="bg-background border-t mt-8">
        <div className="container mx-auto px-4 py-6 flex justify-between">
          <h1 className="font-normal">&copy; SubEase</h1>
          <SocialLinks className="w-6 h-6" />
        </div>
      </footer>
    </div>
  );
}
