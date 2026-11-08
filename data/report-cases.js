/* Casos ficticios exclusivos de diseño, nunca información de personas reales. */
window.XRAIC_REPORT_CASES=[
  {
    "id": "0001",
    "state": "Completo",
    "overview": "Se documenta una atención por dolor abdominal, evaluación en urgencias, ingreso hospitalario, intervención quirúrgica, evolución postoperatoria y egreso. Se dispone de antecedentes, mediciones, notas de evolución y plan de seguimiento.",
    "analysis": "La secuencia permite reconstruir el episodio desde la atención inicial hasta el egreso. La descripción integra datos documentados, sin sustituir las notas firmadas ni confirmar administración de tratamientos únicamente prescritos.",
    "history": [
      "Hipertensión arterial consignada en historia clínica.",
      "Niega alergias en interrogatorio registrado.",
      "Antecedente quirúrgico previo documentado."
    ],
    "exploration": [
      "Presión arterial: 128/82 mmHg.",
      "Frecuencia cardíaca: 88 lpm. Temperatura: 37.1 °C.",
      "Peso 78.4 kg; talla 1.74 m."
    ],
    "events": [
      "14 oct · Valoración en urgencias por dolor abdominal.",
      "15 oct · Ingreso y procedimiento quirúrgico documentado.",
      "16 oct · Seguimiento postoperatorio.",
      "17 oct · Egreso con indicaciones."
    ],
    "orders": [
      "Indicaciones perioperatorias documentadas.",
      "Plan de seguimiento registrado en nota de egreso."
    ],
    "checks": [
      "Confirmar coincidencia temporal de capturas repetidas al abrir las fuentes."
    ],
    "sources": [
      "Historia clínica HC-SIM-01",
      "Urgencias URG-SIM-01",
      "Ingreso ING-SIM-01",
      "Nota operatoria Q-SIM-01",
      "Evolución EVO-SIM-01",
      "Egreso EGR-SIM-01"
    ],
    "identity": {
      "name": "Juan Carlos Ramírez Soto",
      "age": "46 años",
      "sex": "Masculino",
      "birth": "12 ene 1980",
      "weight": "78.4 kg",
      "height": "1.74 m",
      "allergies": "Niega alergias, según nota",
      "blood": "O positivo",
      "service": "Urgencias / Hospitalización",
      "date": "14–17 oct 2026"
    },
    "original": "FUENTE SINTÉTICA · Historia clínica HC-SIM-01. Se documenta una atención por dolor abdominal, evaluación en urgencias, ingreso hospitalario, intervención quirúrgica, evolución postoperatoria y egreso. Se dispone de antecedentes, mediciones, notas de evolución y plan de seguimiento."
  },
  {
    "id": "0002",
    "state": "Parcial",
    "overview": "Se dispone de una sola consulta externa por cefalea recurrente. La nota presenta el motivo, un interrogatorio breve y una indicación de seguimiento; no hay mediciones de peso o talla ni historia longitudinal.",
    "analysis": "La información es suficiente para presentar la consulta registrada, pero insuficiente para calcular indicadores antropométricos o completar antecedentes. Los campos sin registro no deben mostrarse como normales ni negativos.",
    "history": [
      "Antecedentes familiares no consignados.",
      "No se dispone de declaración sobre alergias."
    ],
    "exploration": [
      "Peso, talla y cifras de signos vitales no disponibles."
    ],
    "events": [
      "03 oct · Consulta externa por cefalea y plan de seguimiento."
    ],
    "orders": [
      "Seguimiento indicado en la nota disponible."
    ],
    "checks": [
      "Peso, talla, grupo sanguíneo, nacimiento y alergias sin dato registrado."
    ],
    "sources": [
      "Consulta C-SIM-02"
    ],
    "identity": {
      "name": "María Fernanda López Ruiz",
      "age": "33 años",
      "sex": "Femenino",
      "birth": null,
      "weight": null,
      "height": null,
      "allergies": null,
      "blood": null,
      "service": "Consulta externa",
      "date": "03 oct 2026"
    },
    "original": "FUENTE SINTÉTICA · Consulta C-SIM-02. Se dispone de una sola consulta externa por cefalea recurrente. La nota presenta el motivo, un interrogatorio breve y una indicación de seguimiento; no hay mediciones de peso o talla ni historia longitudinal."
  },
  {
    "id": "0003",
    "state": "Sin nombre",
    "overview": "Una nota de urgencias describe atención por mareo y debilidad. Se consignan edad, sexo y peso, pero no aparece nombre ni talla verificable.",
    "analysis": "No debe inferirse el nombre a partir del expediente. La ausencia de talla impide calcular un índice que dependa de esa medida; en contraste, la negación de alergias sí está expresamente consignada.",
    "history": [
      "La paciente declara que niega alergias.",
      "Antecedentes familiares no disponibles."
    ],
    "exploration": [
      "Peso registrado: 61 kg.",
      "Talla no registrada."
    ],
    "events": [
      "12 sep · Atención de urgencias por mareo."
    ],
    "orders": [
      "Observación clínica consignada."
    ],
    "checks": [
      "Nombre y talla requieren cotejo o registro explícito."
    ],
    "sources": [
      "Urgencias URG-SIM-03"
    ],
    "identity": {
      "name": null,
      "age": "67 años",
      "sex": "Femenino",
      "birth": null,
      "weight": "61 kg",
      "height": null,
      "allergies": "Niega alergias, según nota",
      "blood": null,
      "service": "Urgencias",
      "date": "12 sep 2026"
    },
    "original": "FUENTE SINTÉTICA · Urgencias URG-SIM-03. Una nota de urgencias describe atención por mareo y debilidad. Se consignan edad, sexo y peso, pero no aparece nombre ni talla verificable."
  },
  {
    "id": "0004",
    "state": "Discordancias",
    "overview": "Existen dos episodios separados: una atención en urgencias por dolor torácico y una hospitalización posterior por síntomas respiratorios. Distintas notas registran valores de peso y talla que no deben fusionarse.",
    "analysis": "El cambio de peso debe leerse por fecha. La discordancia de talla requiere cotejo con las fuentes y no debe resolverse escogiendo un valor al azar. No se calcula un IMC combinado de episodios diferentes.",
    "history": [
      "Hipertensión arterial consignada.",
      "Alergias no documentadas."
    ],
    "exploration": [
      "Peso: 82 kg en febrero; 76 kg en agosto.",
      "Talla discordante: 1.70 m / 1.78 m."
    ],
    "events": [
      "02 feb · Primera atención en urgencias.",
      "18 ago · Segundo episodio con ingreso hospitalario.",
      "20 ago · Egreso del segundo episodio."
    ],
    "orders": [
      "Indicaciones registradas por episodio, sin mezclar ambas atenciones."
    ],
    "checks": [
      "Verificar dos tallas distintas.",
      "No asumir que valores de ingresos diferentes son una misma medición."
    ],
    "sources": [
      "Urgencias U-SIM-04A",
      "Historia clínica HC-SIM-04",
      "Ingreso I-SIM-04B",
      "Egreso E-SIM-04B"
    ],
    "identity": {
      "name": "José Antonio García Méndez",
      "age": "58 años",
      "sex": "Masculino",
      "birth": "06 may 1968",
      "weight": {
        "conflict": [
          "82 kg · feb 2026",
          "76 kg · ago 2026"
        ]
      },
      "height": {
        "conflict": [
          "1.70 m · ficha inicial",
          "1.78 m · ingreso posterior"
        ]
      },
      "allergies": null,
      "blood": {
        "duplicate": [
          "A positivo · historia clínica ficticia",
          "A positivo · nota de ingreso ficticia"
        ]
      },
      "service": "Urgencias / Hospitalización",
      "date": "02 feb–20 ago 2026"
    },
    "original": "FUENTE SINTÉTICA · Urgencias U-SIM-04A. Existen dos episodios separados: una atención en urgencias por dolor torácico y una hospitalización posterior por síntomas respiratorios. Distintas notas registran valores de peso y talla que no deben fusionarse."
  },
  {
    "id": "0005",
    "state": "Identificación mínima",
    "overview": "Solo se encuentra una nota de urgencias con motivo febril referido y valoración general. La fuente no identifica nombre, edad, sexo ni medidas antropométricas.",
    "analysis": "El expediente tiene alcance limitado. No puede atribuírsele una identidad real ni inventarse antecedentes, signos vitales, tratamiento o evolución para completar apartados. Debe verificarse el documento fuente.",
    "history": [],
    "exploration": [
      "No hay valores verificables de peso, talla, presión arterial o temperatura."
    ],
    "events": [
      "25 oct · Nota breve de atención por cuadro febril referido."
    ],
    "orders": [],
    "checks": [
      "Identificación insuficiente para asociar con certeza el contenido a una persona."
    ],
    "sources": [
      "Urgencias U-SIM-05"
    ],
    "identity": {
      "name": null,
      "age": null,
      "sex": null,
      "birth": null,
      "weight": null,
      "height": null,
      "allergies": null,
      "blood": null,
      "service": "Urgencias",
      "date": "25 oct 2026"
    },
    "original": "FUENTE SINTÉTICA · Urgencias U-SIM-05. Solo se encuentra una nota de urgencias con motivo febril referido y valoración general. La fuente no identifica nombre, edad, sexo ni medidas antropométricas."
  },
  {
    "id": "0006",
    "state": "Solo identificación",
    "overview": "Se dispone únicamente de una ficha administrativa con identificación y mediciones. No existen notas clínicas asociadas en esta muestra.",
    "analysis": "Aunque algunos datos de identificación estén completos, no se puede elaborar una historia clínica, un diagnóstico o una evolución sin documentación médica. La ausencia de notas no implica ausencia de enfermedades.",
    "history": [],
    "exploration": [
      "Ficha registra peso de 65.2 kg y talla de 1.63 m.",
      "No hay exploración ni signos vitales clínicos documentados."
    ],
    "events": [],
    "orders": [],
    "checks": [
      "No hay documentos clínicos para sustentar síntesis de atención.",
      "Alergias y grupo sanguíneo no registrados."
    ],
    "sources": [
      "Ficha F-SIM-06"
    ],
    "identity": {
      "name": "Elena Patricia Moreno Díaz",
      "age": "29 años",
      "sex": "Femenino",
      "birth": "21 jun 1997",
      "weight": "65.2 kg",
      "height": "1.63 m",
      "allergies": null,
      "blood": null,
      "service": null,
      "date": null
    },
    "original": "FUENTE SINTÉTICA · Ficha F-SIM-06. Se dispone únicamente de una ficha administrativa con identificación y mediciones. No existen notas clínicas asociadas en esta muestra."
  },
  {
    "id": "0007",
    "state": "No aplica",
    "overview": "Consulta externa de seguimiento con identificación, antecedentes parciales y medidas registradas. No hay hospitalización ni cirugía en el episodio documentado.",
    "analysis": "Un apartado puede no aplicar por la modalidad de atención, lo cual es diferente de estar vacío. Egreso hospitalario y cirugía no aplican a esta consulta; grupo sanguíneo sí es un dato ausente.",
    "history": [
      "Alergia a penicilina expresamente declarada.",
      "Antecedentes familiares parciales."
    ],
    "exploration": [
      "Peso 72 kg; talla 1.68 m."
    ],
    "events": [
      "05 oct · Seguimiento en consulta externa."
    ],
    "orders": [
      "Seguimiento ambulatorio documentado."
    ],
    "checks": [
      "Grupo sanguíneo sin dato; no equivale a no aplicable."
    ],
    "sources": [
      "Consulta C-SIM-07",
      "Historia clínica HC-SIM-07"
    ],
    "identity": {
      "name": "Ana Sofía Torres Vega",
      "age": "41 años",
      "sex": "Femenino",
      "birth": "10 nov 1984",
      "weight": "72 kg",
      "height": "1.68 m",
      "allergies": "Alergia declarada a penicilina",
      "blood": null,
      "service": "Consulta externa",
      "date": "05 oct 2026"
    },
    "original": "FUENTE SINTÉTICA · Consulta C-SIM-07. Consulta externa de seguimiento con identificación, antecedentes parciales y medidas registradas. No hay hospitalización ni cirugía en el episodio documentado."
  }
];
