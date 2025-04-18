const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticate, userController.getUserLogin);

router.post("/verify-password", authenticate, userController.verifyPassword);
router.post("/request-otp", authenticate, userController.requestOtp);
router.post("/update-email", authenticate, userController.verifyUpdatedEmail);
router.put("/update-password", authenticate, userController.updatePassword);

// HARUSNYA NANTI DITANDAI, HANYA BISA ADMIN YG BISA MELIHAT ALL USERS, TAMBAHKAN MIDDLEWARE NANTI DISINI
router.get("/users", authenticate, userController.getUsers);
router.get("/users/:id", authenticate, userController.getUserById);
router.put("/users/:id", authenticate, userController.updateUser);
router.delete("/users/:id", authenticate, userController.deleteUser);
router.get("/users/email/:email", authenticate, userController.getUserByEmail);

module.exports = router;
