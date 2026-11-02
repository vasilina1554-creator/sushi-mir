import { getStore } from "@netlify/blobs";

const initial = [
  { id: "philadelphia", name: "Філадельфія", description: "Ніжний рол із лососем та вершковим сиром", ingredients: "Лосось, вершковий сир, огірок, рис, норі", price: 289, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900", category: "Роли" },
  { id: "california", name: "Каліфорнія", description: "Класика з ніжним крабом та авокадо", ingredients: "Краб, авокадо, огірок, ікра масаго, рис, норі", price: 249, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=900", category: "Роли" },
  { id: "salmon-set", name: "Сет Salmon", description: "Улюблені роли для гарної компанії", ingredients: "Філадельфія, макі з лососем, нігірі", price: 699, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=900", category: "Сети" },
  { id: "maki", name: "Макі з огірком", description: "Легкий та свіжий смак", ingredients: "Огірок, рис, норі", price: 129, image: "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=900", category: "Макі" }
];

export default async (req) => {
  const store = getStore("sushi-mir-products");
  if (req.method === "GET") {
    const products = await store.get("products", { type: "json" }) || initial;
    return Response.json({ products });
  }
  if (req.method === "POST") {
    const body = await req.json();
    if (!Array.isArray(body.products)) return Response.json({ error: "Invalid products" }, { status: 400 });
    await store.setJSON("products", body.products);
    return Response.json({ ok: true });
  }
  return new Response("Method not allowed", { status: 405 });
};
