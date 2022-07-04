import numpy as np
import cv2

# image

# def mouseRGB(event, x, y, flags, param):
#     if event == cv2.EVENT_LBUTTONDOWN:  # checks mouse left button down condition
#         colorsB = image[y, x, 0]
#         colorsG = image[y, x, 1]
#         colorsR = image[y, x, 2]
#         colors = image[y, x]
#         print("Red: ", colorsR)
#         print("Green: ", colorsG)
#         print("Blue: ", colorsB)
#         print("BRG Format: ", colors)
#         print("Coordinates of pixel: X: ", x, "Y: ", y)


def main():
    # Capturing video through webcam
    webcam = cv2.VideoCapture(0)

    # Start a while loop
    while(1):

        # Reading the video from the
        # webcam in image frames
        _, imageFrame = webcam.read()

        # Convert the imageFrame in
        # BGR(RGB color space) to
        # HSV(hue-saturation-value)
        # color space
        hsvFrame = cv2.cvtColor(imageFrame, cv2.COLOR_BGR2HSV)


        # Set range for green color and
        # define mask
        # green_lower = np.array([25, 52, 72], np.uint8)
        # green_upper = np.array([102, 255, 255], np.uint8)
        green_lower = np.array([63-50, 122-50, 129-50], np.uint8)
        green_upper = np.array([63+50, 122+50, 129+50], np.uint8)
        green_mask = cv2.inRange(hsvFrame, green_lower, green_upper)


        # Morphological Transform, Dilation
        # for each color and bitwise_and operator
        # between imageFrame and mask determines
        # to detect only that particular color
        kernal = np.ones((5, 5), "uint8")


        # For green color
        green_mask = cv2.dilate(green_mask, kernal)
        res_green = cv2.bitwise_and(imageFrame, imageFrame,
                                    mask=green_mask)


        # Creating contour to track green color
        contours, hierarchy = cv2.findContours(green_mask,
                                            cv2.RETR_TREE,
                                            cv2.CHAIN_APPROX_SIMPLE)

        for pic, contour in enumerate(contours):
            area = cv2.contourArea(contour)
            if(area > 300):
                x, y, w, h = cv2.boundingRect(contour)
                imageFrame = cv2.rectangle(imageFrame, (x, y),
                                        (x + w, y + h),
                                        (0, 255, 0), 2)

                cv2.putText(imageFrame, "Green Colour", (x, y),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1.0, (0, 255, 0))


        # Program Termination
        projector = "color-detect"

        cv2.namedWindow(projector)
        # cv2.setMouseCallback(projector, mouseRGB)
        cv2.imshow(projector, imageFrame)
        if cv2.waitKey(10) & 0xFF == ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            break


if __name__ == "__main__":
    main()
