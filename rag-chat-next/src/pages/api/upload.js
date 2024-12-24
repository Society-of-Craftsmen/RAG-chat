import { authenticate } from "../../../middleware/authenticate";

const handler = (req, res) => {
  


  
}

export default (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  authenticate(req, res, () => handler(req, res));
}