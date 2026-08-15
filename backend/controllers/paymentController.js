const crypto = require("crypto");
const Order = require("../models/order");

// Helper to generate HMAC-SHA256 Base64 signature for eSewa v2
const generateEsewaSignature = (secretKey, totalAmount, transactionUuid, productCode) => {
    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const hmac = crypto.createHmac("sha256", secretKey);
    hmac.update(message);
    return hmac.digest("base64");
};

// Initiate eSewa Payment
const initiateEsewaPayment = async (req, res) => {
    try {
        const { amount, orderId, redirectUrl } = req.body;
        if (!amount || !orderId) {
            return res.status(400).json({ message: "Amount and orderId are required" });
        }

        const productCode = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
        const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
        const gatewayUrl = process.env.ESEWA_GATEWAY_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        const totalAmountStr = String(amount);
        const transactionUuid = `${orderId}-${Date.now()}`;

        const signature = generateEsewaSignature(
            secretKey,
            totalAmountStr,
            transactionUuid,
            productCode
        );

        const successUrl = redirectUrl || `${process.env.FRONTEND_URL}/order-success/${orderId}`;
        const failureUrl = `${process.env.FRONTEND_URL}/checkout`;

        const esewaPayload = {
            amount: totalAmountStr,
            tax_amount: "0",
            total_amount: totalAmountStr,
            transaction_uuid: transactionUuid,
            product_code: productCode,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: successUrl,
            failure_url: failureUrl,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature,
            esewa_payment_url: gatewayUrl
        };

        return res.status(200).json(esewaPayload);
    } catch (error) {
        console.error("eSewa Payment Initiation Error:", error);
        res.status(500).json({ message: "eSewa payment initiation failed: " + error.message });
    }
};

// Verify eSewa Payment
const verifyEsewaPayment = async (req, res) => {
    try {
        const { data, orderId } = req.body;

        if (!data) {
            return res.status(400).json({ message: "Payment response data is required" });
        }

        // Decode Base64 response data sent by eSewa
        const decodedString = Buffer.from(data, 'base64').toString('utf-8');
        const decodedData = JSON.parse(decodedString);

        const { status, transaction_code, transaction_uuid } = decodedData;

        if (status === "COMPLETE" || status === "SUCCESS") {
            const targetOrderId = orderId || (transaction_uuid ? transaction_uuid.split('-')[0] : null);

            if (targetOrderId) {
                await Order.findByIdAndUpdate(targetOrderId, {
                    status: "Completed",
                    paymentId: `ESEWA-${transaction_code || transaction_uuid}`
                });
            }

            return res.status(200).json({
                success: true,
                message: "eSewa payment verified successfully",
                orderId: targetOrderId,
                transactionCode: transaction_code
            });
        } else {
            return res.status(400).json({
                success: false,
                message: `Payment status is ${status}`
            });
        }
    } catch (error) {
        console.error("eSewa Payment Verification Error:", error);
        res.status(500).json({ message: "eSewa payment verification failed: " + error.message });
    }
};

module.exports = {
    initiateEsewaPayment,
    verifyEsewaPayment,
    createPaymentOrder: initiateEsewaPayment,
    verifyPayment: verifyEsewaPayment
};