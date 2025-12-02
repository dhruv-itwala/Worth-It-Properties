// userHash.js
import bcrypt from "bcrypt";

// -------- EDIT THIS --------
const plainPassword = "Admin1234";
// ----------------------------

async function generateHash() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    console.log("\n===============================");
    console.log(" Plain Password :", plainPassword);
    console.log(" Encrypted Hash :");
    console.log(hash);
    console.log("===============================\n");

    process.exit(0);
  } catch (err) {
    console.error("Error hashing password:", err);
    process.exit(1);
  }
}

generateHash();
