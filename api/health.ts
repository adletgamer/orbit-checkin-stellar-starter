import { sendJson, type JsonResponse } from "./_env";

export default function handler(_req: unknown, res: JsonResponse) {
  sendJson(res, 200, {
    status: "ok",
  });
}
