import { COOKIE_OPTIONS } from "../../../constants.js";
import User from "../../models/user/user.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/error/asyncHandler.js";
import jwt from "jsonwebtoken"
export const loggedInUserData = asyncHandler(async (req, res, next) => {
    const user = req.user;
console.log("the user is", user)
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User not authenticated",
        });
    }

    try {
        const data = await User.findById(user._id);

        if (!data) {
            return next(new ApiError("Unable to find the user", 404));
        }

        res.status(200).json({
            success: true,
            data: data,
            message: "User found successfully",
        });
    } catch (error) {
        next(error); // Let the global error handler handle server errors
    }
});


export const refreshTokenController = asyncHandler(async(req, res,next)=>{
    const clientRefreshToken = req.cookies.refresh_token
    if (!clientRefreshToken) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return next(new ApiError("No refresh token provided", 401));
    }
    try {
        const decoded = jwt.verify(clientRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        // FIND USER USING THE DECODED._ID
        const user = await User.findById(decoded?._id)
        if(!user || clientRefreshToken !== user?.refreshToken){
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            return next(new ApiError("Refresh token expired", 401))
        }
        const access_token = user.generateAccessToken();
        const refresh_token = user.generateRefreshToken();

        user.refreshToken = refresh_token;
        await user.save({validateBeforeSave:false})

        return res.status(201).cookie("access_token", access_token,{
            ...COOKIE_OPTIONS,
            expires: new Date(Date.now() + 20 * 60 * 1000),
        })
        .cookie("refresh_token", refresh_token,{
        ...COOKIE_OPTIONS,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Expires in 15 days
        })
        .json({status: true , message:"User logged in"})
    } catch (error) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return next(new ApiError("Invalid refresh token", 401));
    }
})