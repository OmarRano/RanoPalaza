import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { CreditCard, MapPin, Package, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Checkout() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<"address" | "payment" | "done">("address");

  const [addressData, setAddressData] = useState({
    fullName:  "Peter Nwosu",
    email:     "buyer@sahadstores.com",
    phone:     "+234 805 123 4567",
    address:   "45 Wuse Zone 3",
    city:      "Abuja",
    state:     "FCT",
    zipCode:   "900001",
    country:   "Nigeria",
  });

  const orderSummary = { subtotal: 28200, tax: 2115, shipping: 0, total: 30315, items: 3 };

  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data: any) => {
      toast.success("Order placed successfully!");
      setCurrentStep("done");
    },
    onError: (error: any) => toast.error(error.message || "Failed to place order"),
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressData.fullName || !addressData.address || !addressData.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrderMutation.mutate({
      shippingAddress: addressData.address,
      shippingCity:    addressData.city,
      shippingState:   addressData.state,
      shippingCountry: addressData.country,
      buyerPhone:      addressData.phone,
    } as any);
  };

  if (currentStep === "done") {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader title="Order Confirmed" subtitle="Your order has been placed" />
        <main className="container mx-auto px-4 py-16 max-w-lg text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Placed!</h2>
          <p className="text-slate-600 mb-6">Your order has been confirmed and will be processed soon.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/orders")}>View My Orders</Button>
            <Button variant="outline" onClick={() => navigate("/products")}>Continue Shopping</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader title="Checkout" subtitle="Complete your purchase" />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === "address" && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" />Delivery Address</CardTitle>
                  <CardDescription>Where should we deliver your order?</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[["fullName","Full Name *"],["email","Email *"],["phone","Phone *"],["address","Street Address *"],["city","City *"],["state","State *"],["zipCode","Zip Code"]].map(([key,label]) => (
                        <div key={key} className={key === "address" ? "md:col-span-2 space-y-2" : "space-y-2"}>
                          <Label htmlFor={key}>{label}</Label>
                          <Input id={key} value={(addressData as any)[key]} onChange={e => setAddressData({...addressData,[key]:e.target.value})} />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" onClick={() => navigate("/cart")}>Back to Cart</Button>
                      <Button type="submit" className="flex-1">Continue to Payment</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {currentStep === "payment" && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" />Payment Method</CardTitle>
                  <CardDescription>Select how you want to pay</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                      <p className="font-medium text-slate-900 mb-1">Delivering to:</p>
                      <p className="text-slate-600">{addressData.fullName} — {addressData.address}, {addressData.city}, {addressData.state}</p>
                    </div>
                    <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                      <div className="flex items-center gap-3">
                        <input type="radio" id="monnify" name="payment" defaultChecked />
                        <label htmlFor="monnify" className="flex-1 cursor-pointer">
                          <p className="font-medium text-slate-900">Monnify Payment</p>
                          <p className="text-sm text-slate-600">Bank transfer · Card · USSD</p>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep("address")}>Back</Button>
                      <Button type="submit" className="flex-1" disabled={createOrderMutation.isPending}>
                        {createOrderMutation.isPending ? "Processing…" : `Pay ₦${orderSummary.total.toLocaleString()}`}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order summary sidebar */}
          <div>
            <Card className="border-0 shadow-md sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 pb-4 border-b border-slate-200">
                  <div className="flex justify-between text-sm"><span className="text-slate-600">{orderSummary.items} items</span><span className="font-medium">₦{orderSummary.subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-600">Tax (7.5%)</span><span className="font-medium">₦{orderSummary.tax.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-600">Shipping</span><span className="font-medium text-green-600">FREE</span></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">₦{orderSummary.total.toLocaleString()}</span>
                </div>
                <div className="space-y-2 pt-3 border-t border-slate-200 text-sm">
                  {[["1","Delivery Address",true],["2","Payment",currentStep==="payment"]].map(([n,l,done]) => (
                    <div key={n as string} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}>{n}</div>
                      <span>{l as string}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
