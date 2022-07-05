import cv2
import numpy as np
import imutils

webcam = cv2.VideoCapture(0)

# webcam.set(3, 640)
# webcam.set(4, 480)

while True:
    _, imageFrame = webcam.read()

    hsvFrame = cv2.cvtColor(imageFrame, cv2.COLOR_BGR2HSV)

    green_lower = np.array([63-50, 122-50, 129-50], np.uint8)
    green_upper = np.array([63+50, 122+50, 129+50], np.uint8)

    green_mask = cv2.inRange(hsvFrame, green_lower, green_upper)

    cnts = cv2.findContours(green_mask, cv2.RETR_TREE,
                            cv2.CHAIN_APPROX_SIMPLE)

    cnts = imutils.grab_contours(cnts)

    maxC = 0
    maxCArea = 0
    for c in cnts:
        area = cv2.contourArea(c)

        if(maxCArea < area):
            maxC = c
            maxCArea = area

    cv2.drawContours(imageFrame, [maxC], -1, (0, 255, 0), 3)

    M = cv2.moments(maxC)

    if M['m00'] != 0:
        cx = int(M['m10']/M['m00'])
        cy = int(M['m01']/M['m00'])

        cv2.circle(imageFrame, (cx, cy), 7, (255, 255, 255), -1)

    cv2.imshow("imageFrame", imageFrame)

    # k = cv2.waitKey(0)
    # if k == 27:
    # break

    # Program Termination
    # cv2.setMouseCallback(projector, mouseRGB)
    cv2.imshow("Center-detection", imageFrame)
    if cv2.waitKey(10) & 0xFF == ord('q'):
        cap.release()
        cv2.destroyAllWindows()
        break


webcam.release()
cv2.detroyAllWindows()
