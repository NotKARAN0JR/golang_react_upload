import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const useUpload = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const toast = useToast();

  const handleChangeImage = (e) => {
    const fileList = Array.from(e.target.files);
    setImages(fileList);
  };

  const handleUploadImage = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      images.forEach((file) => {
        formData.append("images", file);
      });
      const res = await axios.post("/", formData);
      if (res.data.data) {
        setUploadedImages(res.data.data);
        toast({
          title: "Images Uploaded",
          description: res.data.message,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading images",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setImages([]);
      setLoading(false);
    }
  };

  const handleRemoveImages = async (imageNames) => {
    try {
      setLoading(true);
      const res = await axios.delete(`/${imageNames.join(",")}`);
      if (res.data.status === 201) {
        setUploadedImages((prevImages) =>
          prevImages.filter((image) => !imageNames.includes(image))
        );
        toast({
          title: "Images Deleted",
          description: res.data.message,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to delete images");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Deletion Failed",
        description: "An error occurred while deleting the images",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    images,
    uploadedImages,
    loading,
    handleChangeImage,
    handleUploadImage,
    handleRemoveImages,
  };
};

export default useUpload;
