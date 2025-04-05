import { Button, Heading, VStack, Image, HStack } from "@chakra-ui/react";
import React, { useRef } from "react";
import useUpload from "../hooks/useUpload";

function Upload() {
  const imageRef = useRef(null);
  const {
    loading,
    images,
    uploadedImages,
    handleChangeImage,
    handleUploadImage,
    handleRemoveImages,
  } = useUpload();
  
  const handleRemoveImage = async (imageName) => {
    await handleRemoveImages([imageName]);
  };

  return (
    <div>
      <input
        style={{ display: "none" }}
        type="file"
        accept="image/*"
        ref={imageRef}
        onChange={handleChangeImage}
        multiple
      />
      <VStack>
        <Heading>Upload image golang +  react js</Heading>
        <Button
          onClick={() => imageRef.current.click()}
          colorScheme="blue"
          size="lg"
        >
          Select Images
        </Button>
      </VStack>
      {images.length > 0 && (
        <VStack my="4">
          {images.map((image, index) => (
            <div key={index}>
              <Image
                src={URL.createObjectURL(image)}
                width="300px"
                height="300px"
                alt={`selected image ${index + 1}`}
              />
            </div>
          ))}
          <Button
            onClick={handleUploadImage}
            variant="outline"
            colorScheme="green"
            isLoading={loading}
          >
            Upload
          </Button>
        </VStack>
      )}

      {uploadedImages.length > 0 && (
        <VStack my="4">
          {uploadedImages.map((uploadedImage, index) => (
            <div key={index}>
              <Image
                src={uploadedImage}
                width="300px"
                height="300px"
                alt={`uploaded image ${index + 1}`}
              />
              <HStack>
                
              
              </HStack>
            </div>
          ))}
        </VStack>
      )}
    </div>
  );
}

export default Upload;
