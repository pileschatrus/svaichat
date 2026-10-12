import { BODY_PART_IDS, type Selection } from "./pricing";

// Быстрые сценарии «Что случилось?» — для тех, кому проще выбрать ситуацию,
// чем отмечать детали на схеме.
export type Scenario = { id: string; title: string; hint: string; sel: Selection[]; extras?: string[] };

export const SCENARIOS: Scenario[] = [
  {
    id: "scratchBumper",
    title: "Поцарапали бампер на парковке",
    hint: "Локальная покраска",
    sel: [{ partId: "bumper_f", damage: "deep", size: "s", option: "local" }],
  },
  {
    id: "crackBumper",
    title: "Треснул бампер",
    hint: "Пайка + покраска",
    sel: [{ partId: "bumper_f", damage: "crack", size: "m", option: "plastic" }],
  },
  {
    id: "dentDoor",
    title: "Вмятина на двери, краска цела",
    hint: "Без покраски (PDR)",
    sel: [{ partId: "door_fl", damage: "dent", size: "m", option: "pdr" }],
  },
  {
    id: "dtpFront",
    title: "Небольшое ДТП спереди",
    hint: "Бампер, капот, крыло",
    sel: [
      { partId: "bumper_f", damage: "crack", size: "m", option: "plastic" },
      { partId: "hood", damage: "dentPaint", size: "m", option: "straight" },
      { partId: "fender_fl", damage: "dentPaint", size: "s", option: "straight" },
    ],
    extras: ["polishFull"],
  },
  {
    id: "rustArches",
    title: "Ржавеют арки и пороги",
    hint: "Удаление коррозии + антикор",
    sel: [
      { partId: "quarter_l", damage: "rust", size: "m", option: "rust" },
      { partId: "quarter_r", damage: "rust", size: "m", option: "rust" },
      { partId: "sill_l", damage: "rust", size: "s", option: "rust" },
      { partId: "sill_r", damage: "rust", size: "s", option: "rust" },
    ],
    extras: ["anticor"],
  },
  {
    id: "paintOne",
    title: "Покрасить капот от сколов",
    hint: "Покраска элемента",
    sel: [{ partId: "hood", damage: "paint", size: "m", option: "full" }],
    extras: ["ppf"],
  },
  {
    id: "fullPaint",
    title: "Покрасить авто целиком",
    hint: "Все элементы кузова",
    sel: BODY_PART_IDS.map((partId) => ({ partId, damage: "paint" as const, size: "m" as const, option: "full" })),
    extras: ["polishFull"],
  },
];

export const SCENARIO_BY_ID = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]));
