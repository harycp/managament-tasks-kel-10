const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticate, userController.getUserLogin);

router.post("/verify-password", authenticate, userController.verifyPassword);
router.post("/request-otp", authenticate, userController.requestOtp);
router.post("/update-email", authenticate, userController.verifyUpdatedEmail);
router.put("/update-password", authenticate, userController.updatePassword);

router.get("/users", authenticate, userController.getUsers);

router.get("/users/by-email", authenticate, userController.getUserByEmail);
router.post("/users/batch", authenticate, userController.getUsersBatch);
router.get("/users/batch", authenticate, userController.getUsersInBatch);

router.get("/users/:id", authenticate, userController.getUserById);
router.put("/users/:id", authenticate, userController.updateUser);
router.delete("/users/:id", authenticate, userController.deleteUser);

module.exports = router;
