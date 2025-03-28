import mongoose from "mongoose";

//filter by property and project: &propertyOrProject=project
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10, // Minimum 10 characters
      maxlength: 500, // Maximum 500 characters
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["PENDING", "CALLING", "QUALIFIED", "UNQUALIFIED"],
      default: "PENDING",
    },
    feedBack: {
      // add validation
      type: String,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  },
  {
    timestamps: true,
  }
);

// Single validation logic in a pre-save middleware
leadSchema.pre("validate", function (next) {
  if (this.project && this.property) {
    return next(
      new Error(
        "A lead can be associated with either a project or a property, but not both."
      )
    );
  }
  if (!this.project && !this.property) {
    return next(
      new Error(
        "A lead must be associated with either a project or a property."
      )
    );
  }
  next();
});

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
