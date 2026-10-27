import { Request, Response } from "express";
import { medicationsService } from "./service";

function sendError(res: Response, error: unknown) {
  if (error instanceof Error) {
    const status = "status" in error && typeof error.status === "number" ? error.status : 500;
    return res.status(status).json({ error: error.message });
  }
  return res.status(500).json({ error: "Erro interno do servidor." });
}

function parseId(rawId: unknown): number | null {
  if (typeof rawId !== "string" || !/^\d+$/.test(rawId)) return null;
  const id = Number(rawId);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export const medicationsController = {
  health(_req: Request, res: Response) {
    return res.json({ status: "ok" });
  },

  list(_req: Request, res: Response) {
    try {
      return res.status(200).json(medicationsService.list());
    } catch (error) {
      return sendError(res, error);
    }
  },

  create(req: Request, res: Response) {
    try {
      return res.status(201).json(medicationsService.create(req.body));
    } catch (error) {
      return sendError(res, error);
    }
  },

  getById(req: Request, res: Response) {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: "ID invalido." });

    try {
      const medication = medicationsService.getById(id);
      if (!medication) return res.status(404).json({ error: "Prescricao nao encontrada." });
      return res.status(200).json(medication);
    } catch (error) {
      return sendError(res, error);
    }
  },

  remove(req: Request, res: Response) {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: "ID invalido." });

    try {
      if (!medicationsService.remove(id)) {
        return res.status(404).json({ error: "Nao e possivel deletar. Prescricao nao existe." });
      }
      return res.status(204).send();
    } catch (error) {
      return sendError(res, error);
    }
  }
};
