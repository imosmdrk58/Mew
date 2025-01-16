import type { NextApiRequest, NextApiResponse } from "next";

export async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Body'den verileri al
    const { limit, sort_by, sort_order } = req.body;

    // Eksik parametre kontrolü
    if (!limit || !sort_by || !sort_order) {
      return res.status(400).json({ message: "Missing parameters in body" });
    }

    console.log("limit", limit);
    console.log(
      "Url" +
        `${process.env.NEXT_PUBLIC_API_URL}/manga?limit=${limit}&sort_by=${sort_by}&sort_order=${sort_order}`
    );

    // Harici API'ye istek yap
    const response = await fetch(
      `${process.env.API_URL}/manga?limit=${limit}&sort_by=${sort_by}&sort_order=${sort_order}`
    );
    const data = await response.json();

    // İstemciye yanıt gönder
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching manga:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { postHandler as POST };
