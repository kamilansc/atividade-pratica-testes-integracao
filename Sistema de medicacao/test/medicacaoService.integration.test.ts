import { beforeEach, afterEach, it, expect } from "vitest";
import Database from "better-sqlite3";
import { criarBancoDeTeste } from "./fixtureDatabase";

let db: Database.Database;

beforeEach(() => {
    db = criarBancoDeTeste();
});

afterEach(() => {
    db.close();
});

// it("cadastrar um medicamento atualiza o banco", (db) => {
//   const id = service.cadastrar("Dipirona");

//   const medicamento = db
//     .prepare("SELECT * FROM medicamentos WHERE id = ?")
//     .get(id) as { id: number; nome: string };

//   expect(medicamento.nome).toBe("Dipirona");
// });

// it("deve cadastrar outro medicamento", () => {
//   const id = service.cadastrar("Paracetamol");

//   const medicamento = db
//     .prepare("SELECT * FROM medicamentos WHERE id = ?")
//     .get(id) as { id: number; nome: string };

//   expect(medicamento.nome).toBe("Paracetamol");
// });