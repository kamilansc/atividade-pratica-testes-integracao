export const medicationInputCases = [
  // Cada campo obrigatório ausente
  { input: { medicationName: 'Paracetamol', dosage: '500 mg', route: 'oral', scheduledAt: '2026-10-28T14:00' } },
  { input: { patientName: 'Maria Silva', dosage: '500 mg', route: 'oral', scheduledAt: '2026-10-28T14:00' } },
  { input: { patientName: 'Maria Silva', medicationName: 'Paracetamol', route: 'oral', scheduledAt: '2026-10-28T14:00' } },
  { input: { patientName: 'Maria Silva', medicationName: 'Paracetamol', dosage: '500 mg', scheduledAt: '2026-10-28T14:00' } },
  { input: { patientName: 'Maria Silva', medicationName: 'Paracetamol', dosage: '500 mg', route: 'oral' } },

  // Cada campo obrigatório com tipo inválido
  { input: { patientName: 123, medicationName: 'Paracetamol', dosage: '500 mg', route: 'oral', scheduledAt: '2026-10-28T14:00' } },
  { input: { patientName: 'Maria Silva', medicationName: false, dosage: '500 mg', route: 'oral', scheduledAt: '2026-10-28T14:00' } },
  { input: { patientName: 'Maria Silva', medicationName: 'Paracetamol', dosage: null, route: 'oral', scheduledAt: '2026-10-28T14:00' } },
  { input: { patientName: 'Maria Silva', medicationName: 'Paracetamol', dosage: '500 mg', route: [], scheduledAt: '2026-10-28T14:00' } },
  { input: { patientName: 'Maria Silva', medicationName: 'Paracetamol', dosage: '500 mg', route: 'oral', scheduledAt: new Date() } },

  // notes, quando informado, deve ser string
    {
        input: {
            patientName: 'Maria Silva',
            medicationName: 'Paracetamol',
            dosage: '500 mg',
            route: 'oral',
            scheduledAt: '2026-10-28T14:00',
            notes: 123,
        },
    },
]