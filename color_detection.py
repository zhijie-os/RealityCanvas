import numpy as np
import cv2

# image


BGRfilter = [0,0,0]
imageFrame = None

def mouseRGB(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:  # checks mouse left button down condition
        colorsB = imageFrame[y, x, 0]
        colorsG = imageFrame[y, x, 1]
        colorsR = imageFrame[y, x, 2]
        colors = imageFrame[y, x]
        BGRfilter[0] = colorsB
        BGRfilter[1] = colorsG
        BGRfilter[2] = colorsR
        
        print("Red: ", colorsR)
        print("Green: ", colorsG)
        print("Blue: ", colorsB)
        print("BRG Format: ", colors)
        print("Coordinates of pixel: X: ", x, "Y: ", y)



def main():

    # use global variables 
    global imageFrame, BGRfilter

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
        # selected_lower = np.array([25, 52, 72], np.uint8)
        # selected_upper = np.array([102, 255, 255], np.uint8)
        selected_lower = np.array([BGRfilter[0]-30,BGRfilter[1]-30,BGRfilter[2]-30], np.uint8)
        selected_upper = np.array([BGRfilter[0]+30,BGRfilter[1]+30,BGRfilter[2]+30], np.uint8)
        selected_mask = cv2.inRange(hsvFrame, selected_lower, selected_upper)


        # Morphological Transform, Dilation
        # for each color and bitwise_and operator
        # between imageFrame and mask determines
        # to detect only that particular color
        kernal = np.ones((5, 5), "uint8")


        # For green color
        selected_mask = cv2.dilate(selected_mask, kernal)
        res_selected = cv2.bitwise_and(imageFrame, imageFrame,
                                    mask=selected_mask)


        # Creating contour to track green color
        contours, hierarchy = cv2.findContours(selected_mask,
                                            cv2.RETR_TREE,
                                            cv2.CHAIN_APPROX_SIMPLE)

        for pic, contour in enumerate(contours):
            area = cv2.contourArea(contour)
            if(area > 300):
                x, y, w, h = cv2.boundingRect(contour)
                imageFrame = cv2.rectangle(imageFrame, (x, y),
                                        (x + w, y + h),
                                        (0, 255, 0), 2)

                cv2.putText(imageFrame, "Colored Area", (x, y),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1.0, (0, 255, 0))


        # Program Termination
        projector = "color-detect"

        cv2.namedWindow(projector)
        cv2.setMouseCallback(projector, mouseRGB)
        if(BGRfilter[0]!=0):
            cv2.imshow(projector, res_selected)
        else:
            cv2.imshow(projector, imageFrame)
        if cv2.waitKey(10) & 0xFF == ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            break


if __name__ == "__main__":
    main()
