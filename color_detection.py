import numpy as np
import cv2
import imutils
# image


HSVfilter = [0,0,0]
hsvFrame = None


def mouseRGB(event, x, y, flags, param):
    global HSVfilter
    if event == cv2.EVENT_LBUTTONDOWN:  # checks mouse left button down condition
        
        HSVfilter = hsvFrame[y, x]
        print(HSVfilter)
    



def getBound():
    global HSVfilter
    h = HSVfilter[0]
    s = HSVfilter[1]
    v = HSVfilter[2]
    
    lower_bound = np.array(
        [ h-20 if h-20>=0 else h, s-20 if s-20>=0 else s , v-20 if v-20>=0 else v], np.uint8)

    upper_bound = np.array(
        [ h+20 if h+20<=179 else h, s+20 if s+20<=255 else s , v+20 if v+20<=255 else v], np.uint8)
    return lower_bound, upper_bound


def maximumAreaContour(contours):
        cnts = imutils.grab_contours(contours)
        maxC = []
        maxCArea = 0
        for c in cnts:
            area = cv2.contourArea(c)

            if(maxCArea < area):
                maxC = c
                maxCArea = area
        
        return maxC

def main():
    # use global variables
    global hsvFrame, HSVfilter

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
        # print(HSVfilter)
        # define mask

        lower_bound, upper_bound = getBound()
        
        mask = cv2.inRange(hsvFrame, lower_bound, upper_bound)

        # Morphological Transform, Dilation
        # for each color and bitwise_and operator
        # between imageFrame and mask determines
        # to detect only that particular color
        kernal = np.ones((5, 5), "uint8")

        mask = cv2.dilate(mask, kernal)
        resFrame = cv2.bitwise_and(imageFrame, imageFrame,
                                       mask=mask)

        # Creating contour to track green color
        contours = cv2.findContours(mask,
                                               cv2.RETR_TREE,
                                               cv2.CHAIN_APPROX_SIMPLE)

        
        maxC = maximumAreaContour(contours)

        if len(maxC) > 0 :
            cv2.drawContours(imageFrame, [maxC], -1, (0, 255, 0), 3)

            M = cv2.moments(maxC)

            if M['m00'] != 0:
                cx = int(M['m10']/M['m00'])
                cy = int(M['m01']/M['m00'])

                cv2.circle(imageFrame, (cx, cy), 7, (255, 255, 255), -1)


        # Program Termination
        projector = "color-detect"

        cv2.namedWindow(projector)
        cv2.setMouseCallback(projector, mouseRGB)
        if(HSVfilter[0] != 0):
            cv2.imshow(projector, resFrame)
        else:
            cv2.imshow(projector, imageFrame)
        if cv2.waitKey(10) & 0xFF == ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            break





if __name__ == "__main__":
    main()
