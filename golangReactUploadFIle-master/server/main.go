package main

import (
    "fmt"
    "log"
    "os"
    "strings"
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
    "github.com/google/uuid"
)

func main() {
    // create new fiber instance and use across the whole app
    app := fiber.New()

    // middleware to allow all clients to communicate using http and allow CORS
    app.Use(cors.New())

    // serve images from the images directory prefixed with /images
    app.Static("/images", "./images")

    // handle image uploading using post request
    app.Post("/", handleFileupload)

    // delete uploaded images by providing multiple image names
    app.Delete("/:imageNames", handleDeleteImage)

    // start dev server on port 4000
    log.Fatal(app.Listen(":4000"))
}

func handleFileupload(c *fiber.Ctx) error {
    form, err := c.MultipartForm()
    if err != nil {
        log.Println("image upload error --> ", err)
        return c.JSON(fiber.Map{"status": 500, "message": "Server error", "data": nil})
    }

    files := form.File["images"]

    var imageUrls []string

    for _, file := range files {
        // Generate unique ID for image name
        uniqueID := uuid.New()

        // Remove "-" from imageName
        filename := strings.Replace(uniqueID.String(), "-", "", -1)

        // Extract image extension from original filename
        fileExt := strings.Split(file.Filename, ".")[1]

        // Generate image name with extension
        imageName := fmt.Sprintf("%s.%s", filename, fileExt)

        // Save image to ./images directory
        err := c.SaveFile(file, fmt.Sprintf("./images/%s", imageName))
        if err != nil {
            log.Println("image save error --> ", err)
            return c.JSON(fiber.Map{"status": 500, "message": "Server error", "data": nil})
        }

        // Generate image URL
        imageUrl := fmt.Sprintf("http://localhost:4000/images/%s", imageName)
        imageUrls = append(imageUrls, imageUrl)
    }

    // Return list of image URLs to the client
    return c.JSON(fiber.Map{"status": 201, "message": "Images uploaded successfully", "data": imageUrls})
}

func handleDeleteImage(c *fiber.Ctx) error {
    // extract image names from params
    imageNames := strings.Split(c.Params("imageNames"), ",")

    // delete each image from ./images
    for _, imageName := range imageNames {
        err := os.Remove(fmt.Sprintf("./images/%s", imageName))
        if err != nil {
            log.Println(err)
            return c.JSON(fiber.Map{"status": 500, "message": "Error deleting images", "data": nil})
        }
    }

    return c.JSON(fiber.Map{"status": 201, "message": "Images deleted successfully", "data": nil})
}

