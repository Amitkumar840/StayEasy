import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);


// AI Chat Service
export const generateAIResponse = async (message) => {

    try {

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });


        const result = await model.generateContent(
            message
        );


        const response = result.response.text();


        return response;


    } catch (error) {

        console.log(
            "AI Service Error:",
            error.message
        );

        return "Sorry, I am unable to process your request.";

    }
};