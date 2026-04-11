import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-4">Product Detail</h1>
        <p className="text-slate-600">Product ID: {params.id}</p>
        <Button className="mt-4">Add to Cart</Button>
      </Card>
    </div>
  );
}
