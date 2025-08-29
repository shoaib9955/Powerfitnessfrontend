import cron from "node-cron";
import Member from "../models/memberModel.js";
import { sendSMS } from "../utils/mailer.js";

cron.schedule(
  "0 9 * * *",
  async () => {
    try {
      const today = new Date();
      const reminderDate = new Date(today);
      reminderDate.setDate(today.getDate() + 10);

      const members = await Member.find({
        expiryDate: {
          $gte: new Date(reminderDate.setHours(0, 0, 0, 0)),
          $lt: new Date(reminderDate.setHours(23, 59, 59, 999)),
        },
      });

      await Promise.all(
        members.map((member) => {
          const message = `Hello ${member.name}, your gym subscription will expire on ${member.expiryDateString}. Please renew soon.`;
          return sendSMS(member.phone, message).catch((err) =>
            console.error(`Failed to send SMS to ${member.phone}:`, err)
          );
        })
      );

      console.log(`✅ Sent reminders to ${members.length} members`);
    } catch (err) {
      console.error("Cron job error:", err);
    }
  },
  { timezone: "Asia/Kolkata" }
);
