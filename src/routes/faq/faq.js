import {Router} from "express"
import { createFaq, deleteFaq, getFaq, updateFaq } from "../../controllers/faq/faq.js";

const faqRouter = Router();

faqRouter.post( "/createFaq" , createFaq);
faqRouter.get("/getfaq" , getFaq);
faqRouter.patch("/updateFaq/:id" ,  updateFaq);
faqRouter.delete("/deleteFaq/:id" , deleteFaq);

export default faqRouter;