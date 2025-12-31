// APPLIES CHECKSUM ALGORITHM TO NHI AND RETURNS BOOLEAN RESULT 

const alphabetConversionTable: { [key: string]: number } = {
  A: 1,  B: 2,  C: 3,  D: 4,  E: 5,
  F: 6,  G: 7,  H: 8,  J: 9,  K: 10,
  L: 11, M: 12, N: 13, P: 14, Q: 15,
  R: 16, S: 17, T: 18, U: 19, V: 20,
  W: 21, X: 22, Y: 23, Z: 24
};

export const validateNHI = (nhi: string): boolean => {

    /* Algorithm based on: 
    (will download docx)
    https://www.tewhatuora.govt.nz/assets/Our-health-system/Eligibility-for-publicly-funded-services/nhi_validation_routine_Apr_2023v6.doc


  Note: "In April 2023 a new NHI format was introduced. New format NHIs will not be 
  issued to patients before October 2025 to give providers time to change their systems
   to accept the new format."
  There are different algorithm needs for the new vs old format. 
  Make sure you use resources dated after 2023!

  Read more here: https://www.tewhatuora.govt.nz/health-services-and-programmes/health-identity/national-health-index/nhi-number-format-changes/
  */ 

  // Ensure NHI is exactly 7 characters long
  if (nhi.length !== 7) return false;

  // Step 3: Extract parts of the NHI
  const [first, second, third, fourth, fifth, sixth, seventh] = nhi.split('');

  /* Step 1: The first, second and third characters must be within the Alphabet Conversion Table.
   They cannot be ‘I’ or ‘O’ (confusing with the numbers 1 and 0) */
  if (!isValidAlpha(first) || !isValidAlpha(second) || !isValidAlpha(third)) return false;

  // Step 2: The fourth and fifth characters must be numeric
  if (!isNumeric(fourth) || !isNumeric(fifth)) return false;


  /* Step 3: The sixth and seventh characters are either 
  both numeric or both alphabetic */ 

  const isOldFormat = isNumeric(sixth) && isNumeric(seventh);
  const isNewFormat = isValidAlpha(sixth) && isValidAlpha(seventh);

  if (!isOldFormat && !isNewFormat) return false;

  let sum = 0; // sum initiates step 10 
  sum += alphabetConversionTable[first] * 7; // step 4
  sum += alphabetConversionTable[second] * 6; // step 5
  sum += alphabetConversionTable[third] * 5; // step 6
  sum += parseInt(fourth) * 4; // step 7
  sum += parseInt(fifth) * 3; // step 8


  if (isOldFormat) {
    sum += parseInt(sixth) * 2; // step 9 v1

    const remainder = sum % 11; // step 11 v1
    let checkDigit = 11 - remainder;
    if (checkDigit === 10) checkDigit = 0; // step 13 
    if (checkDigit === 11) return false; // step 12 
    return parseInt(seventh) === checkDigit; // step 15 
  }

  if (isNewFormat) {
    sum += alphabetConversionTable[sixth] * 2; // step 9 v2

    const remainder = sum % 23; // step 11 v2 
    const checkDigitAlpha = Object.keys(alphabetConversionTable).find(
      key => alphabetConversionTable[key] === (23 - remainder) // step 14
    );
    return seventh === checkDigitAlpha; // step 15 
  }

  return false; 
}

// Helper functions
function isValidAlpha(char: string): boolean {
  return /^[A-HJ-NP-Z]$/.test(char); // Matches valid alphabetic characters excluding I and O
}

function isNumeric(char: string): boolean {
  return /^[0-9]$/.test(char); // Matches numeric characters
}


/* 
TESTING

const testNHIs = ['ZZZ0016', 'ZZZ0024', 'ZZZ0044', 'ZZZ00AC', 'ZVU27KE', 'ZAC5361'];
// results should be: T T F T T T


testNHIs.forEach(nhi => {
  const isValid = validateNHI(nhi);
  console.log(`NHI ${nhi} is ${isValid ? 'valid' : 'invalid'}`);
});

*/ 




