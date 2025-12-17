const functions = require("firebase-functions");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

admin.initializeApp();

exports.cleanupUserData = functions
    .region("us-central1")
    .auth.user()
    .onDelete(async (user) => {
      const uid = user.uid;

      logger.log(`[Cleanup] Starting for user: ${uid}`);

      const db = admin.firestore();
      const bucket = admin.storage().bucket();

      const firestorePromise = (async () => {
        const batch = db.batch();

        const userDocRef = db.collection("users").doc(uid);
        batch.delete(userDocRef);
        logger.log(
            `[Cleanup] Scheduled deletion for doc: ${userDocRef.path}`,
        );

        const bookingsQuery = db
            .collection("bookings")
            .where("userId", "==", uid);
        const bookingsSnapshot = await bookingsQuery.get();

        if (bookingsSnapshot.empty) {
          logger.log(`[Cleanup] No bookings found for user: ${uid}.`);
        } else {
          bookingsSnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });
          logger.log(
              "[Cleanup] Scheduled deletion for " +
              `${bookingsSnapshot.size} booking(s).`,
          );
        }

        return batch.commit();
      })();

      const storagePromise = (async () => {
        const avatarPath = `avatars/${uid}`;
        const file = bucket.file(avatarPath);

        try {
          await file.delete();
          logger.log(
              `[Cleanup] Successfully deleted Storage file: ${avatarPath}`,
          );
        } catch (error) {
          if (error.code === 404) {
            logger.log(
                `[Cleanup] No avatar found at ${avatarPath}. Skipping.`,
            );
          } else {
            logger.error(
                `[Cleanup] Failed to delete Storage file ${avatarPath}`,
                error,
            );
          }
        }
      })();

      try {
        await Promise.all([firestorePromise, storagePromise]);
        logger.log(
            `[Cleanup] Successfully completed all cleanup for user: ${uid}`,
        );
      } catch (error) {
        logger.error(
            "[Cleanup] A critical error occurred during cleanup for user " +
            `${uid}`,
            error,
        );
      }
    });
