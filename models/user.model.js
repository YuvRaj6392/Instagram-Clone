module.exports = (mongoose) => {
  const User = mongoose.model(
    "user",
    mongoose.Schema(
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
          index: true,
        },
        password: {
          type: String,
          required: true,
        },
        isLoggedIn: {
          type: Boolean,
          default: false,
        },
        pic:{
          type:String,
          default:"https://res.cloudinary.com/yuvraj6392/image/upload/v1689694050/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931_wdrrr3.avif"
        },
        followers:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}],
        following:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}],
      },
      {
        timestamps: true,
      }
    )
  );
  return User;
};
