const cloudianry = require("cloudinary");
cloudianry.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});
const clouduploadimg = async (files) => {
  return new Promise((resolve) => {
    cloudianry.uploader.upload(files, (result) => {
      resolve(
        {
          url: result.secure_url,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

module.exports= clouduploadimg