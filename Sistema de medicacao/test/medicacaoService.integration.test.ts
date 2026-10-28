import { beforeEach, afterEach, it, expect, vi, test } from "vitest";
import Database from "better-sqlite3";
import { criarBancoDeTeste } from "./fixtureDatabase";
import { medicationsService, ValidationError } from "../src/service"
import { medicationInputCases } from "./casosDeTesteGeramExcecao";


// 1. Função de mock - pesquisar mais sobre!!
const { getDb } = vi.hoisted(() => ({
    getDb: vi.fn()
}))

// 2. Substitui src/database.ts por um módulo de teste.
//    Quando a service pedir "db", este getter chamará getDb().
vi.mock("../src/database", () => ({
    get db() {
        return getDb();
    }
}));

let db: Database.Database;

beforeEach(() => {
    db = criarBancoDeTeste();
    getDb.mockReturnValue(db);
});

afterEach(() => {
    db.close();
});


it("cadastrar um medicamento atualiza o banco", () => {
    const medicacaoCriada = medicationsService.create ({
        patientName: "Kamila",
        medicationName: "Dipirona",
        dosage: "500mg",
        route: "Oral",
        scheduledAt: "2026-10-27T02:52",
        notes: null
    })

    const medicamento = db
        .prepare("SELECT * FROM medication_orders WHERE id = ?")
        .get(medicacaoCriada.id);

    expect(medicamento).toEqual(
        {
            id: 1,
            patient_name: "Kamila",
            medication_name: "Dipirona",
            dosage: "500mg",
            route: "Oral",
            scheduled_at: "2026-10-27T02:52",
            notes: null
        }
    );
});

test.each(medicationInputCases)(
    'cadastrar medicamento com campo inválido gera exceção - Valida medicationInput: %#',
    ({input}) => {
        expect(() => medicationsService.create(input)).toThrow(ValidationError)
    }
)