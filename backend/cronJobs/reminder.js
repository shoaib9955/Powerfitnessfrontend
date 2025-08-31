import cron from "node-cron";
import Member from "../models/memberModel.js";
import { sendEmail } from "../utils/mailer.js";

cron.schedule(
  "0 9 * * *", // Runs daily at 9:00 AM
  async () => {
    try {
      const today = new Date();
      const reminderDate = new Date(today);
      reminderDate.setDate(today.getDate() + 10);

      // Start and end of reminder day
      const startOfDay = new Date(reminderDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(reminderDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Find members whose subscription expires in 10 days
      const members = await Member.find({
        expiryDate: { $gte: startOfDay, $lt: endOfDay },
      });

      await Promise.all(
        members.map(async (member) => {
          const expiryDateFormatted = new Date(
            member.expiryDate
          ).toLocaleDateString("en-IN");

          const subject = "⚠️ Gym Membership Expiry Reminder";
          const message = `
            Hello ${member.name},<br><br>
            This is a reminder that your <b>PowerFitness</b> gym subscription will expire on 
            <b>${expiryDateFormatted}</b>.<br><br>
            Please renew your membership soon to continue your fitness journey without interruption.<br><br>
            Stay fit,<br>
            PowerFitness Team 🏋️‍♂️
          `;

          try {
            await sendEmail(member.email, subject, message);
            console.log(`✅ Reminder email sent to ${member.email}`);
          } catch (err) {
            console.error(
              `❌ Failed to send email to ${member.email}:`,
              err.message
            );
          }
        })
      );

      console.log(
        `📢 Reminder job finished: ${members.length} members processed`
      );
    } catch (err) {
      console.error("❌ Cron job error:", err);
    }
  },
  { timezone: "Asia/Kolkata" }
);
