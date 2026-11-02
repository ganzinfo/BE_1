import validator from 'validator';

/**
 * Middleware a felhasználó létrehozásakor (createuser) küldött adatok validálására.
 * A validator csomag segítségével ellenőrzi az email címet és a születési évet.
 */
export function validateCreateUser(req, res, next) {
  const { email, birthYear } = req.body;
  console.log(`[MIDDLEWARE] validateCreateUser -> Validáció indítása: email="${email}", birthYear=${birthYear}`);

  // Email formátum ellenőrzése
  if (!email || !validator.isEmail(String(email).trim())) {
    console.log(`[MIDDLEWARE] validateCreateUser -> HIBA: Érvénytelen vagy hiányzó email cím: "${email}"`);
    return res.status(400).json({
      error: 'Érvénytelen vagy hiányzó email cím.',
    });
  }

  // Születési év ellenőrzése (1900 és az aktuális év közötti egész szám)
  const currentYear = new Date().getFullYear();
  if (
    birthYear === undefined ||
    birthYear === null ||
    !validator.isInt(String(birthYear).trim(), { min: 1900, max: currentYear })
  ) {
    console.log(`[MIDDLEWARE] validateCreateUser -> HIBA: Érvénytelen születési év: ${birthYear} (Megengedett: 1900-${currentYear})`);
    return res.status(400).json({
      error: `A születési évnek 1900 és ${currentYear} közötti egész számnak kell lennie.`,
    });
  }

  console.log(`[MIDDLEWARE] validateCreateUser -> SIKERES validáció! Továbbengedés a kontrollernek (next)`);
  next();
}

export default {
  validateCreateUser,
};
