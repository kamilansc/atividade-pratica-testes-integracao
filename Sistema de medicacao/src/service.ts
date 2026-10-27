import { db } from "./database";

type MedicationRow = {
  id: number;
  patient_name: string;
  medication_name: string;
  dosage: string;
  route: string;
  scheduled_at: string;
  notes: string | null;
};

type MedicationInput = {
  patientName: string;
  medicationName: string;
  dosage: string;
  route: string;
  scheduledAt: string;
  notes?: string | null;
};

const SELECT_COLUMNS = "id, patient_name, medication_name, dosage, route, scheduled_at, notes";

class ValidationError extends Error {
  readonly status = 400;
}
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function toMedication(row: MedicationRow) {
  return {
    id: row.id,
    patientName: row.patient_name,
    medicationName: row.medication_name,
    dosage: row.dosage,
    route: row.route,
    scheduledAt: row.scheduled_at,
    notes: row.notes
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateMedicationInput(value: unknown): MedicationInput {
  if (!isRecord(value)) throw new ValidationError("Dados da prescricao invalidos.");

  const required: Array<[string, string]> = [
    ["patientName", "O campo Nome do paciente e obrigatorio"],
    ["medicationName", "O campo Nome do medicamento e obrigatorio"],
    ["dosage", "O campo Dosagem e obrigatoria"],
    ["route", "O campo Via de administracao e obrigatoria"]
  ];
  for (const [field, message] of required) {
    if (typeof value[field] !== "string" || value[field].trim() === "") throw new ValidationError(message);
  }

  if (typeof value.scheduledAt !== "string" || !ISO_DATE_TIME.test(value.scheduledAt)) {
    throw new ValidationError("O campo Data e horario e obrigatorio e deve estar no formato AAAA-MM-DDTHH:mm.");
  }
  if (value.notes !== undefined && value.notes !== null && typeof value.notes !== "string") {
    throw new ValidationError("O campo Observacoes deve ser um texto.");
  }

  return value as unknown as MedicationInput;
}

export const medicationsService = {
  list() {
    const rows = db.prepare(`SELECT ${SELECT_COLUMNS} FROM medication_orders`).all() as MedicationRow[];
    return rows.map(toMedication);
  },

  create(input: unknown) {
    const data = validateMedicationInput(input);
    const result = db.prepare(`
      INSERT INTO medication_orders (patient_name, medication_name, dosage, route, scheduled_at, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      data.patientName.trim(), data.medicationName.trim(), data.dosage.trim(),
      data.route.trim(), data.scheduledAt, data.notes?.trim() || null
    );

    const row = db.prepare(`SELECT ${SELECT_COLUMNS} FROM medication_orders WHERE id = ?`)
      .get(result.lastInsertRowid) as MedicationRow | undefined;
    if (!row) throw new Error("Nao foi possivel recuperar a prescricao criada.");
    return toMedication(row);
  },

  getById(id: number) {
    const row = db.prepare(`SELECT ${SELECT_COLUMNS} FROM medication_orders WHERE id = ?`)
      .get(id) as MedicationRow | undefined;
    return row ? toMedication(row) : null;
  },

  remove(id: number) {
    const result = db.prepare("DELETE FROM medication_orders WHERE id = ?").run(id);
    return result.changes > 0;
  }
};
