const s3BucketWebhook = require("./src/build/bucket");

module.exports = { s3WebhookHandler: s3BucketWebhook.handler };
