const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("../utills/sesClient");


const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
        Destination: {

            CcAddresses: [

            ],
            ToAddresses: [
                toAddress,

            ],
        },
        Message: {

            Body: {

                Html: {
                    Charset: "UTF-8",
                    Data: "<h1>This is email body </h1>",
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "This is text format",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Hello World",
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [
            /* more items */
        ],
    });
};



const run = async (subject, body) => {
    const sendEmailCommand = createSendEmailCommand(
        "sunnymahato@nexgsolutions.com",
        "sunnymahto9824@gmail.com",
        subject,
        body
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        throw caught;
    }
};


module.exports = { run };
