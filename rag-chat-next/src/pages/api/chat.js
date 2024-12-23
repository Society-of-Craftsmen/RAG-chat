export default function handler(req, res) {
    if (req.method === "GET") {
      res.status(200).json({ message: "chat endpoint" });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  }  