/**
 * Floor-plan layout from the CubiCasa drawing (feet).
 * +X = east (toward garage), +Z = north (toward sliding door).
 * z = 0 at the south wall of the Primary Bedroom (southernmost facade).
 */
export const f = (ft, inch = 0) => ft + inch / 12;

function room(id, name, dim, x, z, w, d, color) {
  return { id, name, dim, x, z, w, d, color };
}

/**
 * Build rooms using labeled sizes + adjacencies visible on the plan:
 * - North wall aligns: NW bedroom, small bedroom, family room, garage
 * - Primary sticks out further south than kitchen / bath / SE room
 * - Front door sits in the recess between primary and kitchen
 * - Garage is 22'7" × 23'6" (not stretched)
 * - Laundry is the hand-drawn strip between dining/kitchen and garage
 */
export function buildRooms() {
  const primaryW = f(15, 8);
  const primaryD = f(12, 10);
  const leftW = f(12, 6);
  const leftX = primaryW - leftW; // upper wing inset; primary jogs west
  const leftEast = primaryW;

  const primary = room("primary", "Primary Bedroom", "15'8\" × 12'10\"", 0, 0, primaryW, primaryD, "#c4a484");

  let z = primaryD;
  const bathPrimary = room("bath-primary", "Bath", "9'0\" × 4'9\"", leftX, z, f(9, 0), f(4, 9), "#9bb7c9");
  z += bathPrimary.d;
  const bathLeft = room("bath-left", "Bath", "12'6\" × 5'3\"", leftX, z, leftW, f(5, 3), "#8eafc0");
  z += bathLeft.d;
  const bedCloset = room("bed-closet", "Closet", "12'6\" × 9'0\"", leftX, z, leftW, f(9, 0), "#d2b48c");
  z += bedCloset.d;
  const bedNW = room("bed-nw", "Bedroom", "12'6\" × 11'4\"", leftX, z, leftW, f(11, 4), "#c9a66b");
  z += bedNW.d;
  const north = z;

  const hallW = f(5, 8);
  const hall = room("hall", "Hall", "5'8\" × 21'", leftEast, primaryD, hallW, f(21, 0), "#e8dfd0");
  const hallEast = hall.x + hall.w;

  // North band: NW bed | small bed | family (contiguous on the plan)
  const bedSmall = room(
    "bed-small",
    "Bedroom",
    "11'3\" × 7'3\"",
    leftEast,
    north - f(7, 3),
    f(11, 3),
    f(7, 3),
    "#cbb892"
  );
  const family = room(
    "family",
    "Family Room",
    "26'6\" × 10'11\"",
    bedSmall.x + bedSmall.w,
    north - f(10, 11),
    f(26, 6),
    f(10, 11),
    "#cfc4b0"
  );

  // Living directly south of family, east of hall (front door on its south wall = recess)
  const living = room(
    "living",
    "Living Room",
    "21'11\" × 17'5\"",
    hallEast,
    family.z - f(17, 5),
    f(21, 11),
    f(17, 5),
    "#d9cfc0"
  );

  // Kitchen / dining east of living
  const colX = living.x + living.w;
  const kitchenD = f(12, 6);
  const diningD = f(11, 2);
  const roomSED = f(6, 11);
  const garageD = f(23, 6);

  // SE bath+room sit under the garage; their south is north of primary (staggered front)
  const seSouth = north - garageD - roomSED;
  const kitchen = room("kitchen", "Kitchen", "10'7\" × 12'6\"", colX, seSouth, f(10, 7), kitchenD, "#b7c4a8");
  const dining = room(
    "dining",
    "Dining Area",
    "10'9\" × 11'2\"",
    colX,
    kitchen.z + kitchen.d,
    f(10, 9),
    diningD,
    "#d4c3a8"
  );

  // Hand-drawn laundry ~5' (similar to bath width) between kitchen/dining and garage
  const laundryW = f(5, 8);
  const laundryX = Math.max(dining.x + dining.w, kitchen.x + kitchen.w);
  const laundry = room(
    "laundry",
    "Laundry",
    "5'0\" wide",
    laundryX,
    seSouth + roomSED,
    laundryW,
    north - (seSouth + roomSED),
    "#b0b8c0"
  );

  const garage = room(
    "garage",
    "Garage",
    "22'7\" × 23'6\"",
    laundry.x + laundry.w,
    north - garageD,
    f(22, 7),
    garageD,
    "#8a9096"
  );
  const roomSE = room(
    "room-se",
    "Room",
    "11'4\" × 6'11\"",
    garage.x + garage.w - f(11, 4),
    seSouth,
    f(11, 4),
    roomSED,
    "#c2b29a"
  );
  const bathRight = room(
    "bath-right",
    "Bath",
    "5'8\" × 6'11\"",
    laundry.x,
    seSouth,
    f(5, 8),
    roomSED,
    "#9bb7c9"
  );

  // Family spans to laundry on the plan's north band
  family.w = laundry.x - family.x;

  return [
    primary,
    bathPrimary,
    bathLeft,
    bedCloset,
    bedNW,
    hall,
    bedSmall,
    family,
    living,
    dining,
    kitchen,
    laundry,
    bathRight,
    garage,
    roomSE,
  ];
}
