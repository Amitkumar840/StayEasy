import Payment from "../models/Payment.js";


// Create Payment Record
export const createPaymentService = async (paymentData) => {

    const payment = await Payment.create({
        booking: paymentData.booking,
        user: paymentData.user,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        paymentStatus: "pending"
    });


    return payment;
};



// Update Payment Status
export const updatePaymentStatus = async (
    paymentId,
    status
) => {

    const payment = await Payment.findByIdAndUpdate(
        paymentId,
        {
            paymentStatus: status
        },
        {
            new: true
        }
    );


    return payment;
};