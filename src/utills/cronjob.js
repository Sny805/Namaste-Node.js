const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("./sendEmail")


cron.schedule("0 8 * * *", async () => {
    try {
        const yesterday = subDays(new Date(), 0)
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            },
        }).populate("fromUserId toUserId")


        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))]

        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run("New friend request is pending for" + email, "There are so many friend requets are pending");
            }
            catch (err) {

            }

        }
    }
    catch (err) {

    }
})