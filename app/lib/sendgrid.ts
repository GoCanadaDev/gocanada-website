import sendgrid from "@sendgrid/client"

sendgrid.setApiKey(String(process.env.SENDGRID_API_KEY))

export default sendgrid
