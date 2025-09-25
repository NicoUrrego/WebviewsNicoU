// Notas musicales en semitonos
const notas = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B"
];

// Afinación estándar inicial (EADGBE)
let afinacion = [
  { nota: "E", octava: 2 }, // 6ª cuerda
  { nota: "A", octava: 2 }, // 5ª cuerda
  { nota: "D", octava: 3 }, // 4ª cuerda
  { nota: "G", octava: 3 }, // 3ª cuerda
  { nota: "B", octava: 3 }, // 2ª cuerda
  { nota: "E", octava: 4 }  // 1ª cuerda
];

const guitarra = document.getElementById("guitarra");
const controlesAfinacion = document.getElementById("controles-afinacion");
const aplicarBtn = document.getElementById("aplicar-afinacion");

// Generar selectores de afinación
function generarSelectores() {
  controlesAfinacion.innerHTML = "";
  afinacion.forEach((cuerda, i) => {
    const selectNota = document.createElement("select");
    notas.forEach(n => {
      const option = document.createElement("option");
      option.value = n;
      option.textContent = n;
      if (n === cuerda.nota) option.selected = true;
      selectNota.appendChild(option);
    });

    const selectOctava = document.createElement("select");
    for (let o = 1; o <= 5; o++) {
      const option = document.createElement("option");
      option.value = o;
      option.textContent = o;
      if (o === cuerda.octava) option.selected = true;
      selectOctava.appendChild(option);
    }

    const label = document.createElement("label");
    label.textContent = `Cuerda ${6 - i}: `;
    label.style.marginRight = "10px";

    const div = document.createElement("div");
    div.appendChild(label);
    div.appendChild(selectNota);
    div.appendChild(selectOctava);

    controlesAfinacion.appendChild(div);
  });
}

// Dibujar diapasón
function generarGuitarra() {
  guitarra.innerHTML = "";
  afinacion.forEach((cuerda, i) => {
    let indexNota = notas.indexOf(cuerda.nota);
    let octava = cuerda.octava;

    for (let traste = 0; traste <= 12; traste++) {
      let nota = notas[(indexNota + traste) % 12];
      let extraOctava = Math.floor((indexNota + traste) / 12);
      let notaCompleta = nota + (octava + extraOctava);

      const btn = document.createElement("div");
      btn.classList.add("traste");
      btn.textContent = traste === 0 ? cuerda.nota + cuerda.octava : traste;
      btn.dataset.nota = notaCompleta;

      btn.addEventListener("click", () => tocarNota(notaCompleta));
      guitarra.appendChild(btn);
    }
  });
}

// Tocar nota usando Web Audio API
function tocarNota(nota) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(notaAFrecuencia(nota), audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 1);
}

// Convertir nota (ej: A4) a frecuencia
function notaAFrecuencia(nota) {
  const A4 = 440;
  const notasMap = { "C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11 };

  const regex = /^([A-G]#?)(\d)$/;
  const [, n, oct] = nota.match(regex);

  const semitonos = (oct - 4) * 12 + (notasMap[n] - 9);
  return A4 * Math.pow(2, semitonos / 12);
}

// Aplicar nueva afinación
aplicarBtn.addEventListener("click", () => {
  const selects = controlesAfinacion.querySelectorAll("select");
  let nuevaAfinacion = [];
  for (let i = 0; i < selects.length; i += 2) {
    nuevaAfinacion.push({
      nota: selects[i].value,
      octava: parseInt(selects[i + 1].value)
    });
  }
  afinacion = nuevaAfinacion;
  generarGuitarra();
});

// Inicialización
generarSelectores();
generarGuitarra();
