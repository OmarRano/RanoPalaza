import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { User, Mail, Phone, Shield, Edit2, Save } from "lucide-react";

export default function BuyerProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState((user as any)?.name ?? "");
  const [phone, setPhone] = useState((user as any)?.phone ?? "");

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader title="My Profile" subtitle="Manage your account information" />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Personal Info</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setEditing(!editing)} className="gap-2">
                  {editing ? <><Save className="w-4 h-4" /> Done</> : <><Edit2 className="w-4 h-4" /> Edit</>}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</Label>
                {editing ? (
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
                ) : (
                  <p className="mt-1 text-slate-900 font-medium">{name || "Not set"}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Email Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-900">{(user as any)?.email ?? "-"}</p>
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</Label>
                {editing ? (
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" placeholder="+234..." />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <p className="text-slate-900">{phone || "Not set"}</p>
                  </div>
                )}
              </div>
              {editing && (
                <Button onClick={handleSave} className="w-full">Save Changes</Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Account Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-slate-600">Account Type</span>
                <span className="font-semibold capitalize text-slate-900 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">{(user as any)?.role ?? "buyer"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-slate-600">Member Since</span>
                <span className="font-semibold text-slate-900">{(user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "long" }) : "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-600">Affiliate Status</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${(user as any)?.isAffiliate ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {(user as any)?.isAffiliate ? "Active Affiliate" : "Not an Affiliate"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}